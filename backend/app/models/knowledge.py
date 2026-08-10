from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from datetime import datetime
from backend.app.database import Base

class KnowledgeRecord(Base):
    __tablename__ = "knowledge_records"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("analysis_sessions.id"), index=True)
    document_type = Column(String, default="analysis_snapshot") # metadata, plan, prediction, insights, report
    text_content = Column(String, nullable=False)
    embedding_metadata = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
