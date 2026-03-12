# ClearMed API Specifications

The system exposes two primary API layers. The Node.js Express Backend (Port `5000`) and the Python FastAPI Microservice (Port `8000`).
The Frontend only ever communicates with the Node.js Backend.

## 1. Node.js Backend (`http://localhost:5000`)

### `POST /api/v1/bills`
- **Purpose:** Uploads a physical medical bill, runs OCR to extract text.
- **Body:** `multipart/form-data` with `"file"` payload.
- **Response:**
  ```json
  { "text": "Extracted text string", "message": "Bill parsed successfully" }
  ```

### `POST /api/v1/symptoms/analyze`
- **Purpose:** Analyzes natural language symptoms by proxying to the AI Engine.
- **Body:** `{ "text": "I have chest pain" }`
- **Response:**
  ```json
  { "conditions": ["Heart Attack", "Angina"], "recommended_treatments": ["Emergency Cardiology"] }
  ```

### `GET /api/v1/hospitals/rank`
- **Purpose:** Queries hospitals and sends them to AI Engine to score and sequence them locally.
- **Query Params:** `?treatments=Emergency%20Cardiology`
- **Response:**
  ```json
  { "ranked_hospitals": [ { "hospital": {}, "score": 9.5 } ] }
  ```

### `GET /api/v1/doctors/:hospitalId`
- **Purpose:** Fetch detailed doctor models mapped to a specific hospital.

### `POST /api/v1/costs/predict`
- **Purpose:** Proxies AI engine to predict localized costs.
- **Body:** `{ "treatment_name": "Emergency Cardiology", "hospital_rating": 4.5 }`
- **Response:**
  ```json
  { "predicted_cost_usd": 2900.0, "estimated_range": [2600.0, 3200.0] }
  ```

### `POST /api/v1/insurance/eligibility`
- **Purpose:** Simulates an insurance coverage check.
- **Body:** `{ "provider": "Aetna", "treatment_id": 1, "hospital_id": 1 }`
- **Response:**
  ```json
  { "is_covered": true, "coverage_percentage": 85, "message": "Coverage Approved." }
  ```
