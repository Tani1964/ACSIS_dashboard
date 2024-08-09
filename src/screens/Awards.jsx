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
  Select,
  Spinner,
  Center,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { useAuth } from "../context/AuthContext";
import { axi } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DeleteIcon } from "@chakra-ui/icons";

const Awards = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const { authState } = useAuth(); // Assuming authState is still needed for other purposes
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const [award, setAward] = useState({
    title: "",
    description: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAward((prevState) => ({ ...prevState, [name]: value }));
  };
  const getData = async () => {
    try {
      // Fetch from API
      const response = await axi.get("/award/get-awards");
      setData(response.data.awards);
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch awards:", error);
      toast({
        title: "Error",
        description: "Failed to fetch awards.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    

    getData();
  }, []);

  const addAward = async () => {
    setSubmitting(true);
    try {
      // Call API to add award
      const response = await axi.post("/award/create-award", award);
      console.log(response.data);
      setData((prevData) => [...prevData, response.data]);
      getData();
      toast({
        title: "Success",
        description: "Award added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      // Reset form fields
      setAward({
        title: "",
        description: "",
      });
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to add award:", error);
      toast({
        title: "Error",
        description: "Failed to add award.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const changeStatus = async (awardId, newStatus) => {
    try {
      // Call API to update status
      const response = await axi.post("/award/toggle-award-status", {
        awardId: awardId,
        status: newStatus,
      });
      console.log(response.data);
      setData((prevData) =>
        prevData.map((award) =>
          award.id === awardId ? { ...award, status: newStatus } : award
        )
      );
      toast({
        title: "Success",
        description: "Award status updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to update award status:", error);
      toast({
        title: "Error",
        description: "Failed to update award status.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const deleteAward = async (awardId) => {
    try {
      // Call API to delete the award
      await axi.delete(`/award/delete-award/${awardId}`);
      setData((prevData) => prevData.filter((award) => award.id !== awardId));
      toast({
        title: "Success",
        description: "Award deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to delete award:", error);
      toast({
        title: "Error",
        description: "Failed to delete award.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
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
        <Heading>Awards</Heading>
        <Text color={"grey"}>An overview of all awards</Text>
        <Flex className="flex flex-row justify-between mt-5 py-4">
          <Text color={"grey"} fontWeight={20}>
            {data.length} Awards
          </Text>
          <Button colorScheme="green" size="md" gap={2} onClick={onOpen}>
            <AiOutlineUsergroupAdd />
            Add New Award
          </Button>
        </Flex>
      </Box>

      <Box overflowY="auto" maxHeight="55vh">
        <Table>
          <TableCaption>Awards</TableCaption>
          <Thead
            position="sticky"
            top="0"
            bg="white"
            zIndex="1"
            roundedTop={10}
          >
            <Tr className="bg-[#F6F7FB] border border-[#EAECF0]">
              <Th>S/N</Th>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>Status</Th>
              <Th>Date Created</Th>
              <Th>Actions</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(data) &&
              data.map((award, index) => (
                <Tr key={award.id}>
                  <Td>{index + 1}</Td>
                  <Td>{award.title}</Td>
                  <Td>{award.description}</Td>
                  <Td>{award.status}</Td>
                  <Td>{new Date(award.created_at).toLocaleDateString()}</Td>
                  <Td display={"flex"}>
                    <Select
                      value={award.status}
                      onChange={(e) =>
                        changeStatus(award.id, e.target.value)
                      }
                    >
                      <option value="not-started">Not Started</option>
                      <option value="nominations-open">Nominations Open</option>
                      <option value="voting-open">Voting Open</option>
                      <option value="closed">Closed</option>
                    </Select>
                  
                
                  </Td>
                  <Td >
                    <Box display={"flex"} alignItems={"center"} gap={4}>
                    <Button
                      size="sm"
                      onClick={() => {
                        // Navigate to nominees page
                        navigate(`/awards/nominees/${award.id}`);
                        // You can use the `useNavigate` hook from `react-router-dom` to navigate
                        // to the nominees page
                      }}
                    >
                      View Nominees
                    </Button>
                    <DeleteIcon
                    cursor="pointer"
                    onClick={() => deleteAward(award.id)}
                  /></Box>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Award</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Award Title:</FormLabel>
              <Input
                name="title"
                value={award.title}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Award Description:</FormLabel>
              <Input
                name="description"
                value={award.description}
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
              onClick={addAward}
              isLoading={submitting}
            >
              Add Award
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Awards;
