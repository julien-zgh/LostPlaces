import express from "express";
import Submission from "../../Models/Submission.js";
import Explorer from "../../Models/Explorer.js";

const router = express.Router();

router.post("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {reason} = req.body;

    // find the submission
    const location = await Submission.findById(id);
    if (!location) {
      return res.status(404).json({ error: "Submission not found" });
    }

    const { user_id } = location;

    // increment rejected count for the user
    const updatedUser = await Explorer.findByIdAndUpdate(
      user_id,
      {
        $inc: {
          rejected: 1,
          pending: -1,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // update submission status
    const updatedLocation = await Submission.findByIdAndUpdate(
      id,
      { status: "rejected",rejection_reason: reason },
      { new: true }
    );

    if (!updatedLocation) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      message: "Submission rejected successfully",
    });
  } catch {
    // console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
