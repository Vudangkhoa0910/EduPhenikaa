import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Image,
  Text,
  Button,
  Flex,
  Input,
  useToast,
  Heading,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner
} from "@chakra-ui/react";
import AdminNavTop from "../AdminNavTop";
import axios from 'axios';

const BASE_URL = "http://localhost:5001";

const Discount = () => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [discountValues, setDiscountValues] = useState({});
  const toast = useToast();

  // Fetch all courses when component mounts
  useEffect(() => {
    fetchCourses();
  }, []);

  // Initialize discount values after courses are loaded
  useEffect(() => {
    const initialValues = {};
    courses.forEach(course => {
      initialValues[course._id] = course.discount || 0;
    });
    setDiscountValues(initialValues);
  }, [courses]);

  // Fetch all courses
  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await axios.get(`${BASE_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.course) {
        setCourses(response.data.course);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch courses",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle discount value change
  const handleDiscountChange = (courseId, value) => {
    setDiscountValues({
      ...discountValues,
      [courseId]: value
    });
  };

  // Update discount for a course
  const handleDiscountUpdate = async (courseId) => {
    const discountValue = discountValues[courseId];
    
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await axios.patch(
        `${BASE_URL}/courses/update/${courseId}`, 
        { discount: discountValue },
        {
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 200) {
        // Update local state
        setCourses(courses.map(course => 
          course._id === courseId ? {...course, discount: discountValue} : course
        ));
        
        toast({
          title: "Success",
          description: "Discount updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating discount:", error);
      toast({
        title: "Error",
        description: "Failed to update discount",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Remove discount and auto-reload data
  const handleRemoveDiscount = async (courseId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.token;
      const response = await axios.patch(
        `${BASE_URL}/courses/update/${courseId}`, 
        { discount: 0 },
        {
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 200) {
        // Update local state immediately
        setCourses(prevCourses => prevCourses.map(course => 
          course._id === courseId ? {...course, discount: 0} : course
        ));
        
        // Reset the discount value in the state
        setDiscountValues(prev => ({
          ...prev,
          [courseId]: 0
        }));
        
        // Show success message
        toast({
          title: "Success",
          description: "Discount removed successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        
        // Reload all courses data
        fetchCourses().catch(err => {
          console.error("Error reloading courses after discount removal:", err);
        });
      }
    } catch (error) {
      console.error("Error removing discount:", error);
      toast({
        title: "Error",
        description: "Failed to remove discount",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Filter courses based on search term
  const filteredCourses = courses.filter(course => 
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box h={"auto"} minH="99vh" w="94%" mt='80px' pb={8}>
      <AdminNavTop />
      
      {/* Search and header */}
      <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={2}>
        <Heading size="lg">Course Discounts</Heading>
        <Flex gap={4}>
          <Input 
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            width="300px"
          />
          <Button
            colorScheme="blue"
            onClick={fetchCourses}
            isLoading={loading}
          >
            Refresh Data
          </Button>
        </Flex>
      </Flex>
      
      {loading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" color="blue.500" />
        </Flex>
      ) : (
        <>
          {/* Courses grid */}
          <Grid 
            templateColumns={{
              xl: "repeat(3,1fr)",
              lg: "repeat(2,1fr)",
              base: "repeat(1,1fr)",
            }}
            gap={10}
          >
            {filteredCourses.map((course) => (
              <Box 
                key={course._id}
                boxShadow="md"
                borderRadius="lg"
                overflow="hidden"
                bg="white"
                transition="transform 0.3s"
                _hover={{ transform: "translateY(-5px)" }}
              >
                <Image
                  src={course.img || "https://via.placeholder.com/300x150?text=No+Image"}
                  alt={course.title}
                  height="150px"
                  width="100%"
                  objectFit="cover"
                />
                
                <Box p={5}>
                  <Text fontWeight="bold" fontSize="xl" mb={2}>
                    {course.title}
                  </Text>
                  
                  <Text fontSize="md" mb={4} noOfLines={2}>
                    {course.description}
                  </Text>
                  
                  <Flex justify="space-between" align="center" mb={4}>
                    <Text fontSize="lg" fontWeight="semibold">
                      Original Price: ${course.price}
                    </Text>
                    
                    {course.discount > 0 && (
                      <Text fontSize="lg" fontWeight="bold" color="green.500">
                        Discounted: ${(course.price - (course.price * course.discount / 100)).toFixed(2)}
                      </Text>
                    )}
                  </Flex>
                  
                  <FormControl>
                    <FormLabel>Discount Percentage (%)</FormLabel>
                    <Flex>
                      <NumberInput 
                        min={0} 
                        max={100} 
                        value={discountValues[course._id] || 0}
                        onChange={(valueString) => {
                          const value = parseInt(valueString);
                          handleDiscountChange(course._id, value);
                        }}
                        flex="1"
                        mr={2}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      
                      <Button 
                        colorScheme="blue" 
                        onClick={() => handleDiscountUpdate(course._id)}
                        isDisabled={discountValues[course._id] === course.discount}
                      >
                        Apply
                      </Button>
                    </Flex>
                  </FormControl>
                  
                  {course.discount > 0 && (
                    <Button 
                      colorScheme="red" 
                      variant="outline" 
                      mt={4} 
                      width="full"
                      onClick={() => handleRemoveDiscount(course._id)}
                    >
                      Remove Discount
                    </Button>
                  )}
                </Box>
              </Box>
            ))}
          </Grid>
          
          {filteredCourses.length === 0 && (
            <Box textAlign="center" py={10}>
              <Text fontSize="lg" color="gray.500">
                No courses found. Try a different search term.
              </Text>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default Discount;
