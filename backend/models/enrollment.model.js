// models/enrollment.model.js
const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    price: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    enrollmentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

module.exports = Enrollment;
