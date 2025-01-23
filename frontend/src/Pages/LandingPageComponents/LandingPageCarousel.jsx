import React, { useEffect, useState } from "react";
import { Box, Flex, Heading, Text, Spinner } from "@chakra-ui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./LandingPageComponent.css";
import Card from "./Card";
import LoadingComponent from "../LoadingComponents/LoadingComponent";

const LandingPageCarousel = ({ keyword }) => {
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const arr = [1, 2, 3, 4];

  const settings = {
    swipe: true,
    dots: true,
    infinite: courses.length > 4,
    speed: 500,
    slidesToShow: courses.length < 4 ? courses.length : 4,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: courses.length < 4 ? "0px" : "50px",
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: Math.min(4, courses.length), slidesToScroll: 1, centerMode: true } },
      { breakpoint: 1024, settings: { slidesToShow: Math.min(3, courses.length), slidesToScroll: 1, centerMode: true } },
      { breakpoint: 800, settings: { slidesToShow: Math.min(2, courses.length), slidesToScroll: 1, centerMode: true } },
      { breakpoint: 500, settings: { slidesToShow: 1, slidesToScroll: 1, centerMode: true } },
    ],
    appendDots: (dots) => (
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.5)", 
          borderRadius: "10px",
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          position: "absolute",  
          bottom: "-40px",       
          width: "100%",        
          zIndex: "10",          
        }}
      >
        <ul style={{ margin: "0px", display: "flex", listStyleType: "none" }}> {dots} </ul>
      </div>
    ),
    customPaging: (i) => (
      <div
        style={{
          width: "12px", 
          height: "12px",
          borderRadius: "50%",
          backgroundColor: "#3182CE", 
          border: "2px solid #fff", 
          margin: "0 5px",
          transition: "background-color 0.3s ease, transform 0.3s ease",
        }}
      />
    ),
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    initialSlide: 0,
  };
  

  useEffect(() => {
    const url = "http://localhost:5001/courses/all";
    setLoading(true);

    fetch(url)
      .then((response) => {
        if (response.ok) return response.json();
        else throw new Error("Error: " + response.status);
      })
      .then((data) => {
        if (keyword) {
          setCourses(
            data.course.filter((course) =>
              course.category.toLowerCase().includes(keyword.toLowerCase())
            )
          );
        } else {
          setCourses(data.course);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setLoading(false);
      });
  }, [keyword]);

  return (
    <Flex className="carousel-container" direction="column" p="20px" m="auto">
  <Heading textAlign="center" mb="20px" fontSize="2xl" color="teal.600">
    {keyword ? `Kết quả cho "${keyword}"` : "Các khóa học nổi bật"}
  </Heading>

  {loading ? (
      <Flex justifyContent="center" alignItems="center" height="200px">
        <Spinner size="xl" color="teal.500" />
      </Flex>
    ) : courses.length > 0 ? (
      <Slider {...settings}>
        {courses.map((el) => (
          <Box
            key={el._id}
            transform="scale(1)"
            transition="transform 0.3s ease-in-out"
            _hover={{ transform: "scale(1.05)" }}
          >
            <Card {...el} />
          </Box>
        ))}
      </Slider>
    ) : (
      <Text textAlign="center" color="gray.500" fontSize="lg">
        Không tìm thấy khóa học nào phù hợp với từ khóa "{keyword}".
      </Text>
    )}
  </Flex>
  );
};

export default LandingPageCarousel;
