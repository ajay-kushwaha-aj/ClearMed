import random

class CostPredictor:
    def __init__(self):
        # Base multiplier logic based on hospital rating and treatment complexity
        self.treatment_base_costs = {
            "Neurology Consultation": 150.0,
            "General Physician": 50.0,
            "Pulmonology / Infectious Disease": 200.0,
            "Emergency Cardiology": 2000.0,
            "Cardiology Consultation": 250.0,
            "Orthopedics / Physiotherapy": 120.0,
            "Orthopedics / Neurosurgery": 5000.0,
            "Urology": 800.0,
            "Gastroenterology": 300.0,
            "Pulmonology": 150.0
        }

    def predict(self, treatment_name: str, hospital_rating: float) -> dict:
        """
        Mock algorithm:
        Predicts an estimated cost. Higher rated hospitals charge a premium.
        Adds some gaussian noise for realism.
        """
        base_cost = self.treatment_base_costs.get(treatment_name, 100.0)
        
        # Premium multiplier: Rating of 5.0 -> 1.5x, Rating 1.0 -> 1.1x
        premium_multiplier = 1.0 + (hospital_rating / 10.0)
        
        expected_cost = base_cost * premium_multiplier
        
        # Add random noise +/- 10%
        variance = expected_cost * 0.10
        min_cost = expected_cost - variance
        max_cost = expected_cost + variance
        
        # Create a single simulated predicted value
        predicted = random.uniform(min_cost, max_cost)
        
        return {
            "treatment": treatment_name,
            "hospital_rating_factor": hospital_rating,
            "predicted_cost_usd": round(predicted, 2),
            "estimated_range": [round(min_cost, 2), round(max_cost, 2)]
        }

# Singleton instance
cost_predictor = CostPredictor()

def predict_treatment_cost(treatment_name: str, hospital_rating: float) -> dict:
    return cost_predictor.predict(treatment_name, hospital_rating)
