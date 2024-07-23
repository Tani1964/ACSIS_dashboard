import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Th,
  Td,
  Tr,
  Heading,
  Text,
  Flex,
  Button,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  IconButton,
  Spinner,
  Center,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { axi } from "../context/AuthContext";

const Businesses = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const [business, setBusiness] = useState({
    businessName: "",
    businessDescription: "",
    businessOwnerName: "",
    businessOwnerEmail: "",
    businessOwnerPhone: "",
    website: "",
    logo: "",
  });

  const getData = async () => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.get("/admin/get-businesses", { headers });
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
      toast({
        title: "Error",
        description: "Failed to fetch businesses.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBusiness((prevState) => ({ ...prevState, [name]: value }));
  };

  useEffect(() => {
    getData();
  }, [authState.token]);

  const addBusiness = async () => {
    setSubmitting(true);
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      console.log(business);
      const response = await axi.post("/admin/create-business", business, {
        headers,
      });
      console.log(response.data);
      getData();
      toast({
        title: "Success",
        description: "Business added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Reset form fields
      setBusiness({
        businessName: "",
        businessDescription: "",
        businessOwnerName: "",
        businessOwnerEmail: "",
        businessOwnerPhone: "",
        website: "",
        logo: "",
      });
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to add business:", error);
      toast({
        title: "Error",
        description: "Failed to add business.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box className="px-6 py-4">
      <Box>
        <Heading>Businesses</Heading>
        <Text color={"grey"}>An overview of all businesses</Text>
        <Flex className="flex flex-row justify-between mt-5 py-4">
          <Text color={"grey"} fontWeight={20}>
            {data.length} Businesses
          </Text>
          <Button colorScheme="green" size="md" gap={2} onClick={onOpen}>
            <AiOutlineUsergroupAdd />
            Add New Business
          </Button>
        </Flex>
      </Box>

      <Box overflowY="auto" maxHeight="55vh">
        <Table>
          <TableCaption>Businesses</TableCaption>
          <Thead
            position="sticky"
            top="0"
            bg="white"
            zIndex="1"
            roundedTop={10}
          >
            <Tr className="bg-[#F6F7FB] border border-[#EAECF0]">
              <Th>S/N</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Owner</Th>
              <Th>Owner Email</Th>
              <Th>Date Created</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((data, index) => (
              <Tr key={data.id}>
                <Td>{index + 1}</Td>
                <Td>{data.business_name}</Td>
                <Td>{data.business_description}</Td>
                <Td>{data.business_owner_name}</Td>
                <Td>{data.business_owner_email}</Td>
                <Td>{new Date(data.created_at).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Business</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Business Name:</FormLabel>
              <Input
                name="businessName"
                value={business.businessName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Business Description:</FormLabel>
              <Input
                name="businessDescription"
                value={business.businessDescription}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Business Owner Name:</FormLabel>
              <Input
                name="businessOwnerName"
                value={business.businessOwnerName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Business Owner Email:</FormLabel>
              <Input
                name="businessOwnerEmail"
                value={business.businessOwnerEmail}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Business Owner Phone</FormLabel>
              <Input
                type="tel"
                name="businessOwnerPhone"
                value={business.businessOwnerPhone}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Website</FormLabel>
              <Input
                type="url"
                name="website"
                value={business.website}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Logo</FormLabel>
              <Input
                name="logo"
                value={business.logo}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="green"
              onClick={addBusiness}
              isLoading={submitting}
            >
              Add Business
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Businesses;
