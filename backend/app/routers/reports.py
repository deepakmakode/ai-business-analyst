"""
Reports Router - Executive HTML & PDF Report Generation API (Step 28 Final Report)
"""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import HTMLResponse
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.crud import CRUDManager
from backend.app.models import ConversationLog
from backend.app.services.report_generator import ReportGeneratorService

router = APIRouter(prefix="/reports", tags=["reports"])

@router.get("/final/{session_id}", response_class=HTMLResponse)
def get_final_comprehensive_report(session_id: str, db: Session = Depends(get_db)):
    """
    Step 28: Final Report Generation
    Sections: Executive Summary -> Predictions -> Recommendations -> Business Decisions -> Conversation Summary -> Action Plan -> Final PDF
    """
    db_session = CRUDManager.get_session(db, session_id)
    session_title = db_session.session_title if db_session else "Business Analysis Project"

    # Fetch Conversation Logs for Session
    logs = db.query(ConversationLog).filter(ConversationLog.session_id == session_id).order_by(ConversationLog.created_at.asc()).all()

    html_content = ReportGeneratorService.generate_final_comprehensive_report(
        session_title=session_title,
        target_col="TV Sales",
        conversation_logs=logs
    )

    return HTMLResponse(content=html_content)

@router.get("/download/{session_id}", response_class=HTMLResponse)
def get_printable_report(session_id: str, db: Session = Depends(get_db)):
    return get_final_comprehensive_report(session_id, db)
