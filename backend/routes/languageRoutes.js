const express = require("express");
const router = express.Router();
const Language = require("../models/languageModel");

// POST /api/language/add - Add a new language
router.post("/add", async (req, res) => {
  try {
    const { language } = req.body;
    const newLang = await Language.create({ language });
    res.status(201).json(newLang);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/language/ - Get all languages
router.get("/", async (req, res) => {
  try {
    const languages = await Language.find({});
    res.json(languages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

