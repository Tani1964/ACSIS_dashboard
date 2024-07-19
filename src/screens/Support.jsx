import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

const mockFAQs = [
  {
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page and following the instructions.",
  },
  {
    question: "How do I contact support?",
    answer: "You can contact support by filling out the form on this page or by emailing support@example.com.",
  },
  {
    question: "Where can I find the user manual?",
    answer: "The user manual is available in the 'Help' section of our website.",
  },
];

const Support = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    console.log("Support request submitted:", formData);
    setFormData({ name: "", email: "", message: "" });
    onClose();
  };

  return (
    <Box className="px-8 py-4">
      <Heading>Support</Heading>
      <Text color={"grey"}>Submit your support requests or browse our FAQs for quick answers.</Text>

      <Flex mt={5} justifyContent="space-between">
        <Button colorScheme="green" size="md" onClick={onOpen}>
          Submit Support Request
        </Button>
      </Flex>

      <Box mt={5}>
        <Heading size="md" mb={4}>Frequently Asked Questions</Heading>
        <Accordion allowToggle>
          {mockFAQs.map((faq, index) => (
            <AccordionItem key={index}>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  {faq.question}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                {faq.answer}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit Support Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name</FormLabel>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Message</FormLabel>
              <Textarea name="message" value={formData.message} onChange={handleChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="green" onClick={handleSubmit}>Submit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Support;
