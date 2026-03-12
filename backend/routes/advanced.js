import express from "express";
import fetch from "node-fetch";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const AI_SERVICE_URL = "http://127.0.0.1:8000";

// Doctor Analytics
router.get("/doctors/:hospitalId", async (req, res) => {
    try {
        const { hospitalId } = req.params;
        const doctors = await prisma.doctor.findMany({
            where: { hospital_id: Number(hospitalId) }
        });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch doctors" });
    }
});

// Phase 7: Historical Cost Metrics Analytics Array
router.get("/costs/historical/:hospitalId/:treatmentId", async (req, res) => {
    try {
        const { hospitalId, treatmentId } = req.params;
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const bills = await prisma.bill.findMany({
            where: { 
                hospital_id: Number(hospitalId), 
                treatment_id: Number(treatmentId),
                date: { gte: sixMonthsAgo }
            }
        });

        if (bills.length === 0) return res.json({ message: "No historical data found", avg_cost: 0, min_cost: 0, max_cost: 0 });

        const totalCosts = bills.map(b => b.total_cost);
        const min_cost = Math.min(...totalCosts);
        const max_cost = Math.max(...totalCosts);
        const avg_cost = totalCosts.reduce((a, b) => a + b, 0) / totalCosts.length;

        res.json({
            avg_cost: Math.round(avg_cost),
            min_cost: Math.round(min_cost),
            max_cost: Math.round(max_cost),
            records_analyzed: bills.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed fetching costs" });
    }
});

// Cost Prediction AI Proxy (Legacy / Backup)
router.post("/costs/predict", async (req, res) => {
    try {
        const { treatment_name, hospital_rating } = req.body;
        if (!treatment_name || hospital_rating === undefined) {
            return res.status(400).json({ error: "treatment_name and hospital_rating are required" });
        }

        const response = await fetch(`${AI_SERVICE_URL}/predict-cost`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ treatment_name, hospital_rating: Number(hospital_rating) })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Cost Prediction Error:", error);
        res.status(500).json({ error: "Failed to predict costs" });
    }
});

// Insurance Eligibility
router.post("/insurance/eligibility", (req, res) => {
    const { provider, treatment_id, hospital_id } = req.body;
    if (!provider) return res.status(400).json({ error: "Insurance Provider name required" });

    const isCovered = Math.random() > 0.3;
    const coveragePercentage = isCovered ? Math.floor(Math.random() * (100 - 50 + 1) + 50) : 0;

    res.json({
        provider,
        treatment_id,
        hospital_id,
        is_covered: isCovered,
        coverage_percentage: coveragePercentage,
        message: isCovered ? "Coverage Approved." : "Service not covered by this provider."
    });
});

export default router;
