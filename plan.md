# AI-Powered Conversational AutoML Platform — Master Project Blueprint

## 1. Project Overview & Scope
A conversational AutoML web platform where non-technical business users can upload financial/operational datasets, auto-detect target variables & PII columns, approve ML training plans (without technical jargon), train candidate models via PyCaret, receive executive business reports, and perform follow-up conversational queries via local Ollama LLM & RAG.

---

## 2. Directory & Folder Structure

```
ai-automl-platform/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI Server & Routes Registration
│   │   ├── config.py                   # App Configuration & Settings
│   │   ├── database.py                 # SQLAlchemy Database Session Maker
│   │   ├── models/                     # SQLAlchemy Database Models
│   │   │   ├── user.py
│   │   │   ├── session.py
│   │   │   ├── dataset.py
│   │   │   ├── ml_plan.py
│   │   │   ├── trained_model.py
│   │   │   └── prediction.py
│   │   ├── schemas/                    # Pydantic Input/Output Schemas
│   │   │   ├── dataset.py
│   │   │   ├── plan.py
│   │   │   └── prediction.py
│   │   ├── routers/                    # API Endpoints
│   │   │   ├── datasets.py
│   │   │   ├── planning.py
│   │   │   ├── training.py
│   │   │   ├── predictions.py
│   │   │   └── chat.py
│   │   ├── services/                   # Core Business & AutoML Services
│   │   │   ├── dataset_understanding.py
│   │   │   ├── pii_masking.py
│   │   │   ├── feature_engineering.py
│   │   │   ├── feature_generator.py
│   │   │   ├── automl_engine.py
│   │   │   ├── rag_engine.py
│   │   │   ├── ollama_client.py
│   │   │   └── report_generator.py
│   │   └── utils/
│   │       └── logger.py
│   ├── requirements.txt
│   └── server.py
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── NewAnalysis.tsx
│   │   │   ├── ApprovalScreen.tsx
│   │   │   ├── ResultsReport.tsx
│   │   │   └── ChatConversation.tsx
│   │   ├── components/
│   │   │   ├── ChatBox.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── TargetSelector.tsx
│   │   │   ├── PlanApprovalCard.tsx
│   │   │   └── PredictionChart.tsx
│   │   ├── store/
│   │   │   └── useAppStore.ts
│   │   ├── api/
│   │   │   └── client.ts
│   │   ├── App.tsx
│   │   └── index.css
│   └── package.json
├── plan.md
└── imp.md
```

---

## 3. Tech Stack & Dependencies
- **Frontend**: React + TypeScript + Tailwind CSS / Vanilla CSS Glassmorphism + Recharts + Zustand
- **Backend**: Python + FastAPI + SQLAlchemy + PyCaret + Ollama (Local LLM) + ChromaDB + Presidio PII Masking
- **Security & Storage**: Local execution, SQLite/Postgres DB, no remote git pushing.
