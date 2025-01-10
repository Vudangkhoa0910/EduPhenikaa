import { Box, Button, FormControl, FormLabel, Grid, Input, Textarea } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import TeacherNavTop from "./TeacherNavTop";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { addVideo } from "../../Redux/TeacherReducer/action";

const AddTeacherVideos = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Khởi tạo state cho form
  const [detail, setDetail] = useState({
    title: "",
    description: "",
    link: "",
    views: "",
    img: "",
    courseId: "",
  });

  const [isLoading, setIsLoading] = useState(true); // Thêm trạng thái loading

  useEffect(() => {
    if (location.state) {
      const { id, title } = location.state;
      // Kiểm tra nếu không có id hoặc title
      if (!id || !title) {
        alert("Thiếu thông tin cần thiết");
        navigate("/error"); // Điều hướng đến trang lỗi nếu thiếu dữ liệu
      } else {
        // Cập nhật dữ liệu khi location.state có dữ liệu
        setDetail((prev) => ({
          ...prev,
          title,
          courseId: id.toString(),
        }));
        setIsLoading(false); // Đã có dữ liệu, không cần loading nữa
      }
    } else {
      alert("Không có dữ liệu từ location");
      navigate("/error"); // Điều hướng đến trang lỗi nếu không có dữ liệu từ location
    }
  }, [location.state, navigate]);

  // Kiểm tra nếu đang loading
  if (isLoading) {
    return <div>Loading...</div>; // Hoặc có thể thay thế bằng spinner loading
  }

  // Hàm xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý submit form
  const handleSubmit = () => {
    if (!detail.title || !detail.courseId) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // Gửi dữ liệu lên Redux
    dispatch(addVideo(detail, detail.courseId));
    alert("Video thêm thành công");
    navigate("/Teacher/add"); // Điều hướng đến trang sau khi thêm video thành công
  };

  return (
    <Grid className="Nav" h={"99vh"} w="94%" gap={10}>
      <Box mt="80px">
        <TeacherNavTop />

        <Box border={"2px solid gray"} borderRadius={10} p={10} h="90%">
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              type="text"
              placeholder="Enter Video Title"
              name="title"
              value={detail.title}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>CourseID</FormLabel>
            <Input
              type="text"
              placeholder="Enter The Course Id to add video"
              name="courseId"
              value={detail.courseId}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              type="text"
              placeholder="Enter Description"
              name="description"
              value={detail.description}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Link</FormLabel>
            <Input
              type="text"
              placeholder="Enter video Link"
              name="link"
              value={detail.link}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Views</FormLabel>
            <Input
              type="number"
              placeholder="Enter Total Views"
              name="views"
              value={detail.views}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Thumbnail</FormLabel>
            <Input
              type="text"
              placeholder="Enter Video Thumbnail"
              name="img"
              value={detail.img}
              onChange={handleChange}
            />
          </FormControl>

          <Button
            mt={4}
            colorScheme="blue"
            size="md"
            isFullWidth
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default AddTeacherVideos;