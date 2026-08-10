"""
PII Detection & Anonymization Service
Uses Regex & Presidio heuristic rules to detect and anonymize sensitive PII columns.
"""

import re
import pandas as pd

class PIIMaskingService:
    PII_KEYWORDS = ["email", "name", "phone", "address", "ssn", "creditcard", "password", "mobile", "user_id"]
    
    EMAIL_REGEX = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    PHONE_REGEX = r'^\+?[0-9]{7,15}$'

    @classmethod
    def scan_and_mask(cls, df: pd.DataFrame):
        masked_df = df.copy()
        masked_cols = []

        for col in df.columns:
            col_lower = str(col).lower()
            
            # Check column name keywords
            is_pii_col = any(k in col_lower for k in cls.PII_KEYWORDS)

            # Check sample string content patterns
            if not is_pii_col and df[col].dtype == 'object':
                sample_str = " ".join(df[col].dropna().astype(str).head(10).tolist())
                if re.search(cls.EMAIL_REGEX, sample_str) or re.search(cls.PHONE_REGEX, sample_str):
                    is_pii_col = True

            if is_pii_col:
                masked_cols.append(col)
                masked_df[col] = "[PII_ANONYMIZED]"

        return masked_df, masked_cols
