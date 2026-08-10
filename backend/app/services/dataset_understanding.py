"""
Dataset Understanding & Security Service (Phase 2)
Handles statistical profiling, domain guessing, multi-product detection, and prediction feasibility checks.
"""

import pandas as pd
import numpy as np

class DatasetUnderstandingService:
    TARGET_KEYWORDS = ["target", "sales", "revenue", "profit", "churn", "demand", "price", "amount", "cost", "orders", "units"]
    PII_KEYWORDS = ["name", "email", "phone", "ssn", "passport", "address", "card", "mobile", "user_id"]
    PRODUCT_KEYWORDS = ["product", "item", "category", "sku", "device", "model"]
    DATE_KEYWORDS = ["date", "month", "year", "time", "period", "timestamp", "week", "day"]

    @classmethod
    def check_feasibility(cls, df: pd.DataFrame):
        """
        Step 10: Prediction Feasibility Check
        Returns (is_feasible: bool, reason: str)
        """
        if df is None or df.empty:
            return False, "Uploaded file is empty or corrupted. Please upload a valid CSV/Excel file."

        row_count, col_count = df.shape
        if row_count < 10:
            return False, f"Insufficient historical data: Uploaded dataset has only {row_count} rows. Minimum 10 rows required for reliable ML predictions."

        if col_count < 2:
            return False, "Dataset must contain at least 2 columns (at least 1 feature and 1 target metric)."

        return True, "Dataset feasibility check passed."

    @classmethod
    def profile_dataframe(cls, df: pd.DataFrame):
        """
        Step 6 & Step 7 & Step 9: Dataset Understanding, Domain Guess, Multi-Product & Intent
        """
        row_count, col_count = df.shape
        columns_profile = []
        target_candidates = []
        product_col = None
        date_col = None

        # 1. Inspect Columns
        for col in df.columns:
            dtype_str = str(df[col].dtype)
            missing_count = int(df[col].isnull().sum())
            missing_pct = round((missing_count / row_count) * 100, 1)
            
            sample_vals = df[col].dropna().head(3).tolist()
            sample_vals = [str(v) for v in sample_vals]

            col_lower = str(col).lower()
            is_target = False
            
            # Target Candidates Check
            if any(k in col_lower for k in cls.TARGET_KEYWORDS):
                is_target = True
                target_candidates.append(col)

            # Product Column Detection
            if not product_col and any(k in col_lower for k in cls.PRODUCT_KEYWORDS):
                product_col = col

            # Date Column Detection
            if not date_col and (any(k in col_lower for k in cls.DATE_KEYWORDS) or "datetime" in dtype_str):
                date_col = col

            is_pii = any(k in col_lower for k in cls.PII_KEYWORDS)

            columns_profile.append({
                "name": str(col),
                "dtype": dtype_str,
                "missing_count": missing_count,
                "missing_pct": missing_pct,
                "sample_values": sample_vals,
                "is_target_candidate": is_target,
                "is_pii": is_pii
            })

        if not target_candidates:
            num_cols = df.select_dtypes(include=[np.number]).columns.tolist()
            target_candidates = [c for c in num_cols if "id" not in str(c).lower()][:3]

        # 2. Multi-Product Check (Step 7)
        has_multiple_products = False
        product_list = []
        if product_col and product_col in df.columns:
            distinct_products = df[product_col].dropna().unique().tolist()
            if len(distinct_products) > 1:
                has_multiple_products = True
                product_list = [str(p) for p in distinct_products[:10]]

        # 3. Domain Guess
        all_cols_str = " ".join([str(c).lower() for c in df.columns])
        if any(k in all_cols_str for k in ["order", "cart", "aov", "checkout"]):
            domain = "E-Commerce"
        elif any(k in all_cols_str for k in ["churn", "mrr", "arr", "ltv", "subscription"]):
            domain = "SaaS Subscription"
        elif any(k in all_cols_str for k in ["inventory", "stock", "warehouse", "store"]):
            domain = "Retail & Supply Chain"
        else:
            domain = "General Business & Finance"

        # 4. Intent Auto-Inference (Step 9)
        inferred_task = "Forecasting" if date_col else "Regression"

        return {
            "row_count": row_count,
            "col_count": col_count,
            "columns": columns_profile,
            "target_candidates": target_candidates,
            "product_col": product_col,
            "date_col": date_col,
            "has_multiple_products": has_multiple_products,
            "product_list": product_list,
            "multi_product_options": [
                {"id": "combine", "label": "Predict Total Sales (Combine All Products)"},
                {"id": "single", "label": "Predict Specific Product Only"},
                {"id": "separate", "label": "Train Separate Models per Product"}
            ],
            "domain": domain,
            "inferred_task": inferred_task
        }
