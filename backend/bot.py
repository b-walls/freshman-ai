"""Script to run the JMU Freshman Assistant chatbot from console.

This script uses LangChain, LangGraph, and OpenAI's API to create an interactive Q&A bot.
The bot retrieves relevant information from embedded documents and generates helpful responses
using a language model.

Modules:
    - dotenv: for loading OpenAI API keys
    - langchain_openai: for OpenAI LLM and embeddings
    - langchain_chroma: for persistent vector store
    - langgraph.graph: for state-based chaining
    - langchain_core.documents: for document representation
    - langchain.hub: for pulling reusable prompt templates

Author: Brendan Walls
"""

from pathlib import Path
import os
import time
import sys

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_chroma import Chroma
from langgraph.graph import START, StateGraph
from typing_extensions import List, TypedDict
from langchain_core.documents import Document
from langchain.prompts import PromptTemplate

# Constants
EMBEDDING_MODEL = "text-embedding-3-small"
LLM_MODEL = "gpt-4.1-nano"

# Load environment
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

# Load prompt template from LangChain Hub
custom_prompt = PromptTemplate(
    input_variables=["context", "question", "history"],
    template="""
    You are a helpful assistant for JMU freshman. Use the following pieces of retrieved context to
    answer the question. If you don't know the answer, just say that you don't know. Use three sentences
    maximum, unless instructed to make a list, in which case you will create a bullet point list extending
    the length necessary for the question. Keep all answers concise.

    Question: {question}
    Context: {context}
    History: {history}
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

def typing_print(text, delay=0.02):
    """Simulates typing effect for console output.

    Args:
        text (str): Text to display.
        delay (float): Delay in seconds per character.
    """
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        time.sleep(delay)
    print()

if __name__ == "__main__":
    typing_print("Hello, I'm here to help you navigate your first year as a JMU student!")
    typing_print("What can I help you with?")
    history = []
    while True:
        q = input("> ")
        if q == "q":
            break
        response = graph.invoke({"question": q, "history": history})
        typing_print(response["answer"], 0.03)

        history = response["history"]
        if len(history) > 10:
            history = history[1:]
        print()
    