import express from "express";
import Submission from "../../Models/Submission.js";
import Explorer from "../../Models/Explorer.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const {
    user_id,
    title,
    description,
    category_id,
    country,
    location,
    coords,
    images,
    phone, // [phone_code, phone_number]
    email,
    website, // [web_title, web_url]
    facebook, // [facebook_title, facebook_url]
    instagram, // [insta_title, insta_url]
    tiktok, // [tiktok_title, tiktok_url]
  } = req.body;

  // Validation: Check required fields
  if (
    !title ||
    !description ||
    !category_id ||
    !country ||
    !location ||
    !coords ||
    !Array.isArray(coords) ||
    coords.length !== 2
  ) {
    return res
      .status(400)
      .json({ error: "Please fill in all required fields correctly." });
  }

  try {
    const newSubmission = new Submission({
      user_id,
      sub_id: title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .trim()
        .replace(/\s+/g, "."),
      title,
      description,
      category_id,
      country,
      location,
      coords,
      coordinates: {
        // GeoJSON object for geospatial queries
        type: "Point",
        coordinates: [parseFloat(coords[1]), parseFloat(coords[0])],
      },
      images,
      phone,
      email,
      website,
      facebook,
      instagram,
      tiktok,
      status: "pending",
    });

    await newSubmission.save();

    await Explorer.findByIdAndUpdate(user_id, { $inc: { pending: 1 } });

    return res
      .status(201)
      .json({ message: "Submission created successfully." });
  } catch (error) {
    console.error("Error saving submission:", error);
    return res.status(500).json({ error: "Failed to save submission" });
  }
});

export default router;
