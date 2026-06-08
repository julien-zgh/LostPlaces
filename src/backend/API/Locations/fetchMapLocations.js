import express from "express";
import Submission from "../../Models/Submission.js";

const router = express.Router();

router.get("/", async (req,res) => {
    try {
        const data = await Submission.find({ status: "approved" }).sort({
          createdAt: -1,
        });

        return res.status(200).json(data);
    } catch {
        return res.status(500).json({message: "Failed to fetch map locations"})
    }
})

export default router;