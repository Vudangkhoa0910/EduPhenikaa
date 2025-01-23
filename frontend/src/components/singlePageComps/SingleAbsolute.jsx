// import { Box, Image, Text } from "@chakra-ui/react";
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// const SingleAbsolute = ({ props }) => {
//   const [page, setPage] = useState("left");
//   const [random, setRandom] = useState(0);
//   const { onOpen, price, img } = props;
//   const { isOpen, onOpen: openDialog, onClose } = useDisclosure();

//   function handlePayment() {
//     onOpen();
//   }
//   useEffect(() => {
//     setRandom((Math.random() * 20).toFixed());
//   }, []);

//   // Xác định giá hiển thị
//   const displayPrice = page === "left" ? price : (price * 1.2).toFixed(2);
//   const originalPrice = ((displayPrice * (+random + 100)) / 100).toFixed(2);

//   return (
//     <div className="xl:border xl:border-gray-300 text-white xl:text-black xl:max-w-[280px] xl:shadow-lg shadow-neutral-800 xl:bg-white rounded-lg overflow-hidden">
//       <div>
//         <Image src={img} className="w-full" alt="Course Thumbnail" />
//       </div>

//       <div className="flex justify-around font-semibold text-sm h-[48px] items-center border-b border-gray-300">
//         <div
//           onClick={() => setPage("left")}
//           className={`cursor-pointer text-center w-full py-2 ${
//             page === "left" ? "border-b-4 border-blue-500 text-blue-500" : ""
//           }`}
//         >
//           Personal
//         </div>
//         <div
//           onClick={() => setPage("right")}
//           className={`cursor-pointer text-center w-full py-2 ${
//             page === "right" ? "border-b-4 border-blue-500 text-blue-500" : ""
//           }`}
//         >
//           Teams
//         </div>
//       </div>

//       <div className="px-6 py-4">
//         <h3 className="font-serif font-bold text-lg mb-2 max-w-[250px]">
//           {page === "left"
//             ? "Subscribe to SRM's top courses"
//             : "Teams Plan for Businesses"}
//         </h3>
//         <p className="text-xs mb-4">
//           {page === "left"
//             ? "Get this course, plus 8,000+ of our top-rated courses with Personal Plan"
//             : "Empower your team with unlimited access to 8,000+ courses"}
//           <a href="#" className="underline text-blue-600 font-bold">
//             Learn more
//           </a>
//         </p>

//         <button
//           className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 font-semibold rounded-md mb-3"
//           onClick={handlePayment}
//         >
//           {page === "left" ? "Start subscription" : "Get Team Plan"}
//         </button>

//         {/* <div className="w-full justify-center items-center flex flex-col space-y-[8px] text-xs text-gray-500 mb-4">
//           <p>Starting at ₹750 per month</p>
//           <p>Cancel anytime</p>
//         </div> */}

//         {/* <div className="flex items-center justify-center my-3">
//           <div className="h-[1px] bg-gray-300 w-full"></div>
//           <p className="text-xs mx-2 text-gray-400">or</p>
//           <div className="h-[1px] bg-gray-300 w-full"></div>
//         </div> */}

//         <div className="flex space-x-2 place-items-baseline mb-2">
//           <p className="font-bold text-lg">${displayPrice}</p>
//           <p className="line-through text-xs text-gray-400">${originalPrice}</p>
//           <p className="text-xs text-green-600">{random}% off</p>
//         </div>

//         {/* <div className="flex text-red-600 items-baseline space-x-1 my-2 text-xs font-bold">

//           <p>52 minutes</p>
//           <p>left at this price!</p>
//         </div> */}

//         <Box className="my-2">
//           <Text>{/* Thêm nội dung tùy chỉnh tại đây */}</Text>
//         </Box>

//         <button
//           onClick={handlePayment}
//           className="border-2 border-blue-600 text-blue-600 w-full py-2 text-sm font-bold rounded-md hover:bg-blue-50"
//         >
//           {page === "left" ? "Buy this course" : "Contact Sales"}
//         </button>

