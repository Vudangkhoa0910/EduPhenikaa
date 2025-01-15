const express = require("express");
const InstructorRequest = require("../models/InstructorRequest");
const router = express.Router();

// Endpoint để đăng ký làm giảng viên
router.post("/register", async (req, res) => {
  try {
    console.log("Validated data:", req.body);

    const { name, age, profession, field, experience, description, cv } = req.body;

    // Kiểm tra dữ liệu nhập
    if (!name || !age || !profession || !field || !experience || !description || !cv) {
      console.log("Validation failed:", { name, age, profession, field, experience, description, cv });
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRequest = new InstructorRequest({
      name,
      age,
      profession,
      field,
      experience,
      description,
      cv,
    });

    await newRequest.save();

    res.status(201).json({
      message: "Instructor request created successfully",
      newRequest,
    });
  } catch (error) {
    console.error("Error occurred while processing the request:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

// Endpoint để lấy tất cả yêu cầu giảng viên
router.get("/instructorrequests", async (req, res) => {
  try {
    const requests = await InstructorRequest.find(); // Lấy tất cả yêu cầu giảng viên từ DB
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error occurred while fetching instructor requests:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

module.exports = router;
