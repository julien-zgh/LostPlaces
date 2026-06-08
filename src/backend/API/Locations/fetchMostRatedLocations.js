import express from "express";
import Rating from "../../models/Rating.js";
import Submission from "../../models/Submission.js";

const router = express.Router();

/**
 * ======================================================
 * ======================================================
 * .aggregate() is used to run aggregation pipelines, which allow you to process data step by step.
 * $group groups documents by placeId.
 * avgRating: calculates the average rating for each place.
 * ratingCount: counts how many ratings each place has.
 * Sort by avgRating in descending order (highest rated first).
 * If two places have the same average, it sorts by ratingCount in descending order (more ratings first).
 * Only take the top 3 places after sorting.
 * ======================================================
 * ======================================================
 * $lookup is like a join in SQL.
 * from: collection to join with (submissions = your places collection).
 * localField: _id of the grouped data (which is placeId from $group).
 * foreignField: _id of the submissions collection
 * as: the joined data will appear in an array called place.
 * ======================================================
 * ======================================================
 * Since $lookup returns an array, $unwind converts it to a single object for easier access.
 * ======================================================
 * ======================================================
 * $project controls which fields to include in the final output.
 * _id: 0 → removes the MongoDB default _id.
 * placeId → rename _id to placeId.
 * avgRating → rounds average rating to 2 decimal places.
 * ratingCount → keeps the count as is.
 * ======================================================
 * ======================================================
 */

router.get("/", async (req, res) => {
  try {
    const data = await Rating.aggregate([
      {
        $group: {
          _id: "$placeId",
          avgRating: { $avg: "$rating" },
          ratingCount: { $sum: 1 },
        },
      },
      {
        $sort: { avgRating: -1, ratingCount: -1 }, // sort by avg first, then count
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: "submissions", // name of your places collection
          localField: "_id",
          foreignField: "_id",
          as: "place",
        },
      },
      { $unwind: "$place" },
      {
        $project: {
          _id: 0,
          placeId: "$_id",
          avgRating: { $round: ["$avgRating", 2] }, // round avg to 2 decimals
          ratingCount: 1,
        },
      },
    ]);

    if (!data || data.length === 0) {
      const recentSubmissions = await Submission.find({ status: "approved" })
        .sort({ createdAt: -1 }) // sort by most recent
        .limit(3);


      const formatted = recentSubmissions.map((submission) => ({
        placeId: submission._id,
        avgRating: null,
        ratingCount: 0,
      }));

      return res.status(200).json(formatted);
    }

    return res.status(200).json(data);
  } catch {
    return res.status(500).json({ message: "Server Error" });
  }
});

export default router;
