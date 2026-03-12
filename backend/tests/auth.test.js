import request from "supertest";
import express from "express";
import authRoutes from "../routes/auth.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

// Setup Mock App Instance for Supertest
const app = express();
app.use(express.json());
app.use("/api/v1/auth", authRoutes);

const prisma = new PrismaClient();

// Setup unique test email per run to avoid clashes during MVP
const testEmail = `testuser_${Date.now()}@example.com`;
const testPassword = "password123";

describe("Authentication Endpoints", () => {
    beforeAll(async () => {
        // Optionally clear previous tests
    });

    afterAll(async () => {
        // Cleanup the database entry
        await prisma.user.deleteMany({
            where: { email: testEmail }
        });
        await prisma.$disconnect();
    });

    it("should securely register a new valid user", async () => {
        const res = await request(app)
            .post("/api/v1/auth/register")
            .send({
                name: "Test User",
                email: testEmail,
                password: testPassword
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("message", "User registered successfully");
        expect(res.body).toHaveProperty("userId");
    });

    it("should successfully log the user in and return a JWT", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: testEmail,
                password: testPassword
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("message", "Login successful");
        expect(res.body).toHaveProperty("token");
    });

    it("should fail to login with an incorrect password", async () => {
        const res = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: testEmail,
                password: "wrongpassword!!!"
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty("error", "Invalid credentials");
    });
});
