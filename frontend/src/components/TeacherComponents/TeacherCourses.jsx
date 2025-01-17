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
import { Link, useNavigate } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { AddIcon, EditIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import convertDateFormat, {
  deleteProduct,
  getProduct,
} from "../../Redux/TeacherReducer/action";
// } from "../../Redux/AdminReducer/action";
import Pagination from "../Adminitems/Pagination";
import TeacherNavTop from "./TeacherNavTop";
import Navbar from "../UserComponents/UserNavbar";

export default function TeacherCourses() {
  const store = useSelector((store) => store.TeacherReducer.data);
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("");
  const limit = 4;
  const tableSize = useBreakpointValue({ base: "sm", sm: "md", md: "lg" });
  const courseSize = useBreakpointValue({ base: "md", sm: "lg", md: "xl" });

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSelect = (e) => {
    const { value } = e.target;
    setOrder(value);
  };

  useEffect(() => {
    dispatch(getProduct(page, limit, search, order));
  }, [page, search, order, limit]);

  const handleDelete = (id, title) => {
    dispatch(deleteProduct(id));
    alert(`${title} is Deleted`);
  };

  const handlePageChange = (page) => {
    setPage(page);
  };

  const count = 4;

  const handlePageButton = (val) => {
    setPage((prev) => prev + val);
  };

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
                      <Td>{el.title}</Td>
                      <Td>{convertDateFormat(el.createdAt)}</Td>
                      <Td>{el.category}</Td>
                      <Td>{el.description}</Td>
                      <Td>{el.price}</Td>
                      <Td>{el.teacher}</Td>
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
}
