import express from "express";
import fetch from "node-fetch";

const router = express.Router();
const AI_SERVICE_URL = "http://127.0.0.1:8000";

router.post("/analyze", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "Text is required" });

        const response = await fetch(`${AI_SERVICE_URL}/analyze-symptoms`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("AI Service Error:", error);
        res.status(500).json({ error: "Failed to analyze symptoms" });
    }
});

export default router;
