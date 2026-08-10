/**
 * Frontend Axios API Client
 * Connects Frontend UI to FastAPI Backend endpoints (/api/v1).
 */

const BASE_URL = "http://localhost:8000/api/v1";

export async function fetchUserSessions() {
  try {
    const res = await fetch(`${BASE_URL}/sessions/list`);
    return await res.json();
  } catch {
    return { count: 0, sessions: [] };
  }
}

export async function captureUserIntent(query: string, sessionId: string = "default") {
  const res = await fetch(`${BASE_URL}/chat/capture-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, session_id: sessionId }),
  });
  return res.json();
}

export async function uploadDataset(file: File, sessionId: string = "default") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("session_id", sessionId);

  const res = await fetch(`${BASE_URL}/datasets/upload`, {
    method: "POST",
    body: formData,
  });
  return res.json();
}

export async function generateMLPlan(sessionId: string, datasetId: string, targetCol: string) {
  const res = await fetch(`${BASE_URL}/planning/generate-plan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      session_id: sessionId,
      dataset_id: datasetId,
      target_column: targetCol,
    }),
  });
  return res.json();
}

export async function approveMLPlan(planId: string) {
  const res = await fetch(`${BASE_URL}/planning/approve-plan/${planId}`, {
    method: "POST",
  });
  return res.json();
}

export async function startMLTraining(planId: string) {
  const res = await fetch(`${BASE_URL}/training/start-training/${planId}`, {
    method: "POST",
  });
  return res.json();
}

export async function sendChatQuery(query: string, sessionId: string = "default") {
  const res = await fetch(`${BASE_URL}/chat/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, session_id: sessionId }),
  });
  return res.json();
}

export async function generateDatasetReport(filename: string, columns: any[], targetCol: string, rowCount: number = 100) {
  const res = await fetch(`${BASE_URL}/planning/generate-dataset-report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      filename,
      columns,
      target_column: targetCol,
      row_count: rowCount,
    }),
  });
  return res.json();
}
