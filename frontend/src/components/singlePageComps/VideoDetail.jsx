import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Heading } from "@chakra-ui/react";

export default function VideoDetail() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const videoUrl = queryParams.get("url"); // Lấy URL từ query params

  return (
    <Box
      w="100%"
      p="4"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      {videoUrl ? (
        <iframe
          width="80%"
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
    </Box>
  );
}
