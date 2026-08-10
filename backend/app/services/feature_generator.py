"""
Feature Generator Layer (Phase 8 Type B Flow)
Automatically constructs inference feature vectors for future time horizons (e.g. 12 months)
without requiring non-technical users to manually supply technical ML feature inputs.
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from backend.app.services.external_data import ExternalDataService

class FeatureGeneratorLayer:
    @classmethod
    def generate_future_features(cls, horizon_months: int = 12, target_entity: str = "TV", target_col: str = "revenue", historical_df: pd.DataFrame = None):
        """
        Phase 8 Type B: Automatic Feature Vector Generation for Future Predictions
        1. Date-based features (Future dates: month, quarter, year)
        2. Lag & Rolling features (Computed from historical dataset)
        3. External Future features (Deterministic Festival/Holiday calendar + Weather forecast)
        """
        start_date = datetime.now()
        future_dates = [start_date + timedelta(days=30 * i) for i in range(1, horizon_months + 1)]
        
        future_records = []
        hist_baseline = 150000.0
        if historical_df is not None and target_col in historical_df.columns:
            try:
                hist_baseline = float(pd.to_numeric(historical_df[target_col], errors='coerce').dropna().mean())
            except Exception:
                pass

        for i, dt in enumerate(future_dates):
            date_str = dt.strftime('%Y-%m-%d')
            month_num = dt.month
            quarter_num = (month_num - 1) // 3 + 1
            
            # Festival / Holiday future lookup
            fest_info = ExternalDataService.CURATED_FESTIVALS.get(date_str, {"is_holiday": 0, "festival": None})
            is_holiday = fest_info["is_holiday"]
            is_festival = 1 if fest_info["festival"] else (1 if month_num in [10, 11, 12] else 0)

            # Simulated Open-Meteo future weather forecast
            max_temp = round(28.0 + 8.0 * np.sin(month_num / 12.0 * 2 * np.pi), 1)

            # Lag & Rolling baseline computation
            lag1 = hist_baseline * (1.0 + 0.02 * i)
            roll3 = hist_baseline * 1.05

            future_records.append({
                "date": date_str,
                "month": month_num,
                "quarter": quarter_num,
                "marketing": round(hist_baseline * 0.20),
                "cogs": round(hist_baseline * 0.35),
                "ops": round(hist_baseline * 0.15),
                "ext_is_holiday": is_holiday,
                "ext_is_festival": is_festival,
                "ext_max_temp": max_temp,
                f"{target_col}_lag1": round(lag1, 2),
                f"{target_col}_roll3": round(roll3, 2)
            })

        return {
            "horizon_months": horizon_months,
            "future_dates": [r["date"] for r in future_records],
            "feature_vectors": future_records
        }
