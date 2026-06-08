import express from "express";
import Explorer from "../../Models/Explorer.js";
import Submission from "../../Models/Submission.js";

import Rating from "../../Models/Rating.js";
import VisitedItem from "../../Models/VisitedItem.js";
import WhishListItem from "../../Models/Whishlist.js";

import supabase from "../../supabaseNodejsClient.js";

const router = express.Router();

// DELETE user by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the user
    const deletedUser = await Explorer.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Delete ratings, visited items, and wishlist items associated with the user
    await Promise.all([
      Rating.deleteMany({ userId: id }),
      VisitedItem.deleteMany({ userId: id }),
      WhishListItem.deleteMany({ userId: id }),
    ]);

    // Get all submissions of this user
    const submissions = await Submission.find({ user_id: id });

    // Delete images from Supabase storage
    for (const submission of submissions) {
      if (submission.images && submission.images.length > 0) {
        for (let imgPath of submission.images) {
          // Remove leading slash if present
          if (imgPath.startsWith("/")) {
            imgPath = imgPath.slice(1);
          }

          const { error } = await supabase.storage
            .from("lostplaces")
            .remove([imgPath]);

          if (error) console.error("Failed to delete image:", imgPath, error);
        }
      }
    }

    // Delete all submissions associated with this user
    await Submission.deleteMany({ user_id: id });

    res
      .status(200)
      .json({ message: "User and related submissions deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
