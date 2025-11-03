# corrected_agent.py
import os
from dotenv import load_dotenv
import requests
import base64
import json
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from langchain_core.messages import HumanMessage
import google.generativeai as genai
from google.generativeai.types import GenerationConfig, HarmCategory, HarmBlockThreshold
from pydantic import BaseModel, Field, ValidationError
from typing import List, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    print("ERROR: GOOGLE_API_KEY not found in .env file.")
    exit()
else:
    genai.configure(api_key=GOOGLE_API_KEY)
    print("INFO: Google API Key configured for direct SDK.")

def get_state_from_ip():
    print("INFO: Attempting to get location (state) from IP address...")
    api_url = 'http://ip-api.com/json/'
    try:
        response = requests.get(api_url, timeout=5)
        response.raise_for_status()
        data = response.json()
        if data.get('status') == 'success':
            state = data.get('regionName')
            city = data.get('city')
            country = data.get('country', '')
            if state:
                print(f"INFO: Detected state: {state} (City: {city}, Country: {country})")
                return state
            elif city:
                print(f"WARN: State not provided by IP API, falling back to city: {city}")
                return city
            else:
                print("WARN: IP API Response Status: Success, but state/city not found.")
                return None
        else:
            print(f"WARN: IP API failed. Status: {data.get('status')}. Message: {data.get('message')}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"ERROR: Network error fetching location from IP API: {e}")
        return None
    except Exception as e:
        print(f"ERROR: An unexpected error occurred getting location: {e}")
        return None

# --- Embeddings initialization (local HuggingFace)
try:
    import torch
    # Prefer CUDA if available, then MPS (macOS), otherwise CPU
    if torch.cuda.is_available():
        device = 'cuda'
    elif hasattr(torch.backends, 'mps') and torch.backends.mps.is_available():
        device = 'mps'
    else:
        device = 'cpu'
    model_name = "all-MiniLM-L6-v2"
    model_kwargs = {'device': device}
    embeddings = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs=model_kwargs
    )
    print(f"INFO: HuggingFace embeddings initialized on device: {device}.")
except Exception as e:
    print(f"ERROR: Error initializing HuggingFace model: {e}")
    exit()

# --- Load vector store (make sure path is correct)
db_directory = "0.FARMER_bot/chroma_db"
try:
    vector_store = Chroma(
        persist_directory=db_directory,
        embedding_function=embeddings
    )
    print(f"INFO: Vector store loaded successfully from '{db_directory}'.")
except Exception as e:
    print(f"ERROR: Error loading vector store from '{db_directory}': {e}")
    exit()

# --- Initialize LangChain wrapper for Gemini
try:
    rag_llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-pro",
        temperature=0.1
    )
    print("INFO: LangChain ChatGoogleGenerativeAI initialized for RAG.")
except Exception as e:
    print(f"ERROR: Error initializing LangChain Gemini LLM: {e}")
    exit()

# --- System prompt template (with placeholders)
rag_sys_prompt_template_str = """
# You are a friendly and helpful AI assistant for **farmers in India**. Your goal is to provide **simple, clear, practical, and state-aware advice** for text-based questions.
# Assume the user may not have formal agricultural training. Use **simple language** and explain any technical terms.

# The user is in state: **{state}**. Use local names relevant to **{state}** if possible.

# **RESPONSE INSTRUCTIONS:**
# 1.  **Analyze Context:** Read the 'CONTEXT' provided below.
# 2.  **Check Relevance:** Is the 'CONTEXT' *directly* relevant to answering the specific 'USER_QUESTION' about farming in '{state}'?
# 3.  **Generate Answer:**
#     * **If CONTEXT is relevant:** Use the relevant information from 'CONTEXT' to answer the 'USER_QUESTION'.
#     * **If CONTEXT is empty OR NOT relevant:** **Completely ignore the CONTEXT.** Answer the 'USER_QUESTION' using only your general knowledge about farming in '{state}'. **DO NOT mention the irrelevant context.** Provide the best general answer you can for the question asked.
# 4.  **Language:** Respond **ENTIRELY** and **ONLY** in the **exact same language** as the 'USER_QUESTION'. **Strictly no translation.**
# 5.  **Topic:** Answer **ONLY** about farming. Decline non-farming questions politely in the user's language.
# 6.  **Style:** Be simple, clear, actionable, concise, and respectful.

# CONTEXT:
You are an AI assistant specialized in farming, designed to help farmers across India.
Your main goal is to provide accurate, helpful, and easy-to-understand advice that is state-aware and action-oriented.

The user is located in or asking about the state: {state}.
Always consider the climate, soil, local crops, and regional practices of this state while answering.

⸻

Guidelines for Behavior
	1.	Language Simplicity:
	•	Use clear, simple, and non-technical language so that even less-educated farmers can understand.
	•	If the user asks a complex question, simplify the explanation without losing accuracy or important context.
	•	Avoid scientific jargon unless necessary; if used, explain it in plain words.

	2.	Cultural and Regional Adaptation:
	•	Use terms, examples, or phrases familiar to farmers from {state} whenever possible.
	•	Mention local crop varieties, weather patterns, or soil conditions if relevant.
	•	Respect regional differences in practices (e.g., irrigation methods, planting times, pest names).

	3.	Relevance Filtering:
	•	If the provided context contains relevant information (like pests, soil types, crop diseases, or local practices related to the user’s query), use it to ground your answer.
	•	If the context is not relevant, ignore it and rely on your general knowledge — keeping the user’s state and crop in mind.
	
    4.	Answer Style:
	•	Be concise, direct, and practical.
	•	Focus on actionable steps rather than long explanations.
	•	Avoid unnecessary repetition or unrelated details.
	•	When appropriate, include step-by-step instructions (e.g., for fertilizer use, pest control, or irrigation).
	
    5.	Tone and Communication:
	•	Be friendly, patient, and respectful, as if speaking to a farmer in person.
	•	Assume the farmer might not know technical terms — always ensure clarity.
	•	Do not include disclaimers unless the situation requires safety or medical caution.



Output Rules
	•	Always answer in the same language as the user s question (use simple local dialect if possible).
    .    thee output cover in three main point whatr is that solution and hoe to solve it and what might coaused it and just in couple of line for ecch point.
	•	Do not mention internal processes like translation, AI model usage, or reasoning.
	•	If unsure or information is incomplete,suggest practical next steps.
	•	Never invent fake data or recommendations.
    •   Use the provided context only if it is relevant to the question asked.
    •  And answer only about farming-related topics.
    •  If the question is not related to farming, politely inform the user that you can only assist with farming-related queries.




CONTEXT:
{context}

USER_QUESTION:
{question}

ANSWER (in simple language, matching USER_QUESTION language):
"""

