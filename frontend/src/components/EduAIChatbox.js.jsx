import { useState, useRef, useEffect, useCallback } from "react";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Input,
  Text,
  VStack,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { FaRobot } from "react-icons/fa";
import axios from "axios";

const EduAIChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=",
        {
          contents: [{ parts: [{ text: input }] }],
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const aiText =
        response.data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join(" ") ||
        "No response";

      const formattedText = aiText.replace(/\*/g, "").replace(/<br\s*\/?>/g, "\n");

      const aiMessage = { sender: "EduAI", text: formattedText };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("EduAI API Error:", error);
      setMessages((prev) => [...prev, { sender: "EduAI", text: "Error fetching response" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
     <Button
      onClick={openChat}
      leftIcon={<FaRobot />}
      colorScheme="orange"
      position="fixed"
      bottom="20px"
      right="20px"
      zIndex="popover"  // Đảm bảo hiển thị trên các phần tử khác
      boxShadow="2xl"
      borderRadius="full"
      p={4}
      fontSize="lg"
      fontWeight="bold"
      _hover={{ bg: "orange.500", transform: "scale(1.05)" }}
      _active={{ bg: "orange.600", transform: "scale(0.95)" }}
    >
      EduAI
    </Button>

    <Modal isOpen={isOpen} onClose={closeChat} size="xl">
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent borderRadius="lg" maxW="900px">
          <ModalHeader textAlign="center">EduAI Chatbox</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box
                height="500px"
                overflowY="auto"
                borderWidth="1px"
                p={4}
                borderRadius="md"
                bg="gray.50"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
              >
                {messages.length === 0 ? (
                  <Text fontSize="lg" fontWeight="bold" color="orange.500">
                    Please Ask EduAI
                  </Text>
                ) : (
                  <VStack align="stretch" width="100%">
                    {messages.map((msg, index) => (
                      <Text
                        key={index}
                        fontWeight={msg.sender === "EduAI" ? "bold" : "normal"}
                        color={msg.sender === "EduAI" ? "blue.600" : "black"}
                        whiteSpace="pre-line"
                      >
                        {msg.sender}: {msg.text}
                      </Text>
                    ))}
                    <div ref={messagesEndRef} />
                  </VStack>
                )}
              </Box>

              {loading && (
                <HStack>
                  <Spinner size="sm" />
                  <Text fontSize="sm">EduAI is thinking...</Text>
                </HStack>
              )}

              <Input
                placeholder={loading ? "Waiting for response..." : "Type a message..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                isDisabled={loading}
                borderRadius="md"
              />
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EduAIChatbox;
