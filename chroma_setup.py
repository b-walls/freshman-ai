"""
This script processes and embeds a PDF document into a vector store using LangChain and FAISS. 
It provides functionality to either re-embed and chunk the document or test the relevancy of 
stored embeddings against user queries.
Modules Used:
- `os` and `pathlib.Path`: For file path handling.
- `langchain.text_splitter.CharacterTextSplitter`: To split the document into smaller text chunks.
- `langchain_openai.OpenAIEmbeddings`: To generate embeddings for the text chunks.
- `langchain_community.document_loaders.PyPDFLoader`: To load PDF documents.
- `langchain_community.vectorstores.FAISS`: To store and retrieve embeddings.
- `dotenv.load_dotenv`: To load environment variables from a `.env` file.
Functions:
- `main()`: Handles the embedding and chunking process, saving the vector store locally.
Workflow:
1. Load environment variables from a `.env` file (e.g., OpenAI API key).
Interactive Features:
- Prompts the user to decide whether to re-embed and chunk the document or load an existing vector 
store.
- Allows the user to test the relevancy of stored embeddings by querying the vector store.
Usage:
- Run the script and follow the prompts to either re-embed the document or test relevancy.
"""

import os
from pathlib import Path
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.document_loaders import PyPDFLoader
from langchain_chroma import Chroma
from dotenv import load_dotenv

EMBEDDING_MODEL = "text-embedding-3-small"

def main():
    """
    Main function to process and embed a PDF document into a vector store.
    Steps:
    1. Load environment variables from a `.env` file, including the OpenAI API key.
    2. Load a PDF document using `PyPDFLoader`.
    3. Split the document into smaller text chunks using `CharacterTextSplitter`.
    4. Generate embeddings for the text chunks using `OpenAIEmbeddings`.
    5. Store the embeddings in a FAISS vector store and save it locally.
    """
    # load the pdf
    loader = PyPDFLoader("one_book.pdf")
    documents = loader.load()

    # chunk
    text_splitter = CharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100
    )

    chunks = text_splitter.split_documents(documents)

    # embed
    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)
    vectorstore = Chroma.from_documents(chunks, embeddings, persist_directory="chroma_index")

if __name__ == "__main__":
    # Get environment variables (OPENAI_API_KEY)
    env_path = Path(os.getcwd()) / ".env"
    load_dotenv(dotenv_path=env_path, override=True)

    response = input("Recreate chroma index? y/n\n")
    if response == "y":
        main()

    embeddings = OpenAIEmbeddings(model=EMBEDDING_MODEL)
    vectorstore = Chroma(persist_directory="chroma_index", embedding_function=embeddings)
    while input("Test relevancy? [y for continue] \n") == "y":

        query = input("Document query: ")
        retriever = vectorstore.as_retriever(search_kwargs={"k": 2})
        relevant_docs = retriever.invoke(query)
        for doc in relevant_docs:
            print("------------------------------------")
            print(doc.page_content)
        print("------------------------------------")
    