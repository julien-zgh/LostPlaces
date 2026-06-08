import express from "express";
import Submission from "../../Models/Submission.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { id, user_id } = req.query;
    const data = await Submission.findById(id);
    if (!data) return res.status(404);

    if (data.user_id.toString() === user_id) {
      return res.status(200).json(data);
    }

    return res.status(403).json({ error: "Not authorized" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
});


export default router;
