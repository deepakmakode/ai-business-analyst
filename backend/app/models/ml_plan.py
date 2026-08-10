from sqlalchemy import Column, String, DateTime, JSON, ForeignKey, Boolean
from datetime import datetime
from backend.app.database import Base

class MLPlan(Base):
    __tablename__ = "ml_plans"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("analysis_sessions.id"), index=True)
    target_column = Column(String, nullable=False)
    task_type = Column(String, nullable=False) # regression, classification, time_series
    selected_features = Column(JSON, nullable=True)
    external_features = Column(JSON, nullable=True)
    cleaning_strategy = Column(JSON, nullable=True)
    estimated_time = Column(String, default="~2 mins")
    reliability_score = Column(String, default="High")
    approved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
