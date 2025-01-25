const express = require("express");
const router = express.Router();
const Enrollment = require("../models/enrollment.model"); // Kiểm tra model có tồn tại

// POST /enrollments
router.post("/", async (req, res) => {
  try {
    const { userId, courseId, price, paymentMethod } = req.body;
    const newEnrollment = new Enrollment({
      userId,
      courseId,
      price,
      paymentMethod,
      enrollmentDate: new Date(),
    });

    await newEnrollment.save();
    res.status(201).json({ msg: "Enrollment successful", enrollment: newEnrollment });
  } catch (error) {
    console.error("Error saving enrollment:", error);
    res.status(500).json({ msg: "Failed to enroll", error: error.message });
  }
});

module.exports = router; // Export router đúng cách
