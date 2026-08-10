"""
Sessions Router - User Analysis Sessions List API
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.crud import CRUDManager

router = APIRouter(prefix="/sessions", tags=["sessions"])

@router.get("/list")
def list_sessions(db: Session = Depends(get_db)):
    """
    Returns list of all saved analysis sessions.
    If 0 sessions exist, frontend identifies the user as first-time user.
    """
    sessions = CRUDManager.list_user_sessions(db)
    return {
        "count": len(sessions),
        "sessions": [
            {
                "id": s.id,
                "title": s.session_title,
                "status": s.status,
                "created_at": s.created_at.isoformat() if s.created_at else None,
                "user_intent": s.user_intent
            } for s in sessions
        ]
    }
