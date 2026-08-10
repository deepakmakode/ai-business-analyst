from pydantic import BaseModel
from typing import Dict, Any, Optional

class PredictionRequest(BaseModel):
    model_id: str
    session_id: str
    input_features: Dict[str, Any]

class PredictionResponse(BaseModel):
    id: str
    predicted_value: Any
    confidence_level: Optional[str] = "High"
    business_summary: str
