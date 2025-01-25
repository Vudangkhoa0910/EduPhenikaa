import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Grid,
  IconButton,
  Select,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import convertDateFormat, {
  deleteProduct,
  getCourse, // Using getCourse instead
} from "../../Redux/TeacherReducer/action";
import Pagination from "../Adminitems/Pagination";

export default function TeacherCourses() {
  const store = useSelector((store) => store.TeacherReducer.data);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const limit = 4;

  const tableSize = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });

  // Lấy User ID từ UserReducer - Đặt ở ngoài useEffect
  const userId = useSelector((store) => store.UserReducer.userId) || "Không tìm thấy ID";

  useEffect(() => {
    // Dispatch getCourse with userId to filter courses (vẫn gọi action getCourse để lấy data từ backend)
    dispatch(getCourse(page, limit, search, order, userId));
  }, [dispatch, page, search, order, userId]); // Added userId to dependency array for re-fetch on userId change if needed

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      dispatch(deleteProduct(id));
      alert(`${title} has been deleted.`);
    }
  };

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

  // Lọc dữ liệu store để chỉ giữ lại các course có teacherId trùng với userId
  const filteredCourses = store?.filter(
    (course) => {
      // Check if course.teacherId exists and has a $oid property, or compare directly if it's a string
      const courseTeacherId = course.teacherId?.$oid || course.teacherId; // Handle both objectId and string cases
      return courseTeacherId === userId;
    }
  ) || []; // Nếu store là null hoặc undefined, filteredCourses sẽ là mảng rỗng

  return (
    <Grid className="Nav" h="100vh" w="100%" placeItems="center" px={4}>
      <Box w="100%" maxW="1200px" mt="90px" p={4}>
        <Box
          p={4}
          borderRadius="md"
          bg="white"
          boxShadow="lg"
          mb={2}
          textAlign="center"
        >
          <Text fontSize="2xl" fontWeight="bold" color="blue.500">
            Manage Teacher Courses
          </Text>
        </Box>

        <Flex justifyContent="space-between" mb={4} wrap="wrap">
          <Select
            w={{ base: "full", md: "auto" }}
            placeholder="Sort by Price"
            onChange={(e) => setOrder(e.target.value)}
            bg="gray.50"
            borderColor="blue.400"
            _hover={{ borderColor: "blue.600" }}
          >
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </Select>
          <Link to="/Teacher/addCourse">
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              variant="solid"
              size="md"
            >
              Add New Course
            </Button>
          </Link>
        </Flex>

        <Box
          w="100%"
          overflowX="auto"
          borderRadius="lg"
          border="1px solid #e2e8f0"
          p={4}
          bg="gray.50"
          boxShadow="md"
        >
          <Table variant="simple" size={tableSize}>
            <Thead bg="blue.100">
              <Tr>
                <Th>Title</Th>
                <Th>Date</Th>
                <Th>Category</Th>
                <Th>Description</Th>
                <Th>Price</Th>
                <Th>Teacher</Th>
                {/* Xóa cột Teacher ID */}
                {/* <Th>Teacher ID</Th> */}
                <Th>Actions</Th>
              </Tr>
            </Thead>
            {filteredCourses?.length > 0 ? ( // Sử dụng filteredCourses thay vì store
              filteredCourses.map((el, i) => { // Map qua filteredCourses
                return (
                  <Tbody key={i}>
                    <Tr _hover={{ bg: "gray.100" }}>
                      <Td>{el.title}</Td>
                      <Td>{convertDateFormat(el.createdAt)}</Td>
                      <Td>{el.category}</Td>
                      <Td>{el.description}</Td>
                      <Td>{`$${el.price}`}</Td>
                      <Td>{el.teacher}</Td>
                      {/* Xóa hiển thị Teacher ID */}
                      {/* <Td>
                        {el.teacherId?.$oid || // Thử truy cập $oid nếu là object ID
                         el.teacherId?.toString() || // Thử convert sang string nếu là object khác
                         el.teacherId || // Thử hiển thị trực tiếp nếu là string hoặc number
                         "N/A" // Fallback nếu không có giá trị hợp lệ
                        }
                      </Td> */}
                      <Td>
                        <Flex gap={2}>
                          <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDelete(el._id, el.title)}
                          >
                            Delete
                          </Button>
                          <Link to={`/Teacher/edit/${el._id}`}>
                            <ButtonGroup size="sm" isAttached>
                              <Button colorScheme="blue">Edit</Button>
                              <IconButton
                                colorScheme="blue"
                                aria-label="Edit course"
                                icon={<EditIcon />}
                              />
                            </ButtonGroup>
                          </Link>
                        </Flex>
                      </Td>
                    </Tr>
                  </Tbody>
                );
              })
            ) : (
              <Tbody>
                <Tr>
                  <Td colSpan="7" textAlign="center" color="gray.500"> {/* Đã sửa colSpan thành 7 */}
                    No data available for this teacher.
                  </Td>
                </Tr>
              </Tbody>
            )}
          </Table>
        </Box>

        <Flex justifyContent="center" alignItems="center" mt={6} gap={4}>
          <Button
            colorScheme="blue"
            onClick={() => handlePageButton(-1)}
            disabled={page <= 1}
          >
            Prev
          </Button>
          <Pagination
            totalCount={10}
            current_page={page}
            handlePageChange={setPage}
          />
          <Button
            colorScheme="blue"
            onClick={() => handlePageButton(1)}
            disabled={page >= 10}
          >
            Next
          </Button>
        </Flex>
      </Box>
    </Grid>
  );
}