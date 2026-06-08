import mongoose from "mongoose";

const WhishlistSchema = new mongoose.Schema(
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
    collection: "whishlist",
  }
);

const WhishListItem =
  mongoose.models.WhishListItem ||
  mongoose.model("WhishListItem", WhishlistSchema);

export default WhishListItem;