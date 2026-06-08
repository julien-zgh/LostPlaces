import mongoose from "mongoose";

const VisitedSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
    collection: "visited",
  }
);

const VisitedItem =
  mongoose.models.VisitedItem ||
  mongoose.model("VisitedItem", VisitedSchema);

export default VisitedItem;