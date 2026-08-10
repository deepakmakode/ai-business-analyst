"""
Datasets Router - Real CSV/Excel Upload, PII Scanning, and Database Persistence API (Phase 2)
"""

from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, Form
from sqlalchemy.orm import Session
import pandas as pd
import io
import os
import uuid
from backend.app.database import get_db
from backend.app.crud import CRUDManager
from backend.app.services.dataset_understanding import DatasetUnderstandingService
from backend.app.services.pii_masking import PIIMaskingService
from backend.app.config import settings

router = APIRouter(prefix="/datasets", tags=["datasets"])

@router.post("/upload")
async def upload_dataset(
    file: UploadFile = File(...),
    session_id: str = Form(None),
    db: Session = Depends(get_db)
):
    # Step 4: Upload Format Validation
    if not file.filename.endswith((".csv", ".xlsx", ".xls")):
        raise HTTPException(status_code=400, detail="Invalid file format. Only CSV and Excel (.xlsx, .xls) files are supported.")

    active_session = CRUDManager.get_or_create_session(db, session_id=session_id)

    # Read contents and check corruption
    contents = await file.read()
    if not contents or len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty. Please upload a valid CSV or Excel dataset.")

    try:
        if file.filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(contents))
        else:
            df = pd.read_excel(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"File parsing error: File is corrupted or unreadable. Details: {str(e)}")

    # Step 10: Feasibility Check
    is_feasible, feasibility_reason = DatasetUnderstandingService.check_feasibility(df)
    if not is_feasible:
        raise HTTPException(status_code=400, detail=feasibility_reason)

    # Save raw file on disk
    saved_filename = f"{uuid.uuid4().hex[:8]}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, saved_filename)
    with open(file_path, "wb") as f:
        f.write(contents)

    # Step 5: PII Masking Security Layer (Before any processing)
    masked_df, pii_cols = PIIMaskingService.scan_and_mask(df)

    # Step 6 & 7 & 9: Dataset Understanding, Domain & Multi-Product Detection
    profile = DatasetUnderstandingService.profile_dataframe(masked_df)

    # Match columns with captured session user_intent if present
    if active_session.user_intent and isinstance(active_session.user_intent, dict):
        target_entity = str(active_session.user_intent.get("target_entity", "")).lower()
        if target_entity:
            for col_item in profile["columns"]:
                c_name = str(col_item["name"]).lower()
                if any(w in c_name for w in target_entity.split()):
                    col_item["is_target_candidate"] = True
                    if col_item["name"] not in profile["target_candidates"]:
                        profile["target_candidates"].insert(0, col_item["name"])

    # Insert Dataset into Database
    db_dataset = CRUDManager.create_dataset(
        db=db,
        session_id=active_session.id,
        filename=file.filename,
        file_path=file_path,
        row_count=profile["row_count"],
        col_count=profile["col_count"],
        schema=profile,
        pii_cols=pii_cols
    )

    return {
        "dataset_id": db_dataset.id,
        "session_id": active_session.id,
        "filename": file.filename,
        "is_feasible": True,
        "feasibility_message": feasibility_reason,
        "domain": profile["domain"],
        "inferred_task": profile["inferred_task"],
        "row_count": profile["row_count"],
        "col_count": profile["col_count"],
        "columns": profile["columns"],
        "target_candidates": profile["target_candidates"],
        "product_col": profile["product_col"],
        "date_col": profile["date_col"],
        "has_multiple_products": profile["has_multiple_products"],
        "product_list": profile["product_list"],
        "multi_product_options": profile["multi_product_options"],
        "pii_masked_cols": pii_cols,
        "captured_intent": active_session.user_intent
    }

@router.get("/{dataset_id}")
def get_dataset(dataset_id: str, db: Session = Depends(get_db)):
    db_dataset = CRUDManager.get_dataset(db, dataset_id)
    if not db_dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return db_dataset
