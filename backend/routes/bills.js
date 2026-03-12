import express from "express";
import multer from "multer";
import Tesseract from "tesseract.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const upload = multer({ dest: uploadDir });
const router = express.Router();

router.post("/", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ error: "No file uploaded" });

        const { data: { text } } = await Tesseract.recognize(file.path, "eng");
        fs.unlinkSync(file.path);

        // Advanced Extraction & Anonymization Algorithm
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        let extractedData = {
            hospitalName: "Unknown Hospital",
            treatmentName: "Unknown Treatment",
            totalCost: 0,
            date: new Date().toISOString().split('T')[0]
        };

        // Simple Heuristics for OCR Parsing (Dropping PII)
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].toLowerCase();
            
            // Skip likely PII lines
            if (line.includes("name:") || line.includes("patient") || line.includes("address") || line.includes("dob") || line.includes("phone")) {
                continue;
            }

            // Extract Hospital Name (Usually at top, assuming first few lines with 'hospital' or 'clinic')
            if (i < 5 && (line.includes("hospital") || line.includes("clinic") || line.includes("care"))) {
                if(extractedData.hospitalName === "Unknown Hospital") extractedData.hospitalName = lines[i];
            }

            // Extract Treatment (Look for keywords)
            if (line.includes("surgery") || line.includes("procedure") || line.includes("treatment")) {
                extractedData.treatmentName = lines[i].replace(/treatment|procedure|surgery/gi, '').trim() + " Surgery";
            }

            // Extract Costs (Look for matching currency/total keywords)
            if (line.includes("total") || line.includes("amount due") || line.includes("grand total") || line.includes("₹")) {
                const numbers = line.match(/\d+(?:,\d+)*(?:\.\d+)?/g);
                if (numbers && numbers.length > 0) {
                    // Take the largest number found on a 'total' line
                    const vals = numbers.map(n => parseFloat(n.replace(/,/g, '')));
                    extractedData.totalCost = Math.max(...vals, extractedData.totalCost);
                }
            }
        }

        res.json({ 
            message: "Bill parsed successfully. Personal Data Dropped.", 
            extractedData 
        });
    } catch (error) {
        console.error("OCR Error:", error);
        res.status(500).json({ error: "OCR processing failed" });
    }
});

export default router;
