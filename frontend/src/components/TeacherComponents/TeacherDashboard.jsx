import { Box, Grid, Select, Button, Text, Image, Flex } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../../Redux/TeacherReducer/action";

const AddTeacher = () => {
  const store = useSelector((store) => store.TeacherReducer.data);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState("");
  const limit = 6;

  const handleSelect = (e) => {
    setOrder(e.target.value);
  };

  useEffect(() => {
    dispatch(getProduct(page, limit, "", order));
  }, [page, order, limit]);

  const handlePageChange = (val) => {
    setPage((prev) => prev + val);
  };

  return (
    <Flex
      className="Nav"
      h="100vh"
      w="100%"
      px={4}
      gap={4}
      align="flex-start"
      mt="100"
    >
      {/* Thanh thông tin demo */}
      <Box
        w={{ base: "90%", md: "25%" }} // Chiếm 90% trên mobile, 25% trên desktop
        h="90vh" // Chiều cao 1/2 màn hình
        p={6} // Padding rộng hơn
        boxShadow="2xl" // Bóng đổ đẹp hơn
        borderRadius="xl" // Bo góc mềm mại
        bg="white"
        overflow="hidden"
        position="sticky" // Cố định vị trí khi cuộn
        top="20px" // Cách trên 20px
        left="0" // Đặt sát lề trái
        ml={4} // Thêm khoảng cách lề trái để không quá sát mép
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
      >
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          Thông tin demo
        </Text>
        <Box w="100%" maxH="80%" overflowY="auto">
          {[...Array(10)].map((_, i) => (
            <Text
              key={i}
              fontSize="md"
              mb={2}
              borderBottom="1px solid #ddd"
              p={2}
            >
              Dòng {i + 1}: Nội dung demo
            </Text>
          ))}
        </Box>
      </Box>

      {/* Nội dung chính */}
      <Box w={{ base: "100%", md: "75%" }}>
        <Box display="flex" justifyContent="center" gap={4} mb={6}>
          <Select w="auto" minW="300px" onChange={handleSelect}>
            <option value="asc">Price Sort in Ascending Order</option>
            <option value="desc">Price Sort in Descending Order</option>
          </Select>
        </Box>

        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={6}
        >
          {store?.length > 0 ? (
            store.map((el, i) => (
              <Box
                key={i}
                borderRadius="lg"
                boxShadow="md"
                overflow="hidden"
                bg="white"
              >
                <Image
                  display="block"
                  src={
                    el.img ||
                    "https://cdn.dribbble.com/users/1693462/screenshots/3504905/media/6d5a0df598037bf7a872f1f8aef118b8.gif"
                  }
                  alt={el.title || "No Image"}
                  w="100%"
                  h="200px"
                  objectFit="cover"
                />
                <Box p={4}>
                  <Text fontSize="xl" fontWeight="bold" mb={2}>
                    {el.title || "N/A"}
                  </Text>
                  <Text fontSize="md" mb={2}>
                    {el.description || "N/A"}
                  </Text>
                  <Text fontSize="lg" fontWeight="bold">
                    ${el.price || "N/A"}
                  </Text>
                </Box>
              </Box>
            ))
          ) : (
            <Text>No data available</Text>
          )}
        </Grid>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={4}
          mt={6}
        >
          <Button disabled={page <= 1} onClick={() => handlePageChange(-1)}>
            Prev
          </Button>
          <Button
            disabled={store?.length < limit}
            onClick={() => handlePageChange(1)}
          >
            Next
          </Button>
        </Box>
      </Box>
    </Flex>
  );
};

export default AddTeacher;
