from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
from symptom_engine import analyze_symptoms_text
from ranking_engine import get_treatments_for_conditions, rank_hospitals
from cost_engine import predict_treatment_cost

app = FastAPI(title="ClearMed AI Service")

class SymptomRequest(BaseModel):
    text: str

@app.post("/analyze-symptoms")
def analyze_symptoms(request: SymptomRequest):
    conditions = analyze_symptoms_text(request.text)
    treatments = get_treatments_for_conditions(conditions)
    return {
        "conditions": conditions,
        "recommended_treatments": treatments
    }

class RankingRequest(BaseModel):
    treatments: List[str]
    hospitals: List[Dict]

@app.post("/rank-hospitals")
def rank_hospitals_endpoint(request: RankingRequest):
    ranked = rank_hospitals(request.hospitals, request.treatments)
    return {"ranked_hospitals": ranked}

class CostRequest(BaseModel):
    treatment_name: str
    hospital_rating: float

@app.post("/predict-cost")
def predict_cost_endpoint(request: CostRequest):
    return predict_treatment_cost(request.treatment_name, request.hospital_rating)

@app.get("/health")
def health_check():
    return {"status": "ok"}
