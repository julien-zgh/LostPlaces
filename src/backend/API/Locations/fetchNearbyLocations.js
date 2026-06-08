import express from "express";
import mongoose from "mongoose";
import Submission from "../../Models/Submission.js";

const router = express.Router();

// Ensure 2dsphere index exists
Submission.collection.createIndex({ coordinates: "2dsphere" }).catch((err) => {
  console.error("Failed to create 2dsphere index:", err);
});

router.get("/", async (req, res) => {
  try {
    const id = req.query.id; // expecting string ObjectId
    const lat = parseFloat(req.query.lat);
    const lon = parseFloat(req.query.lon);
    const maxDistance = 5000; // 5 km in meters

    if (isNaN(lat) || isNaN(lon)) {
      return res.status(400).json({ message: "Invalid latitude or longitude" });
    }

    console.log(
      `Searching nearby places for: lat=${lat}, lon=${lon}, maxDistance=${maxDistance}m`
    );

    const places = await Submission.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lon, lat] }, // [longitude, latitude]
          distanceField: "distance",
          maxDistance: maxDistance,
          spherical: true,
        },
      },
      { $match: { status: "approved" } },
      // Exclude the place with the same id
      ...(id
        ? [{ $match: { _id: { $ne: new mongoose.Types.ObjectId(id) } } }]
        : []),
      { $sort: { distance: 1 } },
    ]);

    console.log("Nearby places found:", places.length);
    places.forEach((place) => {
      console.log(`Place: ${place.title}, Distance: ${place.distance} meters`);
    });

    res.status(200).json(places);
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    res.status(500).json({ message: "Failed to fetch nearby places" });
  }
});

export default router;