# --- IMPORTANT: create the ChatPromptTemplate using role-tuple style so variables are preserved
rag_prompt = ChatPromptTemplate.from_messages([
    ("system", rag_sys_prompt_template_str),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{question}")
])
print("INFO: RAG prompt template created (v4 - Explicit Question Ref).")

# --- Helpers for formatting/retrieval
def format_docs(docs: List[Any]) -> str:
    if not docs:
        return "No specific context found in the local knowledge base for this query."
    formatted = "\n\n---\n\n".join([getattr(doc, "page_content", str(doc)) for doc in docs])
    return formatted

def retrieve_docs(input_dict: dict) -> List[Any]:
    """
    Retrieve docs for the user's state using the vector store retriever.
    NOTE: Use retriever.get_relevant_documents(query) to ensure correct behavior with Chroma retriever.
    """
    user_question = input_dict.get("question")
    user_state = input_dict.get("state")

    if not user_question or not user_state:
        print(f"ERROR: Missing 'question' or 'state' in retrieve_docs input. Got: {input_dict}")
        return []

    try:
        retriever_with_filter = vector_store.as_retriever(
            search_kwargs={'k': 3, 'filter': {'state': user_state}}
        )

        # ✅ FIXED: Correct retrieval method handling
        if hasattr(retriever_with_filter, "get_relevant_documents"):
            retrieved = retriever_with_filter.get_relevant_documents(user_question)
        elif hasattr(retriever_with_filter, "invoke"):
            retrieved = retriever_with_filter.invoke(user_question)
        else:
            print("WARN: Retriever has no recognized retrieval method, skipping retrieval.")
            retrieved = []

        print(f"DEBUG: Retrieved {len(retrieved)} doc(s) for state '{user_state}'.")
        return retrieved

    except Exception as e:
        print(f"ERROR retrieve_docs: Failed to retrieve documents - {e}")
        return []

# --- Build LCEL pipeline (RAG)
rag_chain_core = (
    RunnablePassthrough.assign(
        retrieved_docs=RunnableLambda(retrieve_docs)
    )
    | RunnablePassthrough.assign(
        # create the context string from retrieved docs (this becomes the {context} variable in the prompt)
        context=lambda x: format_docs(x.get("retrieved_docs", [])),
        question=lambda x: x.get("question"),
        state=lambda x: x.get("state"),
        chat_history=lambda x: x.get("chat_history", [])
    )
    | rag_prompt
    | rag_llm
    | StrOutputParser()
)
print("INFO: Core RAG chain logic ('rag_chain_core') defined (Standard LCEL).")

# --- Image analysis Pydantic model and function (kept from your original code) ---
class ImageAnalysisResult(BaseModel):
    isHealthy: bool = Field(description="True if the plant appears healthy, false otherwise.")
    diseaseName: str = Field(description="The common name of the detected disease (e.g., 'Rice Blast', 'Sheath Blight'). If healthy, state 'Healthy'. If unknown, state 'Unknown Issue'.")
    description: str = Field(description="A brief description of the disease symptoms visible or a confirmation of health.")
    treatment: str = Field(description="Recommended simple treatment and prevention methods using farmer-friendly language. If healthy, provide general plant care tips.")

