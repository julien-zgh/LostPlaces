import express from "express";
import Submission from "../../Models/Submission.js";
import Explorer from "../../Models/Explorer.js";
import WhishListItem from "../../Models/Whishlist.js";
import supabase from "../../supabaseNodejsClient.js";

const router = express.Router();

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Get submission
    const location = await Submission.findById(id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    const { images, user_id, status } = location;

    // 2. Remove images from Supabase storage
   for (const image of images) {
     // remove leading slash so it's a valid path inside the bucket
     const imagePath = image.startsWith("/") ? image.substring(1) : image;

     const { error } = await supabase.storage
       .from("lostplaces")
       .remove([imagePath]);

     if (error) {
       console.error("Error deleting image from storage:", error.message);
       return res.status(500).json({ message: "Could not delete image(s)" });
     }
   }

    // 3. Delete submission
    await Submission.findByIdAndDelete(id);

    // 4. delete location from whislist if it exists
    await WhishListItem.findOneAndDelete({placeId: id});

    // 5. Decrement user’s counter based on status
    let updateField = {};
    if (status === "approved") {
      updateField = { $inc: { approved: -1 } };
    } else if (status === "pending") {
      updateField = { $inc: { pending: -1 } };
    } else if (status === "rejected") {
      updateField = { $inc: { rejected: -1 } };
    }

    if (Object.keys(updateField).length > 0) {
      await Explorer.findByIdAndUpdate(user_id, updateField, { new: true });
    }

    res.status(200).json({ message: "Location Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting location:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
