# Simple MVP Treatment & Ranking Logic
from typing import List, Dict

# Mock Treatment Database mapping condition to treatment category
CONDITION_TO_TREATMENT = {
    "Migraine": "Neurology Consultation",
    "Tension Headache": "General Physician",
    "Flu": "General Physician",
    "COVID-19": "Pulmonology / Infectious Disease",
    "Heart Attack": "Emergency Cardiology",
    "Angina": "Cardiology Consultation",
    "Muscle Strain": "Orthopedics / Physiotherapy",
    "Herniated Disc": "Orthopedics / Neurosurgery",
    "Kidney Stones": "Urology",
    "Food Poisoning": "Gastroenterology",
    "Asthma": "Pulmonology"
}

def get_treatments_for_conditions(conditions: List[str]) -> List[str]:
    """Map a list of predicted conditions to required treatment specializations."""
    treatments = []
    for condition in conditions:
        treatment = CONDITION_TO_TREATMENT.get(condition)
        if treatment and treatment not in treatments:
            treatments.append(treatment)
    return treatments


def rank_hospitals(hospitals: List[Dict], treatments: List[str]) -> List[Dict]:
    """
    Score and rank a list of hospital objects based on relevance.
    Parameters:
    - hospitals: list of dicts with 'id', 'name', 'rating', 'specializations'
    - treatments: list of required specializations
    """
    ranked = []
    
    for hospital in hospitals:
        score = 0.0
        
        # 1. Base score is the rating (0 to 5)
        rating = float(hospital.get("rating", 0))
        score += rating
        
        # 2. Add points for matching requested treatments
        hosp_specs = hospital.get("specializations", [])
        if any(t in hosp_specs for t in treatments):
            score += 5.0 # Big boost for having the right department
            
        ranked.append({
            "hospital": hospital,
            "score": score
        })
        
    # Sort descending by score
    sorted_hospitals = sorted(ranked, key=lambda x: x["score"], reverse=True)
    return sorted_hospitals
