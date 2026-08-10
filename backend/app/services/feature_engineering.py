"""
Feature Engineering & Data Cleaning Service (Phase 3)
Handles missing value imputation, outlier handling, external weather/festival enrichment,
and statistical feature relevance validation.
"""

import pandas as pd
import numpy as np
from backend.app.services.product_intelligence import ProductIntelligenceService
from backend.app.services.external_data import ExternalDataService

class FeatureEngineeringService:
    @classmethod
    def clean_and_transform(cls, df: pd.DataFrame, target_col: str, product_name: str = None):
        processed_df = df.copy()

        # Step 1: Drop PII masked text columns
        for col in processed_df.columns:
            if col != target_col and processed_df[col].astype(str).str.contains("PII_ANONYMIZED").any():
                processed_df.drop(columns=[col], inplace=True)

        # Step 2: Product Intelligence & External Data Enrichment (Phase 3 Steps 11, 13, 14)
        prod_info = ProductIntelligenceService.understand_product(product_name or "general")
        date_cols = [c for c in processed_df.columns if any(k in c.lower() for k in ["date", "month", "time", "year"])]
        date_col = date_cols[0] if date_cols else None

        processed_df = ExternalDataService.enrich_dataset(
            df=processed_df,
            date_col=date_col,
            add_weather=prod_info["weather_sensitive"],
            add_festivals=prod_info["festival_sensitive"] or prod_info["holiday_sensitive"]
        )

        # Step 3: Impute missing numeric values using median
        numeric_cols = processed_df.select_dtypes(include=[np.number]).columns
        for col in numeric_cols:
            if processed_df[col].isnull().sum() > 0:
                median_val = processed_df[col].median()
                processed_df[col].fillna(median_val, inplace=True)

        # Step 4: Create time-series / trend lag features if date column exists
        if date_col and target_col in processed_df.columns:
            target_series = processed_df[target_col]
            processed_df[f"{target_col}_lag1"] = target_series.shift(1).fillna(target_series.mean())
            processed_df[f"{target_col}_roll3"] = target_series.rolling(window=3, min_periods=1).mean()

        # Step 5: Feature Relevance + Statistical Confidence Engine (Phase 3 Step 12)
        # Filter out low-confidence features (r < 0.10 correlation with target)
        final_cols = []
        for col in processed_df.columns:
            if col == target_col or col == date_col:
                final_cols.append(col)
                continue
            
            is_kept, confidence = ProductIntelligenceService.validate_feature_relevance(processed_df, col, target_col)
            if is_kept:
                final_cols.append(col)

        return processed_df[final_cols]
