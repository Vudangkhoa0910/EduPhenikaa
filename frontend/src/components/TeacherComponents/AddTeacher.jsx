import {
  Box,
  Button,
  Grid,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import convertDateFormat, {
  getProduct,
} from "../../Redux/TeacherReducer/action";
import Pagination from "../Adminitems/Pagination";

const AddTeacher = () => {
  const store = useSelector((store) => store.TeacherReducer.data);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const limit = 4;
  const tableSize = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });
  const courseSize = useBreakpointValue({ base: "md", sm: "lg", md: "xl" });

  const handleSelect = (e) => {
    const { value } = e.target;
    setOrder(value);
  };

  useEffect(() => {
    dispatch(getProduct(page, limit, search, order));
  }, [page, search, order, limit]);

  const navigate = useNavigate();

  const handleVideos = (id, title) => {
    navigate(`/Teacher/videos/add/${id}`, { state: { id, title } });
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

  const count = 4;

  return (
    <Grid className="Nav" h="100vh" w="100%" placeItems="center" px={4}>
      <Box w="100%" maxW="1200px" mt="90px">
        <Box className={`course ${courseSize}`}>
          <Grid
            templateColumns={{
              xl: "1fr",
              lg: "1fr",
              base: "1fr",
            }}
            gap={6}
            mb={6}
          >
            <Box display="flex" justifyContent="center" gap={4}>
              <Select w="auto" minW="300px" onChange={handleSelect}>
                <option value="asc">Price Sort in Ascending Order</option>
                <option value="desc">Price Sort in Descending Order</option>
              </Select>
              <Link to="/Teacher/addCourse">
                <Button bg="blue.500" color="white" _hover={{ bg: "blue.600" }}>
                  Create
                </Button>
              </Link>
            </Box>
          </Grid>

          <Box
            w="100%"
            overflowX="auto"
            borderRadius="lg"
            border="1px solid #e2e8f0"
            p={6}
            bg="white"
            boxShadow="sm"
          >
            <Table
              variant="striped"
              borderRadius="md"
              w="100%"
              size={tableSize}
            >
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Date</Th>
                  <Th>Category</Th>
                  <Th>Description</Th>
                  <Th>Price</Th>
                  <Th>Teacher</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              {store?.length > 0 ? (
                store.map((el, i) => (
                  <Tbody key={i}>
                    <Tr>
                      <Td>{el.title || "N/A"}</Td>
                      <Td>{convertDateFormat(el.createdAt) || "N/A"}</Td>
                      <Td>{el.category || "N/A"}</Td>
                      <Td>{el.description || "N/A"}</Td>
                      <Td>{el.price || "N/A"}</Td>
                      <Td>{el.teacher || "N/A"}</Td>
                      <Td>
                        <Button
                          onClick={() => handleVideos(el._id, el.title)}
                          bg="green.500"
                          color="white"
                          _hover={{ bg: "green.600" }}
                        >
                          Add Videos
                        </Button>
                      </Td>
                    </Tr>
                  </Tbody>
                ))
              ) : (
                <Tbody>
                  <Tr>
                    <Td colSpan="7" textAlign="center">
                      No data available
                    </Td>
                  </Tr>
                </Tbody>
              )}
            </Table>
          </Box>

          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            gap={4}
            mt={6}
          >
            <Button disabled={page <= 1} onClick={() => handlePageButton(-1)}>
              Prev
            </Button>
            <Pagination
              totalCount={count}
              current_page={page}
              handlePageChange={handlePageChange}
            />
            <Button
              disabled={page >= count}
              onClick={() => handlePageButton(1)}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default AddTeacher;
