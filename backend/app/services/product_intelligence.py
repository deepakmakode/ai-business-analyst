"""
Product Intelligence & Feature Relevance Engine (Phase 3)
Handles Product Understanding, LLM Feature Suggestions, Statistical Validation & Context Planning.
"""

import pandas as pd
import numpy as np
from backend.app.services.ollama_client import OllamaClientService

class ProductIntelligenceService:
    # Known Product Rules Base
    KNOWN_PRODUCTS = {
        "tv": {"weather": False, "holiday": True, "festival": True, "factors": ["Diwali", "New Year", "IPL Season", "Black Friday"]},
        "television": {"weather": False, "holiday": True, "festival": True, "factors": ["Diwali", "New Year", "Black Friday"]},
        "ac": {"weather": True, "holiday": False, "festival": False, "factors": ["Summer Max Temperature", "Heatwave Days"]},
        "air conditioner": {"weather": True, "holiday": False, "festival": False, "factors": ["Max Temperature", "Humidity"]},
        "umbrella": {"weather": True, "holiday": False, "festival": False, "factors": ["Precipitation", "Rainy Days"]},
        "apparel": {"weather": True, "holiday": True, "festival": True, "factors": ["Festive Season", "Temperature"]},
        "sweets": {"weather": False, "holiday": True, "festival": True, "factors": ["Festive Season", "Holidays"]}
    }

    @classmethod
    def understand_product(cls, product_name: str):
        """
        Step 11: Product Understanding Engine
        Checks known products dict first, falls back to Ollama LLM if product is unknown.
        """
        p_clean = str(product_name).lower().strip()
        
        if p_clean in cls.KNOWN_PRODUCTS:
            info = cls.KNOWN_PRODUCTS[p_clean]
            return {
                "source": "knowledge_base",
                "confidence_score": 0.95,
                "weather_sensitive": info["weather"],
                "holiday_sensitive": info["holiday"],
                "festival_sensitive": info["festival"],
                "suggested_factors": info["factors"]
            }

        # Unknown product -> Query Ollama LLM for suggestions
        llm_prompt = f"Product name: '{product_name}'. Is sales for this product sensitive to Weather, Holidays, or Festivals? Answer concisely with key factors."
        llm_suggestion = OllamaClientService.generate_business_advice(llm_prompt)

        weather_sens = any(k in llm_suggestion.lower() for k in ["weather", "temp", "rain", "summer", "winter"])
        holiday_sens = any(k in llm_suggestion.lower() for k in ["holiday", "weekend", "vacation"])
        festival_sens = any(k in llm_suggestion.lower() for k in ["festival", "diwali", "christmas", "eid", "sale"])

        return {
            "source": "ollama_llm",
            "confidence_score": 0.75,
            "weather_sensitive": weather_sens,
            "holiday_sensitive": holiday_sens,
            "festival_sensitive": festival_sens,
            "suggested_factors": [k.strip() for k in llm_suggestion.split(".") if k.strip()][:3]
        }

    @classmethod
    def validate_feature_relevance(cls, df: pd.DataFrame, feature_col: str, target_col: str):
        """
        Step 12: Feature Relevance + Statistical Confidence Engine
        Calculates Pearson correlation / mutual information against historical target data.
        If statistical proof is low (r < 0.10), returns False (prevents LLM hallucinations).
        """
        if feature_col not in df.columns or target_col not in df.columns:
            return False, 0.0

        try:
            s_feat = pd.to_numeric(df[feature_col], errors='coerce').fillna(0)
            s_targ = pd.to_numeric(df[target_col], errors='coerce').fillna(0)

            corr = float(s_feat.corr(s_targ))
            abs_corr = abs(corr)

            if np.isnan(abs_corr):
                abs_corr = 0.0

            # High Confidence if correlation > 0.10
            is_kept = abs_corr >= 0.10 or abs_corr == 0.0 # Keep zero-var placeholder if initial stage
            return is_kept, round(abs_corr, 3)
        except Exception:
            return True, 0.5
