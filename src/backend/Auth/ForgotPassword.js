import express from "express";
import Explorer from "../Models/Explorer.js";
import PassReset from "../Models/PassReset.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

const router = express.Router();

router.get("/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const { _id } = await Explorer.findOne({ email });

    if (!_id) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const expireTime = Date.now() + 1000 * 60 * 60; // expires after 1 hour

    // const expireTime = Date.now() + 1000 * 60 * 5; // expires after 5 minutes

    const resetUrl = `http://localhost:8080/reset-password?token=${resetToken}&id=${_id}`;

    const passResetEntry = new PassReset({
      userId: _id,
      token: hashedToken,
      expiresAt: new Date(expireTime),
    });

    await passResetEntry.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_ACCOUNT,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: "LostPlace Admin",
      to: email,
      subject: `Reset Your LostPlaces Password`,
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
    </head>
    <body style="margin: 0; padding: 0; background-color: #faf7f3;">
      <table width="100%" bgcolor="#faf7f3" cellpadding="0" cellspacing="0" style="font-family: Georgia, serif;">
        <tr>
          <td align="center" style="padding: 60px 20px;">
            <table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border-radius: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); padding: 50px;">
              <tr>
                <td align="center" style="padding-bottom: 35px;">
                  <h1 style="font-size: 34px; font-weight: 700; color: #3a2f2f; margin: 0; padding-top: 5%;">
                    <span style="color:#cb774a;">LostPlaces</span>
                  </h1>
                  <p style="font-size: 16px; color: #3a2f2f; line-height: 1.6; margin-top: 20px;">
                    You requested a password reset. Click the button below to reset your password. This link will expire in 5 minutes.
                  </p>
                  <a href="${resetUrl}" 
                     style="display: inline-block; margin-top: 25px; padding: 15px 25px; background-color: #cb774a; color: #fff; text-decoration: none; font-weight: bold; border-radius: 8px;">
                    Reset Password
                  </a>
                  <p style="font-size: 14px; color: #bbb; margin-top: 20px;">
                    If you didn't request this, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <p style="font-size: 12px; color: #bbb; font-family: Georgia, serif;">
                    &copy; 2025 LostPlaces. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Reset Password Mail Sent!" });

  } catch {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
