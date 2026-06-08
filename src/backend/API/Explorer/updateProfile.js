import express from "express";
import Explorer from "../../Models/Explorer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { _id, ...updatedData } = req.body;

    if (!_id) {
      return res.status(400).json({ message: "User ID is required!" });
    }

    const updatedUser = await Explorer.findByIdAndUpdate(_id, updatedData, {
      runValidators: true, // Validate data before updating
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    return res.status(200).json({
      message: "User updated successfully!",
    });
  } catch (error) {
    // console.error("Update user error:", error.message);
    return res.status(500).json({ message: "Server error!" });
  }
});

export default router;
