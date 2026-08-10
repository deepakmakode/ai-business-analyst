"""
Planning Router - Target Variable & ML Plan Database Persistence API
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database import get_db
from backend.app.crud import CRUDManager
from backend.app.schemas.plan import PlanCreateRequest
from backend.app.services.product_intelligence import ProductIntelligenceService

router = APIRouter(prefix="/planning", tags=["planning"])

@router.post("/generate-plan")
def generate_plan(req: PlanCreateRequest, db: Session = Depends(get_db)):
    db_dataset = CRUDManager.get_dataset(db, req.dataset_id)
    session_id = req.session_id or "session-default"

    prod_name = "general"
    if db_dataset and db_dataset.detected_schema:
        prod_name = db_dataset.detected_schema.get("product_col") or "tv"

    product_intel = ProductIntelligenceService.understand_product(prod_name)

    if not db_dataset:
        selected_features = ["Month", "COGS", "Marketing Spend", "Ops Expense"]
    else:
        cols = [c["name"] for c in db_dataset.detected_schema.get("columns", [])]
        selected_features = [c for c in cols if c != req.target_column][:5]

    external_features = []
    if product_intel["weather_sensitive"]:
        external_features.append("Open-Meteo Weather (Temperature & Rain)")
    if product_intel["holiday_sensitive"] or product_intel["festival_sensitive"]:
        external_features.append("Curated Indian Festivals & Holidays")

    db_plan = CRUDManager.create_ml_plan(
        db=db,
        session_id=session_id,
        target_col=req.target_column,
        task_type="Regression / Financial Trend Projection",
        selected_features=selected_features,
        external_features=external_features,
        cleaning={"missing_values": "Impute Median", "outliers": "Cap at 99th Percentile", "feature_validation": "Pearson Correlation (r > 0.10)"}
    )

    return {
        "id": db_plan.id,
        "session_id": db_plan.session_id,
        "target_column": db_plan.target_column,
        "task_type": db_plan.task_type,
        "product_understanding": product_intel,
        "selected_features": db_plan.selected_features,
        "external_features": db_plan.external_features,
        "cleaning_strategy": db_plan.cleaning_strategy,
        "reliability_score": f"High ({product_intel['confidence_score'] * 100:.0f}% Confidence)",
        "approved": db_plan.approved
    }

@router.post("/approve-plan/{plan_id}")
def approve_plan(plan_id: str, db: Session = Depends(get_db)):
    db_plan = CRUDManager.approve_ml_plan(db, plan_id)
    if not db_plan:
        raise HTTPException(status_code=404, detail="ML Plan not found")
    return {"plan_id": db_plan.id, "status": "approved", "message": "ML Training Plan Approved by Business User."}

@router.get("/{plan_id}")
def get_plan(plan_id: str, db: Session = Depends(get_db)):
    db_plan = CRUDManager.get_ml_plan(db, plan_id)
    if not db_plan:
        raise HTTPException(status_code=404, detail="ML Plan not found")
    return db_plan
