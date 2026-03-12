# Simple MVP Knowledge Base: Symptom keywords -> Possible Conditions
SYMPTOM_DB = {
    "headache": ["Migraine", "Tension Headache", "Flu"],
    "fever": ["Flu", "COVID-19", "Malaria", "Dengue"],
    "cough": ["Common Cold", "Flu", "COVID-19", "Bronchitis", "Asthma"],
    "nausea": ["Food Poisoning", "Migraine", "Stomach Flu", "Pregnancy"],
    "chest pain": ["Heart Attack", "Angina", "Acid Reflux", "Muscle Strain"],
    "back pain": ["Muscle Strain", "Herniated Disc", "Kidney Stones"],
    "fatigue": ["Anemia", "Flu", "COVID-19", "Depression", "Hypothyroidism"],
    "rash": ["Allergic Reaction", "Eczema", "Measles", "Chickenpox"],
    "sore throat": ["Viral Pharyngitis", "Strep Throat", "Tonsillitis"],
    "shortness of breath": ["Asthma", "COVID-19", "COPD", "Pneumonia", "Anxiety"]
}

def analyze_symptoms_text(text: str) -> list[str]:
    """
    Extract symptoms using basic text matching and map to conditions.
    """
    text_lower = text.lower()
    possible_conditions = {}
    
    for symptom_key in SYMPTOM_DB.keys():
        # Check if the symptom key words are in the user text
        key_words = symptom_key.split()
        if all(kw in text_lower for kw in key_words):
             for condition in SYMPTOM_DB[symptom_key]:
                 possible_conditions[condition] = possible_conditions.get(condition, 0) + 1
                 
    # Sort conditions by number of matched symptoms (highest first)
    sorted_conditions = sorted(possible_conditions.items(), key=lambda item: item[1], reverse=True)
    
    # Return just the condition names
    return [c[0] for c in sorted_conditions]

if __name__ == "__main__":
    # Test
    print(analyze_symptoms_text("I have a severe headache and high fever with nausea"))
