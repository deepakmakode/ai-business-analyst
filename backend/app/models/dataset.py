from sqlalchemy import Column, String, Integer, DateTime, JSON, ForeignKey
from datetime import datetime
from backend.app.database import Base

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("analysis_sessions.id"), index=True)
    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    row_count = Column(Integer, default=0)
    col_count = Column(Integer, default=0)
    detected_schema = Column(JSON, nullable=True) # column names, types, missing counts
    pii_masked_cols = Column(JSON, nullable=True) # list of masked PII columns
    created_at = Column(DateTime, default=datetime.utcnow)
