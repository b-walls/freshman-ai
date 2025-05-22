import os
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langgraph.graph import START, StateGraph
from typing_extensions import List, TypedDict
from langchain_core.documents import Document
from langchain.prompts import PromptTemplate
from pydantic import BaseModel

# Constants
EMBEDDING_MODEL = "text-embedding-3-small"
LLM_MODEL = "gpt-4.1-nano"

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

env_path = Path(os.getcwd()) / ".env"
load_dotenv(dotenv_path=env_path, override=True)

# Initialize OpenAI LLM and embedding model
llm = ChatOpenAI(model=LLM_MODEL, temperature=0)
embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)

# Initialize vector store retriever
vector_store = Chroma(
    persist_directory=str(Path(__file__).parent / "chroma_index"),
    embedding_function=embeddings
)

# Define the prompt template for the LLM
custom_prompt = PromptTemplate(
    input_variables=["context", "question", "history"],
    template="""
    You are a helpful assistant for JMU freshman. Use the following pieces of retrieved context to
    answer the question. If the question is not related to JMU, say "I'm sorry, I can't help with that".
    You are not allowed to make up information. If the context does not contain the answer, say "I don't know".
    Chat history is provided for extra context, but you should not use it to answer the question.
    Be friendly and personable in your response.
    
    Question: 
    {question}
    
    Context: 
    {context}

    Here is the chat history for extra context:
    {history}
    Answer:
    """
)

class State(TypedDict):
    """Represents the state passed between graph nodes."""
    question: str
    context: List[Document]
    answer: str
    history: List[str]


def retrieve(state: State):
    """Retrieve relevant documents based on the question.

    Args:
        state (State): The current state including the user's question.

    Returns:
        dict: A dictionary with retrieved documents under 'context'.
    """
    retrieved_docs = vector_store.similarity_search(state["question"])
    return {"context": retrieved_docs}

def generate(state: State):
    """Generate an answer based on retrieved context.

    Args:
        state (State): The state containing the user's question and context.

    Returns:
        dict: A dictionary with the generated answer.
    """
    docs_content = "\n\n".join(doc.page_content for doc in state["context"])
    history = state.get("history", [])
    messages = custom_prompt.format(
        question=state["question"],
        context=docs_content,
        history=history
    )
    response = llm.invoke(messages)
    history.append(f"\nUser: {state['question']}\nAssistant: {response.content}")
    return {"answer": response.content,
            "history": history}


# Compile application graph
graph_builder = StateGraph(State).add_sequence([retrieve, generate])
graph_builder.add_edge(START, "retrieve")
graph = graph_builder.compile()

chat_history = []

class QueryRequest(BaseModel):
    """
    Represents the request payload for a user query.

    Attributes:
        query (str): The question submitted by the user.
    """
    query: str

@app.post("/api/ask")
async def fetch_response(request: QueryRequest):
    """
    Handles incoming POST requests to the /api/ask endpoint.

    Args:
        request (QueryRequest): The request object containing the user’s query.

    Returns:
        dict: A dictionary with the generated answer from the LLM.
    """
    global chat_history
    print(request.query)
    response = graph.invoke({"question": request.query, "history": chat_history})
    chat_history = response["history"]

    if len(chat_history) > 10:
        chat_history = chat_history[1:]
    
    print("user: ", request.query)
    print("assistant: ", response["answer"])
    return {"answer": response["answer"]}
