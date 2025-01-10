import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Heading,
  Text,
  Card,
  Stack,
  Image,
  Divider,
} from "@chakra-ui/react";
import { useSelector } from "react-redux";
import Navbar from "../UserComponents/UserNavbar";
import Footer from "../../Pages/Footer";

export default function VideoDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const userStore = useSelector((store) => store.UserReducer);

  const [res, setRes] = useState({});
  const [videoUrl, setVideoUrl] = useState(null);

  // Lấy courseId và url từ query string
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get("courseId");
  const initialUrl = queryParams.get("url");

  useEffect(() => {
    if (courseId) getSinglePageData();
    if (initialUrl) setVideoUrl(decodeURIComponent(initialUrl)); // Giải mã URL ban đầu
  }, [courseId, initialUrl]);

  const getSinglePageData = () => {
    const token = userStore?.token;
    fetch(`http://localhost:5000/videos/courseVideos/${courseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setRes(data))
      .catch((err) => console.error("Error fetching video data:", err));
  };

  const handleImageClick = (videoUrl) => {
    // Sử dụng URLSearchParams để xây dựng URL chuyển hướng
    const params = new URLSearchParams();
    params.set("courseId", res?.course?._id);
    params.set("url", encodeURIComponent(videoUrl));

    // Chuyển hướng với courseId và videoUrl
    navigate(`/video-detail/?${params.toString()}`);
    setVideoUrl(videoUrl); // Cập nhật video hiển thị
  };

  return (
    <>
      <Navbar />
      <Box w="100%" p="4" display="flex" flexDirection="row" mt="20">
        {/* Video lớn bên trái */}
        <Box w="70%" mr="4">
          {videoUrl ? (
            <iframe
              width="100%"
              height="500px"
              src={videoUrl}
              title="Video Player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <Heading size="lg">No video URL provided</Heading>
          )}

          {/* Đoạn giới thiệu video */}
          <Box mt="4">
            <Heading size="lg">Course Overview</Heading>
            <Text mt="2">
              Welcome to our video course! In this course, we will explore the
              core concepts of [Topic], with a detailed breakdown of key lessons
              that will help you deepen your understanding. This course is
              designed for learners of all levels, from beginners to experts.
              Throughout the videos, we will cover practical examples and
              provide insights that are directly applicable to real-world
              situations.
            </Text>
            <Text mt="2">
              Whether you're interested in mastering the basics or enhancing
              your existing skills, you'll find valuable takeaways in every
              section. The course is structured to give you a solid foundation,
              followed by advanced techniques and strategies that will set you
              apart in your field. We hope you find this course both engaging
              and rewarding.
            </Text>
            <Text mt="2">
              In addition to the video lessons, we will provide downloadable
              resources and tips throughout the course. Be sure to take notes
              and revisit key sections as needed. We are excited to have you
              here, and we can't wait to see your progress!
            </Text>
            <Divider mt="4" />
          </Box>
        </Box>

        {/* Danh sách video bên phải */}
        <Box
          w="30%"
          h="100vh" // Sử dụng height="100vh" để kéo dài danh sách video đến hết chiều cao màn hình
          overflowY="auto"
          borderLeft="1px solid gray"
          pl="4"
        >
          {res?.course?.videos?.length ? (
            res.course.videos.map((video, index) => {
              const embedUrl = video?.link;
              return (
                <Card
                  key={index}
                  direction="row"
                  overflow="hidden"
                  variant="outline"
                  border="1px solid"
                  mb="4"
                  onClick={() => handleImageClick(embedUrl)}
                  cursor="pointer"
                  _hover={{ boxShadow: "lg" }}
                >
                  <Box w="30%" display="flex" justifyContent="center">
                    {embedUrl ? (
                      <iframe
                        width="100%"
                        height="100"
                        src={embedUrl}
                        title={video?.title || "YouTube video player"}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <Image
                        w="100%"
                        h="100px"
                        src={video?.img || ""}
                        alt={video?.title}
                        objectFit="cover"
                      />
                    )}
                  </Box>
                  <Stack w="70%" p="2">
                    <Heading size="sm">{video?.title || "Video Name"}</Heading>
                    <Text fontSize="sm" noOfLines={2}>
                      {video?.description}
                    </Text>
                  </Stack>
                </Card>
              );
            })
          ) : (
            <Text fontSize="1.2rem" fontWeight="bold" mt="3rem">
              We are working on the content of this course. You will soon get
              the video.
            </Text>
          )}
        </Box>
      </Box>
      <Footer />
    </>
  );
}
