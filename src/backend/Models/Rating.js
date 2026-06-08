import mongoose from "mongoose";

const RatingSchema = new mongoose.Schema(
  {
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "submissions",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
    collection: "ratings",
  }
);

const Rating = mongoose.models.Rating || mongoose.model("Rating", RatingSchema);

export default Rating;