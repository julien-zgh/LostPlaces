import express from "express";
import Explorer from "../../Models/Explorer.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const explorer = await Explorer.findById(
      id,
      "firstName lastName profile_pic"
    );
    if (!explorer) {
      return res.status(404).json({ message: "Explorer Not Found" });
    }
    return res.status(200).json(explorer);
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
});

export default router;
