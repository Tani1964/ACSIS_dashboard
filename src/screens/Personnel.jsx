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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  Spinner,
  Center,
  useToast,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { useEffect, useState } from "react";
import { axi } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";

/**
 * @typedef {Object} PersonnelData
 * @property {string} id
 * @property {string} full_name
 * @property {string} email
 * @property {string} role
 */

const Personnel = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authState } = useAuth();
  const [personnel, setPersonnel] = useState([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const getPersonnel = async () => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.get("/admin/get-users", { headers });
      setPersonnel(response.data.filter((data) => data.role === "admin"));
    } catch (error) {
      console.error("Failed to fetch personnel:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPersonnel();
  }, [authState.token]);

  const addPersonnel = async () => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      await axi.post("/admin/add-admin", { email }, { headers });
      const response = await axi.get("/admin/get-users", { headers });
      setPersonnel(response.data.filter((data) => data.role === "admin"));
      onClose()
    } catch (error) {
      console.error("Failed to add personnel:", error);
      if (error.response) {
        if (error.response.status === 422) {
          toast({
            title: "Validation Error",
            description: "Invalid data provided.",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        } else if (error.response.status === 400) {
          toast({
            title: "Validation Error",
            description: "User doesn't exist or already an admin.",
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        } else {
          toast({
            title: `Error ${error.response.status}`,
            description: error.response.data.message || "An error occurred.",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to add personnel. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const deleteAdmin = async(id) => {
    try {
      await axi.patch(`/admin/revoke-admin-status/${id}`);
      toast({
        title: "Success",
        description: "Personnel deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.get("/admin/get-users", { headers });
      setPersonnel(response.data.filter((data) => data.role === "admin"));
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to delete personnel. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
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
        <Heading>Personnel</Heading>
        <Text color={"grey"}>
          An overview of all users with access to this dashboard.
        </Text>
        <Flex className="flex flex-row justify-between mt-5 py-4">
          <Text color={"grey"} fontWeight={20}>
            {personnel.length} Users
          </Text>
          <Button colorScheme="green" size="md" gap={2} onClick={onOpen}>
            <AiOutlineUsergroupAdd />
            Add New Personnel
          </Button>
        </Flex>
      </Box>

      <Box overflowY="auto" maxHeight="60vh">
        <Table position="sticky" top="0" bg="white" zIndex="1" roundedTop={10}>
          <TableCaption>Admin users</TableCaption>
          <Thead>
            <Tr className="bg-[#F6F7FB] border border-[#EAECF0]">
              <Th>S/N</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {personnel.map((data, index) => (
              <Tr key={data.id}>
                <Td>{index + 1}</Td>
                <Td>{data.full_name}</Td>
                <Td>{data.email}</Td>
                <Td>{data.role}</Td>
                <Td onClick={()=>deleteAdmin(data.id)}>
                  <DeleteIcon />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Personnel</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input type="email" value={email} onChange={handleChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="green" onClick={addPersonnel}>
              Grant Access
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Personnel;
