import express from "express";
import Explorer from "../../Models/Explorer.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Find users where role is NOT equal to "admin"
    const users = await Explorer.find({ role: { $ne: "admin" } });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;
