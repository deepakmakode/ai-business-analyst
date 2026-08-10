from sqlalchemy import Column, String, Float, DateTime, JSON, ForeignKey, Boolean
from datetime import datetime
from backend.app.database import Base

class TrainedModel(Base):
    __tablename__ = "trained_models"

    id = Column(String, primary_key=True, index=True)
    plan_id = Column(String, ForeignKey("ml_plans.id"), index=True)
    version = Column(String, default="v1.0") # e.g. v1.0, v1.1, v2.0
    version_notes = Column(String, nullable=True)
    algorithm_name = Column(String, nullable=False)
    display_name = Column(String, nullable=False) # Business-friendly non-technical name
    model_file_path = Column(String, nullable=False)
    primary_metric = Column(String, nullable=False) # R2, RMSE, Accuracy, F1
    primary_score = Column(Float, nullable=False)
    explainability_shap = Column(JSON, nullable=True) # Feature Importance Driver Breakdown
    is_best = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
