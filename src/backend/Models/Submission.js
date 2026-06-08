import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // Reference to your Users collection
      required: true,
    },
    sub_id: {
      type: String,
      required: true,
      unique: true, // Ensure sub_id is unique
      lowercase: true, // Store sub_id in lowercase
      trim: true, // Remove leading/trailing whitespace
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories", // Reference to your Categories collection
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    coords: {
      type: [Number], // [longitude, latitude]
      validate: {
        validator: (v) => v.length === 2,
        message: "coords must be an array of [longitude, latitude]",
      },
      required: true,
    },
    // for nearby places
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: (v) => v.length === 2,
          message: "coordinates must be [longitude, latitude]",
        },
      },
    },
    images: {
      type: [String], // Array of image URLs or paths
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejection_reason: {
      type: String,
      default: "",
      validate: {
        validator: function (v) {
          // Allow empty string or non-empty string if status is 'rejected'
          return this.status !== "rejected" || v.trim() !== "";
        },
        message: "rejection_reason must be provided if status is 'rejected'",
      },
    },
    // Contact Info Fields
    phone: {
      type: [String], // [phone_code, phone_number]
      default: [],
      validate: {
        validator: (v) => v.length === 2 || v.length === 0,
        message:
          "phone must be an array of [phone_code, phone_number] or empty",
      },
    },
    email: {
      type: String,
      default: "",
      // Optional: add regex validation for email format here if desired
    },
    website: {
      type: [String], // [web_title, web_url]
      default: [],
      validate: {
        validator: (v) => v.length === 2 || v.length === 0,
        message: "website must be an array of [web_title, web_url] or empty",
      },
    },
    facebook: {
      type: [String], // [facebook_title, facebook_url]
      default: [],
      validate: {
        validator: (v) => v.length === 2 || v.length === 0,
        message:
          "facebook must be an array of [facebook_title, facebook_url] or empty",
      },
    },
    instagram: {
      type: [String], // [insta_title, insta_url]
      default: [],
      validate: {
        validator: (v) => v.length === 2 || v.length === 0,
        message:
          "instagram must be an array of [insta_title, insta_url] or empty",
      },
    },
    tiktok: {
      type: [String], // [tiktok_title, tiktok_url]
      default: [],
      validate: {
        validator: (v) => v.length === 2 || v.length === 0,
        message:
          "tiktok must be an array of [tiktok_title, tiktok_url] or empty",
      },
    },
  },
  {
    timestamps: true,
    collection: "submissions",
  }
);

export default mongoose.models.Submission ||
  mongoose.model("Submission", SubmissionSchema);
