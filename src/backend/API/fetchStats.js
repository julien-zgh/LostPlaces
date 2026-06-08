import express from "express";
import mongoose from "mongoose";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = mongoose.connection;

    // Count users with role !== "admin"
    const usersCount = await db
      .collection("users")
      .countDocuments({ role: { $ne: "admin" } });

    // Count approved and pending submissions from the 'submissions' collection
    const approvedCount = await db
      .collection("submissions")
      .countDocuments({ status: "approved" });

    const pendingCount = await db
      .collection("submissions")
      .countDocuments({ status: "pending" });

    const monthlyVisits = 0; // placeholder

    res.json({
      users: usersCount,
      locations: approvedCount,
      pendingLocations: pendingCount,
      monthlyVisits,
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
