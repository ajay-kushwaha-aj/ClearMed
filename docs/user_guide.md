# ClearMed User Guide

ClearMed connects you with intelligent healthcare matching using basic natural language symptoms and provides transparent cost and doctor insight.

## Getting Started Locally

1. Open your terminal to the root `/clearmed` path.
2. Run the initialization script: `npm install && npm run dev`.
3. Navigate your browser to: `http://localhost:3000`.

## Testing the Platform Features

### 1. The Symptom Checker
- **Action:** Type a symptom in the box, e.g., *"I have awful chest pain."* and hit "Analyze".
- **Result:** The system translates "chest pain" into Medical Conditions (Heart Attack, Angina) and extracts the exact Treatment Departments (Emergency Cardiology).

### 2. Hospital Ranking & Routing
- **Action:** Look directly below the AI result.
- **Result:** The Top 3 Hospitals are sorted purely based on combining their internal department tags with their overall review ratings. "City General" comes first for Cardiology.

### 3. Financial Cost Prediction
- **Action:** Look below the hospital specializations on the card.
- **Result:** The AI Engine has calculated the exact estimated price range (e.g., $2900) you can expect to pay for Emergency Cardiology there, modified dynamically based on hospital quality.

### 4. Insurance Coverage (Beta Check)
- **Action:** Click on any hospital card to expand it! Enter your "Provider Name" (e.g. Aetna) and click "Check".
- **Result:** You will immediately interact with our simulated coverage tool verifying if that hospital and treatment combo is accepted. 
