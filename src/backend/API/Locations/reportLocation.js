import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { title, url, reason } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_ACCOUNT,
        pass: process.env.USER_PASS,
      },
    });

    if (!title || !url || !reason) {
      return res.status(500).json({ message: "Unknown Error!" });
    }

    const mailOptions = {
      from: "LostPlace Admin",
      to: process.env.USER_EMAIL,
      subject: `${title} was reported by a user`,
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
                <span style="color:#cb774a;">LostPlaces</span> - Report Received!
              </h1>
              <p style="font-size: 16px; color: #3a2f2f; line-height: 1.5;">
                A user has reported a location on LostPlaces. Here are the details:
              </p>
              <table style="width: 100%; max-width: 500px; margin: 20px auto; font-size: 14px; color: #3a2f2f; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Title:</td>
                  <td style="padding: 8px;">${title}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">URL:</td>
                  <td style="padding: 8px;"><a href="${url}" style="color: #cb774a; text-decoration: none;">${url}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px; font-weight: bold;">Reason:</td>
                  <td style="padding: 8px;">${reason}</td>
                </tr>
              </table>
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
    return res.status(200).json({ message: "Location Reported Successfully!" });
  } catch {
    return res
      .status(500)
      .json({
        message: "An error occured while reporting. Please try again later!",
      });
  }
});

export default router;
