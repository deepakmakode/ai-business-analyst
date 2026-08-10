"""
FastAPI Production Server Entrypoint
Registers CORS, database table auto-creation, and all API routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from backend.app.config import settings
from backend.app.database import engine, Base
from backend.app.routers import (
    datasets_router,
    planning_router,
    training_router,
    predictions_router,
    chat_router,
    reports_router,
    sessions_router
)

# Auto-create all Database Tables in SQLite/Postgres
Base.metadata.create_all(bind=engine)

# Auto-migrate missing columns for SQLite
try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE analysis_sessions ADD COLUMN user_intent JSON;"))
        conn.commit()
except Exception:
    pass

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Conversational AutoML Platform Production Backend Engine",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(datasets_router, prefix="/api/v1")
app.include_router(planning_router, prefix="/api/v1")
app.include_router(training_router, prefix="/api/v1")
app.include_router(predictions_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")
app.include_router(reports_router, prefix="/api/v1")
app.include_router(sessions_router, prefix="/api/v1")

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "database": "connected",
        "saved_models_dir": settings.SAVED_MODELS_DIR,
        "upload_dir": settings.UPLOAD_DIR
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
