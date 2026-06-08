import express from "express";
import fs from "fs";
import path from "path";
import Category from "../Models/Category.js";

const router = express.Router();

// Get absolute path to categories.json
const __dirname = path.resolve(); // Equivalent to __dirname in ESM
const filePath = path.join(__dirname, "src", "lib", "Data", "categories.json");

// Read and parse the categories from the file
let categories = [];
try {
  const jsonData = fs.readFileSync(filePath, "utf-8");
  categories = JSON.parse(jsonData);
} catch (err) {
  console.error("Failed to load categories.json:", err);
}

// POST /api/categories — Seed categories from file into MongoDB
router.post("/", async (req, res) => {
  try {
    // Optional: remove all existing categories before seeding
    await Category.deleteMany();

    // Insert loaded categories into the database
    const inserted = await Category.insertMany(categories);

    res.status(201).json({
      message: "Categories seeded successfully",
      count: inserted.length,
      data: inserted,
    });
  } catch (error) {
    console.error("Error seeding categories:", error);
    res.status(500).json({ error: "Failed to seed categories" });
  }
});

export default router;
