from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import uuid
import traceback
from agent import rag_chain_core, analyze_image_directly

try:
    from agent import get_state_from_ip
except ImportError:
    def get_state_from_ip(): 
        return "Telangana"

from langchain_core.chat_history import BaseChatMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory

# Session store for chat history
store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    """Get or create chat history for a session."""
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
        print(f"INFO: Created new history for session: {session_id}")
    else:
        print(f"INFO: Retrieved existing history for session: {session_id} ({len(store[session_id].messages)} messages)")
    return store[session_id]


# Wrap the RAG chain with message history
chain_with_history = RunnableWithMessageHistory(
    rag_chain_core,
    get_session_history,
    input_messages_key="question",
    history_messages_key="chat_history",
)
print("INFO: Chain with history created for RAG.")


# Request/Response Models
class ChatRequest(BaseModel):
    question: str
    state: str | None = None
    session_id: str | None = None
    image_base64: str | None = None


class ChatResponse(BaseModel):
    answer: str
    session_id: str


# Initialize FastAPI app
app = FastAPI(
    title="AI Farmer Assistant API",
    description="API endpoint for the RAG-based farmer assistant with image analysis support"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("INFO: CORS Middleware added.")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "online",
        "service": "AI Farmer Assistant API",
        "endpoints": ["/chat", "/health"]
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "active_sessions": len(store),
        "total_messages": sum(len(history.messages) for history in store.values())
    }


@app.post("/chat", response_model=ChatResponse)
async def handle_chat(request: ChatRequest):
    """
    Main chat endpoint that handles both text questions and image analysis.
    
    - If image_base64 is provided: Routes to image analysis
    - Otherwise: Routes to RAG-based text Q&A
    """
    image_info = "Yes" if request.image_base64 else "No"
    print(f"\n{'='*80}")
    print(f"INFO: Received chat request")
    print(f"  Session ID: {request.session_id}")
    print(f"  State: {request.state}")
    print(f"  Image Provided: {image_info}")
    print(f"  Question: {request.question[:100]}...")
    print(f"{'='*80}\n")
    
    # Generate or use existing session ID
    session_id = request.session_id or str(uuid.uuid4())
    
    # Determine user state
    user_state = request.state
    if not user_state:
        print("INFO: State not provided in request, using fallback 'Telangana'.")
        user_state = "Telangana"

    response_text = ""

    try:
        # Route 1: Image Analysis
        if request.image_base64:
            print(f"INFO: 🖼️  Routing to IMAGE ANALYSIS for session {session_id}")
            analysis_result = await analyze_image_directly(
                image_base64_data_uri=request.image_base64,
                question=request.question or "Analyze the provided image and describe any issues."
            )

            if isinstance(analysis_result, dict) and "error" not in analysis_result:
                is_healthy = analysis_result.get('isHealthy', False)
                disease = analysis_result.get('diseaseName', 'Unknown Issue')
                desc = analysis_result.get('description', 'No description provided.')
                treat = analysis_result.get('treatment', 'No treatment suggestion provided.')

                if is_healthy:
                    response_text = f"✅ The plant in the image appears to be **Healthy**.\n\n**Description:**\n{desc}\n\n**Care Tips:**\n{treat}"
                else:
                    response_text = f"⚠️ Based on the image, the plant might have **{disease}**.\n\n**Description:**\n{desc}\n\n**Treatment/Prevention:**\n{treat}"
                    
                print(f"INFO: Image analysis completed - Healthy: {is_healthy}, Disease: {disease}")
                
            elif isinstance(analysis_result, dict) and "error" in analysis_result:
                response_text = f"Sorry, I encountered an error analyzing the image: {analysis_result['error']}"
                print(f"ERROR: Image analysis returned error: {analysis_result['error']}")
            else:
                print(f"WARN: Image analysis returned unexpected type: {type(analysis_result)}")
                response_text = "Sorry, the image analysis didn't return the expected format."

        # Route 2: Text-based RAG Query
        else:
            print(f"INFO: 💬 Routing to RAG CHAIN for session {session_id}")
            
            # Prepare input for the chain
            chain_input = {
                "question": request.question,
                "state": user_state,
            }
            
            print(f"DEBUG: Chain input prepared:")
            print(f"  - question: {chain_input['question'][:100]}...")
            print(f"  - state: {chain_input['state']}")

            # Invoke the RAG chain with message history
            print(f"INFO: Invoking RAG chain with history...")
            response = chain_with_history.invoke(
                chain_input,
                config={"configurable": {"session_id": session_id}}
            )
            
            response_text = response if isinstance(response, str) else str(response)
            print(f"DEBUG: RAG Response (first 200 chars): {response_text[:200]}...")
            print(f"INFO: ✅ RAG chain completed successfully")

        print(f"\nINFO: 🎉 Generated response for session {session_id}")
        print(f"INFO: Response length: {len(response_text)} characters\n")
        
        return ChatResponse(answer=response_text, session_id=session_id)

    except ValueError as ve:
        print(f"\nERROR: ❌ Value error processing request for session {session_id}: {ve}")
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(ve))
        
    except Exception as e:
        print(f"\nERROR: ❌ Unhandled error processing request for session {session_id}: {e}")
        traceback.print_exc()
        raise HTTPException(
            status_code=500, 
            detail="An error occurred while processing your request. Please check the logs for details."
        )


if __name__ == "__main__":
    print("\n" + "="*80)
    print("🚀 Starting AI Farmer Assistant API")
    print("="*80)
    print(f"📍 Server: http://127.0.0.1:8000")
    print(f"📚 Docs: http://127.0.0.1:8000/docs")
    print(f"🔍 Health: http://127.0.0.1:8000/health")
    print("="*80 + "\n")
    
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)