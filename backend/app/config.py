"""
Backend Configuration Module
Provides Environment Variables and App Settings.
"""

import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Conversational AutoML Platform"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./automl_platform.db")
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.1:8b")
    
    # Disk Directories
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
    SAVED_MODELS_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "saved_models")
    REPORTS_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "reports")
    CHROMA_PERSIST_DIR: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_db")

    class Config:
        case_sensitive = True

settings = Settings()

# Ensure directories exist
for path in [settings.UPLOAD_DIR, settings.SAVED_MODELS_DIR, settings.REPORTS_DIR, settings.CHROMA_PERSIST_DIR]:
    os.makedirs(path, exist_ok=True)
