const mongoose = require("mongoose");

const InstructorRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  profession: { type: String, required: true },
  field: { type: String, required: true },
  experience: { type: String, required: true },
  description: { type: String, required: true },
  cv: { type: String, required: true }, // Đường dẫn hoặc link đến file CV
});

const InstructorRequest = mongoose.model("InstructorRequest", InstructorRequestSchema);

module.exports = InstructorRequest;

