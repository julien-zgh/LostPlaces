import express from "express";
import Explorer from "../Models/Explorer.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Find user by session id but exclude password field
    const user = await Explorer.findById(req.session.user.id).select(
      "-password"
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch {
    // console.error("Profile fetch error:", err);
    return res.status(500).json({ message: "Server error"});
  }
});

export default router;
