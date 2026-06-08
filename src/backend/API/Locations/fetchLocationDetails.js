import express from "express";
import Submission from "../../Models/Submission.js";

const router = express.Router();

router.get("/:id", async (req,res) => {
    try {
        const {id}= req.params;
        
        const data = await Submission.findById(id);
        if(!data) {
            return res.status(404).json({message: "Could not find that location"})
        }
        return res.status(200).json(data);
    } catch {
        return res.status(500).json({message: "Error while fetching location information"});
    }
})

export default router;