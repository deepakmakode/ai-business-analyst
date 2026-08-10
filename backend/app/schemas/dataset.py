from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ColumnSchema(BaseModel):
    name: str
    dtype: str
    missing_count: int
    sample_values: List[Any]
    is_target_candidate: bool = False
    is_pii: bool = False

class DatasetResponse(BaseModel):
    id: str
    session_id: str
    filename: str
    row_count: int
    col_count: int
    columns: List[ColumnSchema]
    pii_masked_cols: List[str]
