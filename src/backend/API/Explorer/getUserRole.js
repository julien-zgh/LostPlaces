import express from "express";
import Explorer from "../../Models/Explorer.js";

const router = express.Router();

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Explorer.findById(id, "role");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

     res.json({ role: user.role });
  } catch (err) {
    // console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


export default router;
