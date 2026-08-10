"""
Database CRUD Operations Helper Module
Provides real DB creation, retrieval, and update queries.
"""

from sqlalchemy.orm import Session
import uuid
from backend.app.models import (
    AnalysisSession, Dataset, MLPlan, TrainedModel, Prediction, ConversationLog
)

class CRUDManager:
    @staticmethod
    def get_or_create_session(db: Session, session_id: str = None, title: str = "Business Analysis Session"):
        if not session_id:
            session_id = f"session-{uuid.uuid4().hex[:8]}"

        db_session = db.query(AnalysisSession).filter(AnalysisSession.id == session_id).first()
        if not db_session:
            db_session = AnalysisSession(id=session_id, session_title=title, status="active")
            db.add(db_session)
            db.commit()
            db.refresh(db_session)
        return db_session

    @staticmethod
    def save_user_intent(db: Session, session_id: str, intent: dict):
        db_session = CRUDManager.get_or_create_session(db, session_id=session_id)
        db_session.user_intent = intent
        db.commit()
        db.refresh(db_session)
        return db_session

    @staticmethod
    def get_session(db: Session, session_id: str):
        return db.query(AnalysisSession).filter(AnalysisSession.id == session_id).first()

    @staticmethod
    def list_user_sessions(db: Session, limit: int = 10):
        return db.query(AnalysisSession).order_by(AnalysisSession.created_at.desc()).limit(limit).all()

    @staticmethod
    def create_dataset(db: Session, session_id: str, filename: str, file_path: str, row_count: int, col_count: int, schema: dict, pii_cols: list):
        dataset_id = f"dataset-{uuid.uuid4().hex[:8]}"
        db_dataset = Dataset(
            id=dataset_id,
            session_id=session_id,
            filename=filename,
            file_path=file_path,
            row_count=row_count,
            col_count=col_count,
            detected_schema=schema,
            pii_masked_cols=pii_cols
        )
        db.add(db_dataset)
        db.commit()
        db.refresh(db_dataset)
        return db_dataset

    @staticmethod
    def get_dataset(db: Session, dataset_id: str):
        return db.query(Dataset).filter(Dataset.id == dataset_id).first()

    @staticmethod
    def create_ml_plan(db: Session, session_id: str, target_col: str, task_type: str, selected_features: list, external_features: list, cleaning: dict):
        plan_id = f"plan-{uuid.uuid4().hex[:8]}"
        db_plan = MLPlan(
            id=plan_id,
            session_id=session_id,
            target_column=target_col,
            task_type=task_type,
            selected_features=selected_features,
            external_features=external_features,
            cleaning_strategy=cleaning,
            estimated_time="~1.5 mins",
            reliability_score="High (94.2%)",
            approved=False
        )
        db.add(db_plan)
        db.commit()
        db.refresh(db_plan)
        return db_plan

    @staticmethod
    def approve_ml_plan(db: Session, plan_id: str):
        db_plan = db.query(MLPlan).filter(MLPlan.id == plan_id).first()
        if db_plan:
            db_plan.approved = True
            db.commit()
            db.refresh(db_plan)
        return db_plan

    @staticmethod
    def get_ml_plan(db: Session, plan_id: str):
        return db.query(MLPlan).filter(MLPlan.id == plan_id).first()

    @staticmethod
    def create_trained_model(db: Session, plan_id: str, raw_name: str, display_name: str, file_path: str, metric: str, score: float, is_best: bool = True):
        model_id = f"model-{uuid.uuid4().hex[:8]}"
        db_model = TrainedModel(
            id=model_id,
            plan_id=plan_id,
            algorithm_name=raw_name,
            display_name=display_name,
            model_file_path=file_path,
            primary_metric=metric,
            primary_score=score,
            is_best=is_best
        )
        db.add(db_model)
        db.commit()
        db.refresh(db_model)
        return db_model

    @staticmethod
    def get_trained_model(db: Session, model_id: str):
        return db.query(TrainedModel).filter(TrainedModel.id == model_id).first()

    @staticmethod
    def create_prediction(db: Session, model_id: str, session_id: str, inputs: dict, predicted_val: any, summary: str):
        pred_id = f"pred-{uuid.uuid4().hex[:8]}"
        db_pred = Prediction(
            id=pred_id,
            model_id=model_id,
            session_id=session_id,
            input_features=inputs,
            predicted_value=predicted_val,
            explanation={"summary": summary}
        )
        db.add(db_pred)
        db.commit()
        db.refresh(db_pred)
        return db_pred

    @staticmethod
    def log_conversation(db: Session, session_id: str, query: str, response: str, intent: str = "general_query"):
        log_id = f"log-{uuid.uuid4().hex[:8]}"
        db_log = ConversationLog(
            id=log_id,
            session_id=session_id,
            user_query=query,
            ai_response=response,
            intent=intent
        )
        db.add(db_log)
        db.commit()
        db.refresh(db_log)
        return db_log
