"""
Chat Router - RAG Knowledge Base Search & Feature Generator ML Inference API (Phase 8 Type A & Type B Flows)
"""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os
import uuid
from backend.app.database import get_db
from backend.app.crud import CRUDManager
from backend.app.services.rag_engine import RAGEngineService
from backend.app.services.ollama_client import OllamaClientService
from backend.app.services.automl_engine import AutoMLEngineService
from backend.app.services.feature_generator import FeatureGeneratorLayer
from backend.app.services.report_generator import ReportGeneratorService

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatRequest(BaseModel):
    query: str
    session_id: str = "default"

@router.post("/query")
def chat_query(req: ChatRequest, db: Session = Depends(get_db)):
    """
    Phase 8: Two Distinct AI Conversational Flows
    - Type A (Explanation Question): Serves answer strictly from ChromaDB stored context. NO ML Model called.
    - Type B (New Prediction Question): Automatic Feature Generator -> Trained Model Inference -> Business Language Converter -> ChromaDB Knowledge Update.
    """
    intent = RAGEngineService.detect_intent(req.query)

    if intent == "retrain_model":
        df = AutoMLEngineService._generate_synthetic_training_data("revenue")
        model_save_id = f"model-retrained-{uuid.uuid4().hex[:6]}"
        train_res = AutoMLEngineService.train_and_select_best(df, "revenue", model_save_id)
        
        response_text = f"🔄 **Model Retraining Triggered**: Evaluated candidate algorithms. Updated best model to **{train_res['best_model']['display_name']}** (Reliability Score: {train_res['best_model']['score']} R²). Saved new `.pkl` artifact."

    elif intent == "new_prediction":
        # Phase 8 Type B Flow: New ML Prediction Question
        # 1. Feature Generator Layer automatically builds 12-month future feature vectors
        gen_res = FeatureGeneratorLayer.generate_future_features(
            horizon_months=12,
            target_entity="TV",
            target_col="sales"
        )

        # 2. Search for saved .pkl trained model artifact
        saved_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "saved_models")
        pkl_files = [f for f in os.listdir(saved_dir) if f.endswith(".pkl")] if os.path.exists(saved_dir) else []
        model_file_path = os.path.join(saved_dir, pkl_files[0]) if pkl_files else ""

        # 3. Model Inference Execution using generated feature vector
        sample_input = gen_res["feature_vectors"][-1]
        raw_pred_val = AutoMLEngineService.predict(model_file_path, sample_input)

        # 4. Business Language Conversion
        explanation_data = ReportGeneratorService.generate_business_explanation(
            raw_value=raw_pred_val,
            target_col="TV Sales",
            entity="TV"
        )
        
        response_text = f"📈 **12-Month Forecast Prediction**: {explanation_data['business_explanation']}\n\n• **Key Strategy**: {explanation_data['recommendations'][0]}\n• **Risk Warning**: {explanation_data['risks'][0]}"

        # Step 27: Knowledge Update - Persist new prediction in ChromaDB Vector Store
        RAGEngineService.index_full_analysis(
            session_id=req.session_id,
            metadata={"filename": "future_prediction.csv", "domain": "General Business", "target_column": "TV Sales"},
            plan={"task_type": "12-Month Forecasting", "external_features": ["Festival", "Weather Forecast"]},
            prediction=explanation_data,
            insights=explanation_data["insights"],
            report_summary=explanation_data["business_explanation"]
        )
    else:
        # Phase 8 Type A Flow: Explanation Question (No ML Model Called!)
        # Serves answer strictly from ChromaDB stored knowledge base
        context = RAGEngineService.query_knowledge_base(req.session_id, req.query)
        response_text = OllamaClientService.generate_business_advice(req.query, context)

    # Log Conversation into Database
    db_log = CRUDManager.log_conversation(
        db=db,
        session_id=req.session_id,
        query=req.query,
        response=response_text,
        intent=intent
    )

    return {
        "id": db_log.id,
        "session_id": req.session_id,
        "query": req.query,
        "response": response_text,
        "intent": intent,
        "flow_type": "Type B (ML Inference)" if intent == "new_prediction" else ("Type A (RAG Context)" if intent == "rag_explanation" else "Retrain")
    }
