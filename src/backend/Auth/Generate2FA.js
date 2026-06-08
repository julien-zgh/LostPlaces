import express from "express";
import Explorer from "../Models/Explorer.js";
import speakeasy from "speakeasy";
import qrcode from "qrcode";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId } = req.body;

  const secret = speakeasy.generateSecret({
    name: `LostPlaces`,
    issuer: "LostPlaces",
  });

  await Explorer.findByIdAndUpdate(
    userId,
    {
      twoFA: {
        secret: secret.base32, //to base32
        enabled: false,
      },
    },
    { new: true, runValidators: true }
  );

  // Generate QR code image data URL
  //example of url: otpauth://totp/LostPlaces?secret=JBSWY3DPEHPK3PXP&issuer=LostPlaces
  const qrData = await qrcode.toDataURL(secret.otpauth_url);
  res.json({ qr: qrData, secret: secret.base32 });
})

export default router;