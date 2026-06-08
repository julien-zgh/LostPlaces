import express from "express";
import Explorer from "../../Models/Explorer.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Explorer.findById(id, "email");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;