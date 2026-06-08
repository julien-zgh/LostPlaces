import express from "express";
import Explorer from "../Models/Explorer.js";
import speakeasy from "speakeasy";

const router = express.Router();

router.post("", async (req, res) => {
  try {
    const { token } = req.body;
    const userId = req.session.pending2FA;

    const userTwoFA = await Explorer.findById(userId.id).select("twoFA");

    const verified = speakeasy.totp.verify({
      secret: userTwoFA.twoFA.secret,
      encoding: "base32",
      token,
      window: 1,
    });

    /**
     * With window: 1, you allow:
     * The code from previous 30 seconds
     * The current code
     * The code from next 30 seconds
     * This helps if user’s clock is slightly off.
     */

    if (verified) {
      // Store user id in session
      req.session.user = {
        id: userId.id,
      };
      // Clear pending 2FA session
      delete req.session.pending2FA;

      return res.status(200).send({ message: "2FA Verification Successful" });
    } else {
      return res.status(400).send("Invalid 2FA token");
    }
  } catch {
    return res.status(500).send("Server error");
  }
});

export default router;