async def analyze_image_directly(image_base64_data_uri: str, question: str) -> Dict[str, Any]:
    print("INFO: Starting direct image analysis via Google SDK.")
    model_name_vision = 'gemini-2.5-flash'
    response = None
    try:
        model = genai.GenerativeModel(model_name_vision)
        print(f"INFO: Using direct SDK model: {model.model_name}")

        if not (image_base64_data_uri and image_base64_data_uri.startswith("data:image")):
            raise ValueError("Invalid image data URI format.")

        try:
             header, encoded = image_base64_data_uri.split(",", 1)
             mime_type = header.split(":")[1].split(";")[0]
             image_part = {"inline_data": {"mime_type": mime_type, "data": encoded}}
        except Exception as e:
             raise ValueError(f"Could not parse image data URI: {e}")

        prompt_text = f"""
You are an expert agricultural scientist and plant pathologist helping **farmers in India**.
Analyze the provided image of a crop leaf/plant carefully.
**User's Query related to image:** "{question}"
**CRITICAL RULES for your response:**
1.  **Language:** Respond **ENTIRELY** in the **same language** as the User's Query ("{question}"). Do NOT use English unless the query is in English.
2.  **Simplicity:** Use **simple, clear, non-technical language** suitable for farmers who may not have formal training. Explain any necessary terms simply.
3.  **Local Context:** If possible, use common **local names** (in the user's language) for diseases or treatments relevant to India, alongside standard names if helpful (e.g., "Rice Blast (धान का झोंका रोग)...").
4.  **Focus:** Base your analysis primarily on the **visible symptoms in the image**.
5.  **Actionable Advice:** Provide practical, step-by-step treatment/prevention tips.
**Analysis Task:**
1.  Is the plant in the image healthy or diseased?
2.  If diseased, what is the most likely disease name (in user's language)? If unsure, state 'Unknown Issue' (in user's language). If healthy, state 'Healthy' (in user's language).
3.  Briefly describe the symptoms seen *in the image* (in user's language).
4.  Suggest simple treatment/prevention steps (in user's language).
**Output Format:** Provide your response strictly in the following JSON format (ensure all string *values* are in the user's query language):
"""

        generation_config = GenerationConfig(
            response_mime_type="application/json",
            response_schema={
                "type": "object",
                "properties": {
                    "isHealthy": {"type": "boolean"},
                    "diseaseName": {"type": "string"},
                    "description": {"type": "string"},
                    "treatment": {"type": "string"}
                },
                "required": ["isHealthy", "diseaseName", "description", "treatment"]
            }
        )

        print("INFO: Sending request to Google API via SDK...")
        response = await model.generate_content_async(
            contents=[{"parts": [image_part, {"text": prompt_text}]}],
            generation_config=generation_config,
             safety_settings={
                 HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                 HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                 HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
                 HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
             }
        )

        print("INFO: Received response from Google API.")
        result_json = ""
        try:
            raw_text = response.text
            json_start = raw_text.find('{')
            json_end = raw_text.rfind('}')
            if json_start != -1 and json_end != -1 and json_end > json_start:
                result_json = raw_text[json_start : json_end + 1]
            else:
                result_json = raw_text

            analysis_result_dict = json.loads(result_json)
            analysis_result = ImageAnalysisResult.model_validate(analysis_result_dict)
            return analysis_result.model_dump()

        except (json.JSONDecodeError, ValidationError) as parse_error:
            print(f"ERROR: Could not parse JSON response from LLM: {parse_error}")
            print(f"LLM Raw Response Text (after potential extraction): {result_json}")
            return {"error": "Could not understand analysis format."}
        except Exception as e:
            print(f"ERROR: Unexpected error processing LLM response: {e}")
            return {"error": "Error processing analysis."}

    except ValueError as ve:
        print(f"ERROR: Input validation error during image analysis: {ve}")
        return {"error": str(ve)}
    except Exception as e:
        print(f"ERROR: Error during direct image analysis call: {e}")
        try:
             if hasattr(response, 'prompt_feedback') and getattr(response.prompt_feedback, "block_reason", None):
                  print(f"WARN: Response blocked due to safety settings. Reason: {response.prompt_feedback.block_reason}")
                  return {"error": "Analysis blocked by safety filters."}
             if "NotFound" in str(e) and ("model" in str(e) or "supported" in str(e)):
                 print(f"ERROR: The model '{model_name_vision}' might not be available or support this request type. Try another model name.")
                 return {"error": f"Image analysis model ('{model_name_vision}') unavailable."}
        except Exception as inner_e:
             print(f"ERROR: Error during error handling: {inner_e}")
        return {"error": "Failed to analyze image due to an unexpected error."}

print("INFO: Direct image analysis function ('analyze_image_directly') defined.")
print("INFO: corrected_agent.py loaded successfully. Ready for routing in main.py.")