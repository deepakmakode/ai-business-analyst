from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from datetime import datetime
from backend.app.database import Base

class AnalysisSession(Base):
    __tablename__ = "analysis_sessions"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True, nullable=True)
    session_title = Column(String, nullable=True)
    user_intent = Column(JSON, nullable=True) # Stores parsed intent: {"task": "predict", "target_entity": "TV", "raw": "Predict TV sales"}
    status = Column(String, default="active") # active, completed, archived
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
