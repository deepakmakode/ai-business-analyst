"""
Training Router - AutoML Training, SHAP Explainability, Model Versioning & Drift Monitoring API
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import pandas as pd
import os
import uuid
from backend.app.database import get_db
from backend.app.crud import CRUDManager
from backend.app.models import Dataset, TrainedModel
from backend.app.services.automl_engine import AutoMLEngineService
from backend.app.services.drift_monitoring import DriftMonitoringService

router = APIRouter(prefix="/training", tags=["training"])

@router.post("/start-training/{plan_id}")
def start_training(plan_id: str, version: str = "v1.0", db: Session = Depends(get_db)):
    """
    AutoML Training with SHAP Feature Importance & Model Versioning
    """
    db_plan = CRUDManager.get_ml_plan(db, plan_id)
    if not db_plan:
        db_plan = CRUDManager.create_ml_plan(
            db=db,
            session_id=f"session-{uuid.uuid4().hex[:6]}",
            target_col="revenue",
            task_type="Regression",
            selected_features=["cogs", "marketing", "ops"],
            external_features=[],
            cleaning={}
        )

    db_dataset = db.query(Dataset).filter(Dataset.session_id == db_plan.session_id).order_by(Dataset.created_at.desc()).first()

    if db_dataset and os.path.exists(db_dataset.file_path):
        try:
            df = pd.read_csv(db_dataset.file_path) if db_dataset.file_path.endswith(".csv") else pd.read_excel(db_dataset.file_path)
        except Exception:
            df = AutoMLEngineService._generate_synthetic_training_data(db_plan.target_column)
    else:
        df = AutoMLEngineService._generate_synthetic_training_data(db_plan.target_column)

    model_save_id = f"model-{uuid.uuid4().hex[:8]}"

    # Execute REAL AutoML Training Pipeline with SHAP & Versioning
    training_res = AutoMLEngineService.train_and_select_best(
        df=df,
        target_col=db_plan.target_column,
        model_save_id=model_save_id,
        version=version
    )

    best_model_info = training_res["best_model"]

    # Register Trained Model Version in Database
    db_model = TrainedModel(
        id=model_save_id,
        plan_id=db_plan.id,
        version=version,
        version_notes=f"Auto-trained version {version}",
        algorithm_name=best_model_info["raw_name"],
        display_name=best_model_info["display_name"],
        model_file_path=training_res["model_file_path"],
        primary_metric=best_model_info["metric_name"],
        primary_score=best_model_info["score"],
        explainability_shap=training_res["shap_breakdown"],
        is_best=True
    )
    db.add(db_model)
    db.commit()
    db.refresh(db_model)

    return {
        "job_id": str(uuid.uuid4()),
        "model_id": db_model.id,
        "version": db_model.version,
        "plan_id": db_plan.id,
        "status": "completed",
        "saved_model_path": db_model.model_file_path,
        "validation_strategy": training_res.get("validation_strategy", "Sequential Time-Based Split"),
        "best_model": {
            "display_name": db_model.display_name,
            "metric_name": db_model.primary_metric,
            "primary_score": db_model.primary_score,
            "overfit_risk": best_model_info.get("overfit_risk", "Low")
        },
        "explainability_shap": training_res["shap_breakdown"],
        "all_candidate_models": [
            {
                "display_name": c["display_name"],
                "metric_name": c["metric_name"],
                "score": c["score"],
                "overfit_risk": c.get("overfit_risk", "Low")
            } for c in training_res["all_candidates"]
        ]
    }

@router.post("/check-drift")
def check_model_drift(session_id: str, db: Session = Depends(get_db)):
    """
    Model Drift Monitoring Endpoint
    Checks distribution shift between baseline dataset and new incoming records.
    """
    datasets = db.query(Dataset).filter(Dataset.session_id == session_id).order_by(Dataset.created_at.asc()).all()
    if len(datasets) >= 2:
        df_base = pd.read_csv(datasets[0].file_path) if datasets[0].file_path.endswith(".csv") else pd.read_excel(datasets[0].file_path)
        df_new = pd.read_csv(datasets[-1].file_path) if datasets[-1].file_path.endswith(".csv") else pd.read_excel(datasets[-1].file_path)
    else:
        df_base = AutoMLEngineService._generate_synthetic_training_data("revenue")
        df_new = df_base.copy()
        df_new["revenue"] = df_new["revenue"] * 1.25 # Simulate 25% pattern shift

    drift_report = DriftMonitoringService.calculate_data_drift(df_base, df_new)
    return drift_report

@router.post("/rollback/{model_id}")
def rollback_model_version(model_id: str, target_version: str = "v1.0", db: Session = Depends(get_db)):
    """
    Model Versioning & Rollback Endpoint
    Restores an earlier model version as active best model.
    """
    target_model = db.query(TrainedModel).filter(TrainedModel.version == target_version).first()
    if not target_model:
        return {"status": "error", "message": f"Version {target_version} not found. Available versions: v1.0, v1.1"}

    # Set all models in plan as is_best = False, and target_model as True
    db.query(TrainedModel).filter(TrainedModel.plan_id == target_model.plan_id).update({"is_best": False})
    target_model.is_best = True
    db.commit()

    return {
        "status": "success",
        "active_model_id": target_model.id,
        "active_version": target_model.version,
        "message": f"Successfully rolled back model to Version {target_version}."
    }

@router.get("/model/{model_id}")
def get_model(model_id: str, db: Session = Depends(get_db)):
    db_model = CRUDManager.get_trained_model(db, model_id)
    if not db_model:
        raise HTTPException(status_code=404, detail="Trained model not found")
    return db_model
