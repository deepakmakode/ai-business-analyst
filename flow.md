# AI-Powered Conversational AutoML Platform — System Flow Architecture

```mermaid
flowchart TD
    subgraph Frontend ["Frontend UI (React + TypeScript + Tailwind)"]
        UI_Upload["1. File Upload Dropzone"]
        UI_Target["2. Human-in-the-Loop Target Selection"]
        UI_Plan["3. Non-Technical ML Plan Approval"]
        UI_Results["4. Business Report & Prediction Dashboard"]
        UI_Chat["5. Conversational AI Chat"]
    end

    subgraph FastAPI ["Backend API Server (FastAPI + Python 3.13)"]
        API_Dataset["POST /api/v1/datasets/upload"]
        API_Plan["POST /api/v1/planning/generate-plan"]
        API_Approve["POST /api/v1/planning/approve-plan/{id}"]
        API_Train["POST /api/v1/training/start-training/{id}"]
        API_Predict["POST /api/v1/predictions/predict"]
        API_Chat["POST /api/v1/chat/query"]
    end

    subgraph Processing ["Core Processing Engine"]
        Engine_Profile["Pandas Column Profiler & Type Detection"]
        Engine_PII["Presidio / Regex PII Scanner & Anonymizer"]
        Engine_ML["AutoML Training Engine (Scikit-Learn / PyCaret)"]
        Engine_RAG["ChromaDB Vector Embeddings & Context Retriever"]
        Engine_LLM["Ollama Local LLM Integration (llama3.1:8b)"]
    end

    subgraph Storage ["Local Persistence Layer"]
        DB[(SQLite / Postgres DB)]
        Models_Disk["Saved Model Artifacts (.pkl Files)"]
        Chroma_Disk["ChromaDB Vector Database"]
    end

    UI_Upload --> API_Dataset
    API_Dataset --> Engine_Profile
    Engine_Profile --> Engine_PII
    Engine_PII --> DB

    UI_Target --> API_Plan
    API_Plan --> DB

    UI_Plan --> API_Approve
    API_Approve --> API_Train
    API_Train --> Engine_ML
    Engine_ML --> Models_Disk
    Engine_ML --> DB

    UI_Results --> API_Predict
    API_Predict --> Models_Disk

    UI_Chat --> API_Chat
    API_Chat --> Engine_RAG
    Engine_RAG --> Engine_LLM
    Engine_LLM --> DB
```

---

## Detailed Data Processing Flow

1. **Dataset Upload & Anonymization**:
   - User uploads a `.csv` or `.xlsx` file.
   - `DatasetUnderstandingService` profiles columns, detects numerical vs categorical variables, missing values, and potential target candidates.
   - `PIIMaskingService` scans for sensitive PII data (Names, Emails, Phones) and anonymizes them before LLM exposure.
   - Record stored in `datasets` table in SQLite/Postgres DB.

2. **Target Variable Selection & ML Planning**:
   - Target variable is presented to the user (Human-in-the-Loop decision).
   - System auto-generates a non-technical ML plan (Estimated time, selected features, task type, reliability rating).
   - Plan saved in `ml_plans` table.

3. **AutoML Model Training & Selection**:
   - When user approves the plan, `AutoMLEngineService` trains multiple candidate algorithms (Random Forest, Gradient Boosting, Linear Regression, Decision Trees).
   - Evaluates models using cross-validation metrics ($R^2$, RMSE, MAE).
   - Best model is selected and saved as a `.pkl` file in `backend/saved_models/`.
   - Results recorded in `trained_models` table.

4. **Conversational Insights & Vector RAG**:
   - Financial metrics & executive summaries are indexed into ChromaDB.
   - When user asks a chat question, `RAGEngineService` retrieves relevant context embeddings.
   - `OllamaClientService` generates business-friendly advice using local LLM (`http://localhost:11434`).
   - Chat history logged in database.
