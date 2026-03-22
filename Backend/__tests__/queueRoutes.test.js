const request = require("supertest");
const express = require("express");
const { generateToken, getQueue, clearQueue } = require("../routes/queueRoutes");

const app = express();
app.use(express.json());

// Routes for testing
app.post("/get-token", generateToken);
app.get("/queue", getQueue);
app.post("/clear", clearQueue);

describe("Smart Hospital Queue API", () => {

  // Clear the queue before tests
  beforeAll(async () => {
    await request(app).post("/clear");
  });

  it("should generate a new token", async () => {
    const res = await request(app).post("/get-token").send({
      name: "Test Patient",
      department: "OPD",
      emergency: false
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.patient).toHaveProperty("token");
    expect(res.body.patient.name).toBe("Test Patient");
  });

  it("should return the queue", async () => {
    const res = await request(app).get("/queue");
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("should clear the queue", async () => {
    const res = await request(app).post("/clear");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe("Queue cleared");
  });
});