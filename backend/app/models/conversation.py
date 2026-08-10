from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from datetime import datetime
from backend.app.database import Base

class ConversationLog(Base):
    __tablename__ = "conversation_logs"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("analysis_sessions.id"), index=True)
    user_query = Column(String, nullable=False)
    ai_response = Column(String, nullable=False)
    intent = Column(String, default="general_query")
    created_at = Column(DateTime, default=datetime.utcnow)
