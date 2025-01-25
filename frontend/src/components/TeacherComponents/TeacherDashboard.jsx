import {
  Box,
  Grid,
  Button,
  Text,
  Image,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ScrollView,
  VStack,
  Heading,
  Stack,
  Divider,
  useColorMode, // Đảm bảo import useColorMode
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCourse, getUser } from "../../Redux/TeacherReducer/action";
import { AiOutlineUser, AiOutlineMessage, AiOutlineBell } from "react-icons/ai";
import { IoPeopleSharp } from "react-icons/io5";
import { TiThLargeOutline } from "react-icons/ti";
import {
  BsFillSunFill,
  BsFillMoonStarsFill,
  BsStar,
  BsStarFill,
  BsStarHalf,
} from "react-icons/bs";
import convertDateFormat from "../../Redux/TeacherReducer/action";
import { formatDistanceToNow } from 'date-fns'; // Import formatDistanceToNow
import { vi } from 'date-fns/locale'; // Import Vietnamese locale

const TeacherDashboard = () => {
  const store = useSelector((store) => store.TeacherReducer.data);
  const userStore = useSelector((store) => store.TeacherReducer.users);
  const dispatch = useDispatch();
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [showContent, setShowContent] = useState("courses");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [messages, setMessages] = useState([
    { sender: "Student 1", message: "Hi.", timestamp: new Date(Date.now() - 300000) },
    { sender: "Student 2", message: "Hi", timestamp: new Date(Date.now() - 3600000) },
    { sender: "Student 3", message: "He", timestamp: new Date(Date.now() - 86400000) },
    { sender: "Student 1", message: "He", timestamp: new Date(Date.now() - 172800000) },
  ]);
  const [notifications, setNotifications] = useState([ // State for notifications
    { id: 1, message: "Nam Phan đẹp trai đã tham gia khoá học.", timestamp: new Date(Date.now() - 60000) },
    { id: 2, message: "Bài tập mới đã được giao cho khóa học Lập trình Web.", timestamp: new Date(Date.now() - 3600000) },
    { id: 3, message: "Có 3 học sinh đã hoàn thành bài kiểm tra cuối khóa.", timestamp: new Date(Date.now() - 86400000) },
  ]);

  const { colorMode, toggleColorMode } = useColorMode(); // Khởi tạo useColorMode

  const userId = useSelector((store) => store.UserReducer.userId) || "Không tìm thấy ID";

  useEffect(() => {
    dispatch(getCourse(1, 9999, "", "", userId));
  }, [dispatch, userId]);

  useEffect(() => {
    dispatch(getUser(1, 1000, "", ""));
  }, [dispatch]);

  useEffect(() => {
    if (userStore) {
      const studentsOnly = userStore.filter(user => user.role !== 'teacher' && user.role !== 'admin');
      setTotalStudents(studentsOnly.length);
      setFilteredUsers(studentsOnly);
    } else {
      setTotalStudents(0);
      setFilteredUsers([]);
    }
  }, [userStore]);

  useEffect(() => {
    if (store) {
      const coursesForTeacher = store.filter(
        (course) => {
          const courseTeacherId = course.teacherId?.$oid || course.teacherId;
          return courseTeacherId === userId;
        }
      );
      setFilteredCourses(coursesForTeacher);
      setTotalCourses(coursesForTeacher.length);
    } else {
      setFilteredCourses([]);
      setTotalCourses(0);
    }
  }, [store, userId]);

  useEffect(() => {
    let revenue = 0;
    if (filteredCourses) {
      revenue = filteredCourses.reduce((acc, el) => acc + (el.price || 0), 0);
    }
    setTotalRevenue(revenue);
  }, [filteredCourses]);

  const handleShowContent = (contentType) => {
    setShowContent(contentType);
  };

  return (
    <Grid
      className="Nav"
      h="100vh"
      w="100%"
      placeItems="center"
      px={4}
      templateColumns={{ base: "1fr", md: "200px 1fr" }}
      gap={6}
    >
      {/* Sidebar */}
      <Box
        mt="90px"
        borderRadius="50px"
        boxShadow="md"
        bg={colorMode === "light" ? "gray.300" : "gray.500"}
        h="70vh"
        w="90px"
      >
        <Box
          p={4}
          display="flex"
          flexDirection="column"
          gap={4}
          justifyContent="space-around"
          height="100%"
        >
          {/* Home Icon */}
          <Flex
            justifyContent="center"
            bg="transparent"
            onClick={() => handleShowContent("courses")}
            cursor="pointer"
          >
            <TiThLargeOutline size={24} color={colorMode === "light" ? "black" : "white"} />
          </Flex>

          {/* Student Icon */}
          <Flex
            justifyContent="center"
            bg="transparent"
            onClick={() => handleShowContent("students")}
            cursor="pointer"
          >
            <IoPeopleSharp size={24} color={colorMode === "light" ? "black" : "white"} />
          </Flex>

          {/* Message Icon */}
          <Flex
            justifyContent="center"
            bg="transparent"
            onClick={() => handleShowContent("messages")}
            cursor="pointer"
          >
            <AiOutlineMessage size={24} color={colorMode === "light" ? "black" : "white"} />
          </Flex>

          {/* Notification Icon */}
          <Flex
            justifyContent="center"
            bg="transparent"
            onClick={() => handleShowContent("notifications")}
            cursor="pointer"
          >
            <AiOutlineBell size={24} color={colorMode === "light" ? "black" : "white"} />
          </Flex>
        </Box>
      </Box>

      {/* Content Area */}
      <Box w="100%" mt="90px">
        {showContent === "courses" && (
          <>
            {/* Dashboard Cards */}
            <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={6}>
              {/* Total Students Card */}
              <Box
                bg={colorMode === "light" ? "white" : "gray.700"}
                borderRadius="lg"
                boxShadow="md"
                p={4}
              >
                <Text fontSize="xl" fontWeight="bold" color={colorMode === "light" ? "black" : "white"}>
                  Tổng Học Sinh
                </Text>
                <Text color={colorMode === "light" ? "black" : "white"}>{totalStudents}</Text>
              </Box>

              {/* Total Courses Card */}
              <Box
                bg={colorMode === "light" ? "white" : "gray.700"}
                borderRadius="lg"
                boxShadow="md"
                p={4}
              >
                <Text fontSize="xl" fontWeight="bold" color={colorMode === "light" ? "black" : "white"}>
                  Tổng Số Khóa Học
                </Text>
                <Text color={colorMode === "light" ? "black" : "white"}>{totalCourses}</Text>
              </Box>

              {/* Average Rating Card */}
              <Box
                bg={colorMode === "light" ? "white" : "gray.700"}
                borderRadius="lg"
                boxShadow="md"
                p={4}
              >
                <Text fontSize="xl" fontWeight="bold" color={colorMode === "light" ? "black" : "white"}>
                  Đánh Giá Trung Bình
                </Text>
                <Flex alignItems="center" mt={2}>
                  <BsStarFill color="gold" />
                  <BsStarFill color="gold" />
                  <BsStarFill color="gold" />
                  <BsStarFill color="gold" />
                  <BsStarHalf color="gold" />
                  <Text ml={2} color={colorMode === "light" ? "black" : "white"}>4.7</Text>
                </Flex>
              </Box>

              {/* Revenue Card */}
              <Box
                bg={colorMode === "light" ? "white" : "gray.700"}
                borderRadius="lg"
                boxShadow="md"
                p={4}
              >
                <Text fontSize="xl" fontWeight="bold" color={colorMode === "light" ? "black" : "white"}>
                  Doanh Thu
                </Text>
                <Text color={colorMode === "light" ? "black" : "white"}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalRevenue)}
                </Text>
              </Box>
            </Grid>

            {/* Courses Grid */}
            <Box
              w="100%"
              bg={colorMode === "light" ? "gray.100" : "gray.600"}
              borderRadius="lg"
              boxShadow="md"
              p={4}
            >
              <Box w="100%">
                <Grid
                  templateColumns={{
                    base: "repeat(2, 1fr)",
                    md: "repeat(4, 1fr)",
                    lg: "repeat(6, 1fr)",
                  }}
                  gap={6}
                >
                  {filteredCourses?.length > 0 ? (
                    filteredCourses.map((el, i) => (
                      <Box
                        key={i}
                        borderRadius="lg"
                        boxShadow="md"
                        overflow="hidden"
                        bg={colorMode === "light" ? "white" : "gray.700"}
                      >
                        <Image
                          display="block"
                          src={el.img || "https://via.placeholder.com/150"}
                          alt={el.title || "Course Image"}
                          w="100%"
                          h="100px"
                          objectFit="cover"
                        />
                        <Box p={4}>
                          <Text fontSize="xl" fontWeight="bold" mb={2} color={colorMode === "light" ? "black" : "white"}>
                            {el.title || "N/A"}
                          </Text>
                          <Text fontSize="md" mb={2} color={colorMode === "light" ? "black" : "white"}>
                            {el.description || "N/A"}
                          </Text>
                          <Text fontSize="lg" fontWeight="bold" color={colorMode === "light" ? "black" : "white"}>
                            ${el.price || "N/A"}
                          </Text>
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Text color={colorMode === "light" ? "black" : "white"}>No data available for this teacher</Text>
                  )}
                </Grid>
              </Box>
            </Box>
          </>
        )}

        {showContent === "students" && (
          <Box
            w="100%"
            bg={colorMode === "light" ? "gray.100" : "gray.600"}
            borderRadius="lg"
            boxShadow="md"
            p={4}
            overflowX="auto"
          >
            <Text fontSize="xl" fontWeight="bold" mb={4} color={colorMode === "light" ? "black" : "white"}>Student List</Text>
            <Table variant="simple" colorScheme={colorMode === "light" ? "teal" : "gray"} size="sm">
              <Thead>
                <Tr>
                  <Th color={colorMode === "light" ? "black" : "white"}>Name</Th>
                  <Th color={colorMode === "light" ? "black" : "white"}>Email</Th>
                  <Th color={colorMode === "light" ? "black" : "white"}>Role</Th>
                  <Th color={colorMode === "light" ? "black" : "white"}>Joined Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers?.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <Tr key={index}>
                      <Td color={colorMode === "light" ? "black" : "white"}>{user.name || "N/A"}</Td>
                      <Td color={colorMode === "light" ? "black" : "white"}>{user.email || "N/A"}</Td>
                      <Td color={colorMode === "light" ? "black" : "white"}>{user.role || "N/A"}</Td>
                      <Td color={colorMode === "light" ? "black" : "white"}>{convertDateFormat(user.createdAt) || "N/A"}</Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={4} textAlign="center" color={colorMode === "light" ? "black" : "white"}>No students available</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </Box>
        )}

        {showContent === "messages" && (
          <Box
            w="100%"
            bg={colorMode === "light" ? "gray.100" : "gray.600"}
            borderRadius="lg"
            boxShadow="md"
            p={4}
          >
            <Heading size="md" mb={4} color={colorMode === "light" ? "black" : "white"}>Student Messages</Heading>
            <VStack spacing={4} align="stretch">
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <Box
                    key={index}
                    bg={colorMode === "light" ? "white" : "gray.700"}
                    borderRadius="md"
                    p={3}
                    boxShadow="sm"
                  >
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="bold" color={colorMode === "light" ? "blue.500" : "blue.300"}>{msg.sender}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {formatDistanceToNow(msg.timestamp, { addSuffix: true, locale: vi })}
                      </Text>
                    </Flex>
                    <Divider mb={2} />
                    <Text color={colorMode === "light" ? "black" : "white"}>{msg.message}</Text>
                  </Box>
                ))
              ) : (
                <Text color="gray.500">No messages yet.</Text>
              )}
            </VStack>
          </Box>
        )}

        {showContent === "notifications" && (
          <Box
            w="100%"
            bg={colorMode === "light" ? "gray.100" : "gray.600"}
            borderRadius="lg"
            boxShadow="md"
            p={4}
          >
            <Heading size="md" mb={4} color={colorMode === "light" ? "black" : "white"}>Thông báo</Heading>
            <VStack spacing={4} align="stretch">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <Box
                    key={notification.id}
                    bg={colorMode === "light" ? "white" : "gray.700"}
                    borderRadius="md"
                    p={3}
                    boxShadow="sm"
                  >
                    <Flex justify="space-between" align="center" mb={2}>
                      <Text fontWeight="bold" color={colorMode === "light" ? "green.500" : "green.300"}>Thông báo mới</Text>
                      <Text fontSize="sm" color="gray.500">
                        {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: vi })}
                      </Text>
                    </Flex>
                    <Divider mb={2} />
                    <Text color={colorMode === "light" ? "black" : "white"}>{notification.message}</Text>
                  </Box>
                ))
              ) : (
                <Text color="gray.500">Không có thông báo mới.</Text>
              )}
            </VStack>
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default TeacherDashboard;