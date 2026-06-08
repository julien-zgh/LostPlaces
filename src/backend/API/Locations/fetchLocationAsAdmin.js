import express from "express";
import Submission from "../../Models/Submission.js";

const router = express.Router();

router.get("/", async (req,res) => {
    try {
        const locations = await Submission.find().sort({ createdAt: -1 });;
        res.status(200).json(locations);
    } catch {
        res.status(500).json({error: "Failed to fetch locations"});
    }
})

export default router;