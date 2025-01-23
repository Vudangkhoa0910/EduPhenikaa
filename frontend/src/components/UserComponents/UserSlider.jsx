import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

const UserSlider = () => {
  const images = [
    "https://images.pexels.com/photos/5212653/pexels-photo-5212653.jpeg?cs=srgb&dl=pexels-max-fischer-5212653.jpg&fm=jpg",
    "https://www.mit.edu/files/images/201807/15656704711_00457bd2c9_b_1.jpg",
    "https://inup.iitkgp.ac.in/images/iit_kgp.jpg",
    "https://www.vedantu.com/seo/content-images/33e42c38-8332-4d51-9dcf-65a4f262b5da.png",
    "https://media.wired.com/photos/6365b7166776a0176c76e4de/master/w_2560%2Cc_limit/All-the-Free-Resources-You-Can-Find-at-Your-Library-Gear-GettyImages-1331816640.jpg",
    "https://images.seattleschild.com/wp-content/uploads/2021/09/Classy-Treehouse-w-logo-e1632341660272.png",
  ];

  const textOnImage = [
    "Group Studies",
    "Degree from Recognized Institutes",
    "Prestigious Institutions",
    "Online Classes",
    "Study Notes",
    "Successful Career",
  ];

  const indexDescription = [
    "SRM encourages collaborative group studies, creating a vibrant learning environment where students can connect and learn together. It offers a versatile platform for educators to share their knowledge, helping students excel academically.",
    "Secure your degree from renowned institutes with SRM's comprehensive education solutions. SRM provides access to globally recognized institutions, ensuring students receive quality education and gain valuable qualifications for their future careers.",
    "SRM unlocks access to prestigious educational institutions, elevating your academic journey to new heights. With SRM, you can explore a world of educational opportunities, expanding your knowledge and skills in various fields.",
    "Experience dynamic online classes on SRM's intuitive platform, tailored to modern learners' needs. SRM's user-friendly interface and interactive features make online learning engaging and effective, helping students succeed in today's digital age.",
    "Access meticulously crafted study notes on SRM to enhance your understanding and retention of course materials. SRM's comprehensive study resources empower students to excel in their studies and gain a deeper understanding of their subjects.",
    "SRM is your gateway to a successful career, offering the knowledge and skills needed for professional excellence. With SRM, you can prepare for a bright future and achieve your career goals through high-quality education and training.",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box w="100%" position="relative" overflow="hidden">
      {/* Image Section */}
      <Image
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        w="100%"
        h="600px"
        objectFit="cover"
      />
      {/* Text Overlay */}
      <Box
        position="absolute"
        bottom="0"
        left="0"
        w="100%"
        p={8}
        bg="rgba(0, 0, 0, 0.6)"
        color="white"
        textAlign="center"
      >
        <Heading
          size="2xl"
          mb={4}
          color="orange.400"
          textShadow="2px 2px 8px rgba(0, 0, 0, 0.8)"
        >
          {textOnImage[currentIndex]}
        </Heading>
        <Text
          fontSize="l"
          color="white"
          bg="rgba(255, 165, 0, 0.9)"
          p={3}
          borderRadius="md"
          boxShadow="0 0 20px rgba(255, 165, 0, 0.5), 0 0 40px rgba(0, 0, 139, 0.7)"
          fontWeight="medium"
          lineHeight="1"
        >
          {indexDescription[currentIndex]}
        </Text>
      </Box>
      {/* Navigation Buttons */}
      <Button
        position="absolute"
        top="50%"
        left="30px"
        transform="translateY(-50%)"
        bg="rgba(0, 0, 0, 0.5)"
        color="white"
        borderRadius="full"
        _hover={{ bg: "orange.500" }}
        _active={{ bg: "orange.600" }}
        onClick={handlePrevious}
      >
        <ArrowLeftIcon boxSize={8} />
      </Button>
      <Button
        position="absolute"
        top="50%"
        right="30px"
        transform="translateY(-50%)"
        bg="rgba(0, 0, 0, 0.5)"
        color="white"
        borderRadius="full"
        _hover={{ bg: "orange.500" }}
        _active={{ bg: "orange.600" }}
        onClick={handleNext}
      >
        <ArrowRightIcon boxSize={8} />
      </Button>
    </Box>
  );
};

export default UserSlider;
