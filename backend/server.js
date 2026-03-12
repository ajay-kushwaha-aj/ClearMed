import express from "express";
import cors from "cors";

// Import Modular Routes
import authRoutes from "./routes/auth.js";
import hospitalRoutes from "./routes/hospitals.js";
import symptomRoutes from "./routes/symptoms.js";
import billRoutes from "./routes/bills.js";
import advancedRoutes from "./routes/advanced.js";

const app = express();
app.use(express.json());
app.use(cors());

// Mount Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/hospitals", hospitalRoutes);
app.use("/api/v1/symptoms", symptomRoutes);
app.use("/api/v1/bills", billRoutes);
app.use("/api/v1", advancedRoutes);

if (!process.env.JEST_WORKER_ID) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
