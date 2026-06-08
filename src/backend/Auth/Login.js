import mongoose from "mongoose";
import express from "express";
import bcrypt from "bcryptjs";

const router = express.Router();

// Define the schema and model
const userSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  twoFA: {
    enabled: { type: Boolean, default: false },
    secret: { type: String, default: null },
  }
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  if (email === "" || password === "") {
    return res.status(400).send({ message: "Email and password are required" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).send({ message: "Invalid email or password" });
    }

    // Check if 2FA is enabled
    if (existingUser.twoFA.enabled) {
      // Temporarily mark user as pending verification
      req.session.pending2FA = { id: existingUser._id };
      return res.status(200).json({
        message: "2FA required",
        twoFA: true,
      });
    }

    // Store user id in session
    req.session.user = {
      id: existingUser._id,
    };
    // console.log(req.session.user);

    // localStorage.setItem("loggedIn", "true");
    return res.status(200).send({ message: "Login Successful" });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).send({ message: "Server error" });
  }
});

export default router;