//         {/* <div className="items-center text-xs space-y-1 w-full justify-center flex flex-col py-2 text-gray-500">
//           <p>30-Day Money-Back Guarantee</p>
//           <p>Full Lifetime Access</p>
//         </div>

//         <div className="flex justify-around text-xs font-bold text-blue-600 underline underline-offset-2 pb-7">
//           <div>
//             <Link to="#">Share</Link>
//           </div>
//           <div>
//             <Link to="#">Gift this course</Link>
//           </div>
//           <div>
//             <Link to="#">Apply Coupon</Link>
//           </div>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// export default SingleAbsolute;

import {
  Box,
  Image,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDisclosure } from "@chakra-ui/react";
import sectionImage from "../../asset/pay.svg";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const SingleAbsolute = ({ props }) => {
  const [page, setPage] = useState("left");
  const [random, setRandom] = useState(0);
  const { price, img } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [canNavigate, setCanNavigate] = useState(false); // Trạng thái để kiểm tra xem có thể điều hướng không
  const [successDialogVisible, setSuccessDialogVisible] = useState(false); // Trạng thái để hiển thị dialog thành công
  const [isCourseBought, setIsCourseBought] = useState(false); // Trạng thái để kiểm tra xem khóa học đã được mua chưa
  const navigate = useNavigate();
  const courseName =
    page === "left" ? "Personal Plan Course" : "Teams Plan Course";

  const [res, setRes] = useState({});
  const { id } = useParams(); // Lấy id từ URL
  const userStore = useSelector((store) => store.UserReducer);
  const vdo_url = `http://localhost:5001/videos/courseVideos/${id}`;

  const getSinglePageData = () => {
    const token = userStore?.token;

    fetch(vdo_url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setRes(data);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (id) getSinglePageData();
  }, [id]);

  useEffect(() => {
    setRandom((Math.random() * 20).toFixed());
  }, []);

  const displayPrice = page === "left" ? price : (price * 1.2).toFixed(2);
  const originalPrice = ((displayPrice * (+random + 100)) / 100).toFixed(2);

  const handlePaymentMethodSelect = (method) => {
    setPaymentMethod(method);
  };

  const handlePayment = () => {
    onClose();
    setIsPaymentSuccess(true);

    // Sau khi thanh toán thành công, cho phép điều hướng
    setCanNavigate(true);

    // Đánh dấu khóa học đã được mua
    setIsCourseBought(true);

    // Hiển thị dialog thông báo thành công trong 10 giây
    setSuccessDialogVisible(true);
    setTimeout(() => {
      setSuccessDialogVisible(false); // Ẩn dialog sau 10 giây
    }, 1000);
  };

  // Hàm điều hướng khi nhấn nút
  const handleButtonClick = () => {
    if (canNavigate) {
      const firstVideoLink =
        res?.course?.videos?.length > 0 ? res?.course?.videos[0]?.link : null;
      // Nếu thanh toán thành công và có thể điều hướng, điều hướng đến trang video
      navigate(
        `/video-detail/?courseId=${res?.course?._id}&url=${encodeURIComponent(
          // "https://www.youtube.com/embed/0qhZJsVX7rg"
          firstVideoLink
        )}`
      );
    } else {
      // Nếu chưa thanh toán thành công, mở modal thanh toán
      onOpen();
    }
  };

  return (
    <div className="xl:border xl:border-gray-300 text-white xl:text-black xl:max-w-[280px] xl:shadow-lg shadow-neutral-800 xl:bg-white rounded-lg overflow-hidden">
      <div>
        <Image src={img} className="w-full" alt="Course Thumbnail" />
      </div>

      <div className="flex justify-around font-semibold text-sm h-[48px] items-center border-b border-gray-300">
        <div
          onClick={() => setPage("left")}
          className={`cursor-pointer text-center w-full py-2 ${
            page === "left" ? "border-b-4 border-blue-500 text-blue-500" : ""
          }`}
        >
          Personal
        </div>
        <div
          onClick={() => setPage("right")}
          className={`cursor-pointer text-center w-full py-2 ${
            page === "right" ? "border-b-4 border-blue-500 text-blue-500" : ""
          }`}
        >
          Teams
        </div>
      </div>

      <div className="px-6 py-4">
        <h3 className="font-serif font-bold text-lg mb-2 max-w-[250px]">
          {page === "left"
            ? "Subscribe to SRM's top courses"
            : "Teams Plan for Businesses"}
        </h3>
        <p className="text-xs mb-4">
          {page === "left"
            ? "Get this course, plus 8,000+ of our top-rated courses with Personal Plan"
            : "Empower your team with unlimited access to 8,000+ courses"}
          <a href="#" className="underline text-blue-600 font-bold">
            Learn more
          </a>
        </p>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 font-semibold rounded-md mb-3"
          onClick={handleButtonClick} // Điều chỉnh sự kiện onClick
        >
          {page === "left" ? "Start subscription" : "Get Team Plan"}
        </button>
        {
          // Ẩn nút "Buy this course" khi khóa học đã được mua
          !isCourseBought && (
            <div className="flex space-x-2 place-items-baseline mb-2">
              <p className="font-bold text-lg">${displayPrice}</p>
              <p className="line-through text-xs text-gray-400">
                ${originalPrice}
              </p>
              <p className="text-xs text-green-600">{random}% off</p>
            </div>
          )
        }

        {
          // Ẩn nút "Buy this course" khi khóa học đã được mua
          !isCourseBought && (
            <button
              onClick={onOpen}
              className="border-2 border-blue-600 text-blue-600 w-full py-2 text-sm font-bold rounded-md hover:bg-blue-50"
            >
              {page === "left" ? "Buy this course" : "Contact Sales"}
            </button>
          )
        }
      </div>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{res?.course?.title}</ModalHeader>
          <ModalBody>
            <Text fontSize="lg" fontWeight="bold">
              {courseName}
            </Text>
            <Text fontSize="xl" color="blue.600" fontWeight="bold">
              ${displayPrice}
            </Text>

            <Text mt={4} fontWeight="bold">
              Choose Payment Method:
            </Text>
            <Box display="flex" justifyContent="space-around" mt={2}>
              <Image
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square-1024x1024.png"
                alt="Momo"
                boxSize="50px"
                onClick={() => handlePaymentMethodSelect("momo")}
              />
              <Image
                src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg"
                alt="VNPay"
                boxSize="50px"
                onClick={() => handlePaymentMethodSelect("vnpay")}
              />
              <Image
                src="https://th.bing.com/th/id/OIP.wBKSzdf1HTUgx1Ax_EecKwHaHa?rs=1&pid=ImgDetMain"
                alt="PayPal"
                boxSize="50px"
                onClick={() => handlePaymentMethodSelect("paypal")}
              />
            </Box>

            {paymentMethod === "momo" && (
              <Box mt={4} textAlign="center">
                <Image src={sectionImage} alt="QR Code" />
                <Text fontSize="sm">
                  Scan the QR code to complete your payment.
                </Text>
              </Box>
            )}
            {paymentMethod === "vnpay" && (
              <Box mt={4} textAlign="center">
                <Image src={sectionImage} alt="QR Code" />
                <Text fontSize="sm">
                  Scan the QR code to complete your payment.
                </Text>
              </Box>
            )}
            {paymentMethod === "paypal" && (
              <Box mt={4} textAlign="center">
                <Image src={sectionImage} alt="QR Code" />
                <Text fontSize="sm">
                  Scan the QR code to complete your payment.
                </Text>
              </Box>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handlePayment}>
              Pay Now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {successDialogVisible && (
        <Box
          position="fixed"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          textAlign="center"
          p={5}
          borderRadius="md"
          bg="green.200"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          zIndex="1000"
        >
          <Text fontSize="lg" fontWeight="bold" color="green.800">
            Payment Successful
          </Text>
          <Image
            src="https://www.nhahangquangon.com/wp-content/uploads/2020/10/icon-thanh-cong.png"
            alt="Success Icon"
            boxSize="80px"
            mt={2}
          />
        </Box>
      )}
    </div>
  );
};

export default SingleAbsolute;
