# AI-Powered Conversational AutoML Platform — Developer & Setup Guide

## 1. Environment Setup & Requirements

### Prerequisites
- Python 3.10+
- Node.js 18+ (for Frontend React UI)
- Ollama (Optional for local LLM inference, fallback provided)

### Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### Install Frontend Dependencies
```bash
cd frontend
npm install
```

---

## 2. Backend Module Responsibilities

| File Path | Role & Functionality |
|---|---|
| `backend/app/main.py` | FastAPI entrypoint, CORS settings, database table creation, API router registration |
| `backend/app/config.py` | Environment configurations, DB URLs, Ollama endpoint URLs, Redis & ChromaDB paths |
| `backend/app/database.py` | SQLAlchemy database engine setup and session dependency generator |
| `backend/app/models/` | SQLAlchemy Database tables: `User`, `AnalysisSession`, `Dataset`, `MLPlan`, `TrainedModel`, `Prediction` |
| `backend/app/services/dataset_understanding.py` | Pandas profiling, column type detection, missing value counts, target variable candidate identification |
| `backend/app/services/pii_masking.py` | PII keyword scanning and anonymization |
| `backend/app/services/automl_engine.py` | Real Scikit-Learn / PyCaret model training, metric evaluation ($R^2$, RMSE), model file persistence (`.pkl`) |
| `backend/app/services/rag_engine.py` | Vector embeddings indexing and retrieval for chat Q&A |
| `backend/app/services/ollama_client.py` | Local Ollama LLM integration wrapper |
| `backend/app/services/report_generator.py` | Executive summary and printable HTML/PDF report builder |
| `backend/app/routers/` | FastAPI REST endpoints (`/datasets`, `/planning`, `/training`, `/predictions`, `/chat`) |

---

## 3. API Workflow Testing with cURL / Postman

### 1. Health Check
```bash
curl http://localhost:8000/api/v1/health
```

### 2. Dataset Upload
```bash
curl -X POST "http://localhost:8000/api/v1/datasets/upload" -F "file=@sample_data.csv"
```

### 3. Generate ML Plan
```bash
curl -X POST "http://localhost:8000/api/v1/planning/generate-plan" \
     -H "Content-Type: application/json" \
     -d '{"session_id": "test-1", "dataset_id": "ds-1", "target_column": "revenue"}'
```

### 4. Start AutoML Model Training
```bash
curl -X POST "http://localhost:8000/api/v1/training/start-training/plan-1"
```

### 5. Run Inference Prediction
```bash
curl -X POST "http://localhost:8000/api/v1/predictions/predict" \
     -H "Content-Type: application/json" \
     -d '{"model_id": "mod-1", "session_id": "test-1", "input_features": {"marketing": 35000, "cogs": 50000}}'
```

### 6. Conversational Chat Query
```bash
curl -X POST "http://localhost:8000/api/v1/chat/query" \
     -H "Content-Type: application/json" \
     -d '{"query": "How can we optimize profit margin?", "session_id": "test-1"}'
```
