import express from "express";
import Explorer from "../Models/Explorer.js";
import speakeasy from "speakeasy";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("", async (req, res) => {
  const { userId, token } = req.body;

  const user = await Explorer.findById(userId).select("twoFA");
  const email = await Explorer.findById(userId).select("email");

  const verified = speakeasy.totp.verify({
    secret: user.twoFA.secret,
    encoding: "base32",
    token,
    window: 1,
  });

  if (verified) {
    await Explorer.findByIdAndUpdate(
      userId,
      {
        "twoFA.enabled": true,
      },
      { new: true, runValidators: true }
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_ACCOUNT,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: "LostPlace Admin",
      to: email, // recipient email
      subject: "Two-Factor Authentication Enabled Successfully",
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
                  <span style="color:#cb774a;">LostPlaces</span> - 2FA Enabled!
                </h1>
                <p style="font-size: 16px; color: #3a2f2f; line-height: 1.6;">
                  Great news! You’ve successfully enabled <strong>Two-Factor Authentication (2FA)</strong> on your LostPlaces account.
                </p>
                <p style="font-size: 15px; color: #3a2f2f; line-height: 1.6; max-width: 500px; margin: 20px auto;">
                  From now on, signing in will require both your password and a verification code from your authentication app — 
                  giving your account an extra layer of protection.
                </p>

                <table style="margin: 30px auto; border-collapse: collapse;">
                  <tr>
                    <td align="center" style="background-color: #cb774a; border-radius: 8px;">
                      <a href="https://lostplaces.app/security" 
                        style="display: inline-block; padding: 12px 24px; color: #fff; text-decoration: none; font-weight: bold; font-size: 14px;">
                        Review Security Settings
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 13px; color: #3a2f2f; margin-top: 20px;">
                  If you didn’t make this change, please <a href="https://lostplaces.app/support" style="color: #cb774a; text-decoration: none;">contact our support team</a> immediately.
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

    res.json({ success: true, message: "2FA enabled" });
  } else {
    res.json({ success: false, message: "Invalid token" });
  }
});

export default router;
