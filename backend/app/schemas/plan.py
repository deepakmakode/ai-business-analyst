from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class PlanCreateRequest(BaseModel):
    session_id: str
    dataset_id: str
    target_column: str

class PlanResponse(BaseModel):
    id: str
    session_id: str
    target_column: str
    task_type: str
    selected_features: List[str]
    external_features: List[str]
    cleaning_strategy: Dict[str, Any]
    estimated_time: str
    reliability_score: str
    approved: bool
