import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  RadioGroup,
  Radio,
  Select,
  Text,
  useDisclosure,
  VStack,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import Navbar from "./navbar";

const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState("");
  const [lang_id, setLangId] = useState("");
  const [langName, setLangName] = useState("");
  const [languages, setLanguages] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showQuiz, setShowQuiz] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [responseDetails, setResponseDetails] = useState({});

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const response = await axios.get(`http://localhost:5000/api/language`, config);
        setLanguages(response.data);
      } catch (error) {
        console.error("Error fetching language data:", error);
      }
    };
    fetchLanguages();
  }, []);

  const getQuestions = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const response = await axios.post(
        "http://localhost:5000/quiz/questions",
        {
          language_id: lang_id,
          category: category,
        },
        config
      );
      setQuestions(response.data);

      const initialAnswers = {};
      response.data.forEach((q) => (initialAnswers[q._id] = "-1"));
      setSelectedAnswers(initialAnswers);
      setShowQuiz(true);
    } catch (err) {
      console.error("Error occurred in fetching questions:", err);
    }
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        uid: userInfo._id,
        pairs: Object.entries(selectedAnswers).map(([objectId, givenAnswer]) => ({
          objectId,
          givenAnswer,
        })),
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const response = await axios.post("http://localhost:5000/quiz/answers", dataToSend, config);
      setResponseDetails(response.data);
      onOpen();
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Error submitting test. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      {/* Result Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
        <ModalOverlay />
        <ModalContent textAlign="center" maxW={{ base: "95%", md: "lg", lg: "2xl" }}>
          <ModalHeader fontSize="3xl">Quiz Result</ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize="xl">
            <Text>Total Questions: {responseDetails.totalMarks}</Text>
            <Text>Attempted: {responseDetails.attempted}</Text>
            <Text>Unattempted: {responseDetails.unAttempted}</Text>
            <Text>Correctly Answered: {responseDetails.corrected}</Text>
            <Text>Incorrectly Answered: {responseDetails.incorrected}</Text>
            <Text>Your Score: {responseDetails.score}</Text>
            <Text>Accuracy: {responseDetails.accuracy}%</Text>
            <Text>Negative Marking: -0.5 per wrong answer</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Quiz Section */}
      <Container maxW="xl" py={8} px={4} mt={12}>
        <Text
          textAlign="center"
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="bold"
          color="white"
          mt={3}
          mb={5}
        >
          Fun Quiz
        </Text>

        {/* Language Selection */}
        <Select
          placeholder="Select Language"
          value={lang_id}
          onChange={(e) => {
            const selectedId = e.target.value;
            setLangId(selectedId);
            const lang = languages.find((l) => l._id === selectedId);
            setLangName(lang?.language || "");
            setShowQuiz(false);
          }}
          background="white"
          mb={5}
          fontSize="xl"
        >
          {languages.map((language) => (
            <option key={language._id} value={language._id}>
              {language.language.toUpperCase()}
            </option>
          ))}
        </Select>

        {/* Difficulty Selection */}
        <Select
          placeholder="Select Difficulty"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setShowQuiz(false);
          }}
          background="white"
          mb={5}
          fontSize="xl"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </Select>

        {/* Take Test Button */}
        {lang_id && category && !showQuiz && (
          <Center>
            <Button colorScheme="teal" onClick={getQuestions}>
              Take Test
            </Button>
          </Center>
        )}

        {/* Quiz Questions */}
        {showQuiz && (
          <VStack spacing={4}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              color="white"
              textAlign="center"
            >
              Quiz: {langName.toUpperCase()} (Level: {category.toUpperCase()})
            </Text>
            <form>
              {questions.map((question, ind) => (
                <Box
                  key={question._id}
                  borderWidth="1px"
                  p={4}
                  borderRadius="md"
                  background="white"
                  fontSize="xl"
                  mb={5}
                >
                  <Text mb={5}>
                    {ind + 1}. {question.desc}
                  </Text>

                  {question.options && question.options.length > 0 ? (
                    <RadioGroup
                      value={selectedAnswers[question._id] || "-1"}
                      onChange={(value) => {
                        setSelectedAnswers({
                          ...selectedAnswers,
                          [question._id]: value,
                        });
                      }}
                      display="flex"
                      flexDirection="column"
                    >
                      {question.options.map((option, index) => (
                        <Radio key={index} value={index.toString()} mb={5}>
                          {option}
                        </Radio>
                      ))}
                    </RadioGroup>
                  ) : (
                    <Text fontStyle="italic" color="gray.500">
                      No options available for this question.
                    </Text>
                  )}
                </Box>
              ))}
              <Center>
                <Button colorScheme="blue" mt={4} onClick={handleSubmit}>
                  Submit Test
                </Button>
              </Center>
            </form>
          </VStack>
        )}

        {!lang_id || !category ? (
          <Text mt={5} fontSize="xl" color="white" textAlign="center">
            Please select a language and difficulty level to start.
          </Text>
        ) : null}
      </Container>
    </>
  );
};

export default TestPage;





