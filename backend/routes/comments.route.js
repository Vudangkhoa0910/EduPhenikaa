const express = require("express");
const Comment = require("../models/comment.model");
const router = express.Router();

// Lấy danh sách bình luận theo courseId (sử dụng populate để lấy tên người dùng)
router.get("/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    const comments = await Comment.find({ courseId })
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Thêm bình luận mới
router.post("/", async (req, res) => {
  try {
    const { courseId, userId, text } = req.body;
    if (!courseId || !userId || !text) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    // Nếu trong model bạn định nghĩa key là "user" (tham chiếu đến User), chuyển userId vào trường user:
    const newComment = new Comment({ courseId, userId, text });
    await newComment.save();
    // Sau khi lưu, trả về bình luận mới (có thể thêm populate nếu cần)
    const populatedComment = await newComment
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

module.exports = router;
