import os
from dotenv import load_dotenv
from langchain_community.document_loaders import JSONLoader
# from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

load_dotenv()

print("Starting ingestion script...")
print("Libraries imported.")


if "GOOGLE_API_KEY" not in os.environ:
    print("Error: GOOGLE_API_KEY not found in .env file.")
    print("Please create a .env file and add your API key.")
    exit()
else:
    print("GOOGLE_API_KEY loaded successfully.")

def metadata_func(record: dict, metadata:dict)->dict:  
    record_metadata = record.get("metadata", {})
    metadata["state"] = record_metadata.get("state")
    metadata["country"] = record_metadata.get("country")
    metadata["city_district"] = record_metadata.get("city_district")
    metadata["crop"] = record_metadata.get("crop")
    metadata["topic"] = record_metadata.get("topic")
    metadata["source_url"] = record_metadata.get("source_url")
    metadata["source"] = metadata.get("source", "unknown")
    
    return metadata

loader = JSONLoader(
    file_path="0.FARMER_bot/knowledge_base.json",
    jq_schema=".[]",       # This query means "iterate over each object in the root list"
    content_key="content",  # The "content" field is the main text
    metadata_func=metadata_func
)
try:
    documents = loader.load()
    print(f"Loaded {len(documents)} documents.")
except Exception as e:
    print(f"Error loading JSON file: {e}")
    print("Please ensure 'knowledge_base.json' exists and is in the correct format.")
    print("Also ensure you ran 'pip install jq'")
    exit()


try:
    import torch
    embedding_model = "all-MiniLM-L6-v2"
    if torch.cuda.is_available():
        device = 'cuda'
    elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
        device = 'mps'
    else:
        device = 'cpu'
    model_kwargs = {'device': device}
    embeddings = HuggingFaceEmbeddings(
        model_name=embedding_model,
        model_kwargs=model_kwargs
    )
    print(f"Embeddings model initialized on device: {device}.")
except Exception as e:
    print(f"Error initializing embedding model: {e}")
    print("This often happens if the API key is invalid or has not been enabled.")
    exit()


db_directory = "0.FARMER_bot/chroma_db"
print(f"Creating and persisting vector store at '{db_directory}'...")

try:
    vector_store = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        persist_directory=db_directory
    )
    
    print("✅ Success! Your vector store is ready.")


except Exception as e:
    print(f"Error creating vector store: {e}")
    exit()


