from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from datetime import datetime
from backend.app.database import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String, primary_key=True, index=True)
    model_id = Column(String, ForeignKey("trained_models.id"), index=True)
    session_id = Column(String, ForeignKey("analysis_sessions.id"), index=True)
    input_features = Column(JSON, nullable=False)
    predicted_value = Column(JSON, nullable=False)
    explanation = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
