import express from "express";
import Explorer from "../Models/Explorer.js";
import PassReset from "../Models/PassReset.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";

const router = express.Router();

router.post("/:token", async (req, res) => {
    try {
        const {token }  = req.params;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const password = req.body.password;
        if (password.length < 8) {
          return res
            .status(400)
            .send("Password must be at least 8 characters long.");
        }
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/.test(
            password
          )
        ) {
          return res
            .status(400)
            .send(
              "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const passResetToken = await PassReset.findOne({ token: hashedToken });
        if(!passResetToken) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        await Explorer.updateOne(
            { _id: passResetToken.userId },
            { $set: { password: hashedPassword } }
        );
        await PassReset.deleteOne({ _id: passResetToken._id });
        return res.status(200).json({ message: "Password reset successful" });
    } catch {
        return res.status(500).json({ message: "Server error" });
    }
})


export default router;