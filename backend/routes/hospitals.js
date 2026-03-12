import express from "express";
import fetch from "node-fetch";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();
const AI_SERVICE_URL = "http://127.0.0.1:8000";

// Basic get
router.get("/", async (req, res) => {
    const hospitals = await prisma.hospital.findMany();
    res.json(hospitals);
});

// Rank hospitals dynamically with Phase 7 Metrics
router.get("/rank", async (req, res) => {
    try {
        const { treatments } = req.query;
        if (!treatments) return res.status(400).json({ error: "Treatments are required" });

        const treatmentsList = treatments.split(",");

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Fetch DB hospitals instead of mocks, including relation data for Metrics
        const dbHospitals = await prisma.hospital.findMany({
            include: {
                feedbacks: true,
                doctors: true,
                reviews: {
                    where: {
                        date: { gte: sixMonthsAgo }
                    }
                }
            }
        });

        // Compute Phase 7 Concept Metrics for each item
        const enrichedHospitals = dbHospitals.map(h => {
            // 1. Patient Satisfaction
            const satisfactionAvg = h.feedbacks.length > 0
                ? h.feedbacks.reduce((a, b) => a + b.satisfaction_score, 0) / h.feedbacks.length
                : h.rating; // Default fallback to rating if no feedback

            // 2. Doctor Experience
            const docExpAvg = h.doctors.length > 0
                ? h.doctors.reduce((a, b) => a + b.experience_years, 0) / h.doctors.length
                : 10;

            // 3. Recovery Speed (inverse logic mapping 14 days optimal)
            const recoveryAvg = h.feedbacks.length > 0
                ? h.feedbacks.reduce((a, b) => a + b.recovery_days, 0) / h.feedbacks.length
                : 14;
            const recoveryScore = Math.max(0, 10 - (recoveryAvg - 10)); // ~8-10 scale

            // Outcome Score Formula (Normalized to 100)
            // Success Rate (40%) + Satisfaction mapped to 100 (30%) + Doc Exp mapping to 100 (20%) + Recovery mapping to 100 (10%)
            const outcome_score = parseFloat((
                (h.success_rate * 0.4) +
                ((satisfactionAvg * 20) * 0.3) +
                (Math.min(docExpAvg * 5, 100) * 0.2) +
                (recoveryScore * 10 * 0.1)
            ).toFixed(1));

            // ClearMed Score (1-10) -> Outcome scaled down + distance penalty
            const clearmed_score = parseFloat(Math.max(1, Math.min(10, (outcome_score / 10) - (h.distance * 0.05))).toFixed(1));

            // Dynamic Rating based on last 6 months
            const recentReviews = h.reviews || [];
            const review_count = recentReviews.length;
            const dynamic_rating = review_count > 0
                ? Number((recentReviews.reduce((sum, r) => sum + r.rating, 0) / review_count).toFixed(1))
                : h.rating;

            return {
                id: h.id,
                name: h.name,
                city: h.city,
                rating: dynamic_rating,
                base_rating: h.rating,
                review_count: review_count,
                specializations: h.specializations.split(','),
                type: h.type,
                beds: h.beds,
                nabh_status: h.nabh_status,
                distance: h.distance,
                outcome_score,
                clearmed_score
            };
        });

        // Push through AI ranking engine using enriched data
        const response = await fetch(`${AI_SERVICE_URL}/rank-hospitals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ treatments: treatmentsList, hospitals: enrichedHospitals })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Ranking Error:", error);
        res.status(500).json({ error: "Failed to rank hospitals" });
    }
});

// Fetch reviews for a specific hospital
router.get("/:id/reviews", async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await prisma.review.findMany({
            where: { hospital_id: Number(id) },
            orderBy: { date: 'desc' }
        });
        res.json(reviews);
    } catch (error) {
        console.error("Reviews Error:", error);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});

export default router;
