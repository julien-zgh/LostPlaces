import nodemailer from "nodemailer";
import express from "express";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message, email, locationTitle } = req.body;

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
      subject: `${locationTitle} Status Update`,
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
                          <span style="color:#cb774a;">LostPlaces</span>!
                          <br/>
                          </h1>
                          ${message}
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
    res.status(200).json({ message: "Explorer has been notified" });
  } catch {
    res.status(500).json({ error: "Error trying to notify explorer" });
  }
});

export default router;
