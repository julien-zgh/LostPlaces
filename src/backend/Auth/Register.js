import bcrypt from "bcryptjs";
import Explorer from "../Models/Explorer.js";
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// Load env variables
dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_ACCOUNT,
    pass: process.env.USER_PASS,
  },
});

// Registration route
router.post("/", async (req, res) => {
  // console.log("Request body:", req.body);
  const { firstName, lastName, email, role, password } = req.body;

  try {
    // console.log("Checking existing user with email:", email);
    const existingUser = await Explorer.findOne({ email });
    // console.log("Existing user found?", existingUser);

    if (existingUser) {
      return res.status(400).send("User with this email already exists.");
    } else {
      // console.log("Password length:", password.length);
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

      const newUser = new Explorer({
        firstName,
        lastName,
        email,
        role,
        password: hashedPassword,
        ...(role === "explorer"
          ? { approved: 0, pending: 0, rejected: 0 }
          : { saved: [], visited: [], reviewed: [] }),
        joinDate: new Date(),
        profile_pic: "",
      });
      //   console.log("Saving new user:", newUser);
      await newUser.save();
      const mailOptions = {
        from: "SignUp - LostPlaces",
        to: email,
        subject: "Welcome to LostPlaces!",
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
                            Welcome to <span style="color:#cb774a;">LostPlaces</span>!
                          </h1>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-bottom: 40px;">
                          <p style="font-size: 18px; line-height: 1.7; color: #7c6e6e; max-width: 480px; margin: 0 auto;">
                            Thank you for joining us.<br /> Whether you're a new explorer or returning, we’re thrilled to have you uncovering hidden history with us.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding-bottom: 50px;">
                          <a href="http://localhost:8080/map"
                             style="display: inline-block; background-color: #cb774a; color: #ffffff; text-decoration: none; padding: 16px 36px; border-radius: 10px; font-weight: 500; font-family: Georgia, serif; font-size: 16px;">
                            Explore the Map
                          </a>
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
      try {
        await transporter.sendMail(mailOptions);
        res.status(201).send("User registered successfully");
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        res.status(500).send("User registered, but email sending failed.");
      }
    }
  } catch (err) {
    res.status(400).send("Error registering user: " + err.message);
  }
});

export default router;
