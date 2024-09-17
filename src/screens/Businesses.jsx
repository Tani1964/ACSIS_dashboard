import { useState, useEffect } from "react";
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
  Spinner,
  Center,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { DeleteIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/AuthContext";
import { axi } from "../context/AuthContext";
import * as XLSX from "xlsx";

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
    } catch (error) {
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
      await axi.post("/admin/create-business", business, { headers });
      getData();
      toast({
        title: "Success",
        description: "Business added successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setBusiness({
        businessName: "",
        businessDescription: "",
        businessOwnerName: "",
        businessOwnerEmail: "",
        businessOwnerPhone: "",
        website: "",
        logo: "",
      });
      onClose();
    } catch (error) {
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

  const deleteBusiness = async (id) => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      await axi.delete(`/admin/delete-business/${id}`, { headers });
      getData();
      toast({
        title: "Success",
        description: "Business deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete business.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const exportToExcel = () => {
    const worksheetData = data.map((data) => ({
      // "Date Enrolled": filteredMeeting.dateEnrolled,
      "Business's name": data.business_name,
      "Business owner's name": data.business_owner_name,
      "Business owner's email": data.business_owner_email ,
      "Business owner's phone": data.business_owner_phone ,
      "Business's description": data.business_description  ,
      "Business's website": data.website  ,
      
      // "updated at": filteredMeeting.review?.updated_at,
      Owner: "ACSIS",
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Scheduled Meetings");

    XLSX.writeFile(wb, "scheduled_meetings.xlsx");
  };

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box p={6}>
      <Heading>Businesses</Heading>
      <Text color="gray.500">An overview of all businesses</Text>
      <Flex justify="space-between" align="center" my={5}>
        <Text color="gray.500" fontWeight="bold">
          {data.length} Businesses
        </Text>
        <Flex gap={4}>
        <Button
            colorScheme="green"
            variant={"outline"}
            onClick={exportToExcel}
            size={"md"}
          >
            Export to Excel
          </Button>
        <Button colorScheme="green" onClick={onOpen} leftIcon={<AiOutlineUsergroupAdd />}>
          Add New Business
        </Button></Flex>
      </Flex>

      <Box overflowY="auto" maxHeight="55vh">
        <Table>
          <TableCaption>Businesses</TableCaption>
          <Thead position="sticky" top={0} bg="white" zIndex={1}>
            <Tr bg="#F6F7FB">
              <Th>S/N</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Owner</Th>
              <Th>Owner Email</Th>
              <Th>Date Created</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((business, index) => (
              <Tr key={business.id}>
                <Td>{index + 1}</Td>
                <Td>{business.business_name}</Td>
                <Td>{business.business_description}</Td>
                <Td>{business.business_owner_name}</Td>
                <Td>{business.business_owner_email}</Td>
                <Td>{new Date(business.created_at).toLocaleDateString()}</Td>
                <Td>
                  <DeleteIcon cursor="pointer" onClick={() => deleteBusiness(business.id)} />
                </Td>
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
              <FormLabel>Business Name</FormLabel>
              <Input
                name="businessName"
                value={business.businessName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Business Description</FormLabel>
              <Input
                name="businessDescription"
                value={business.businessDescription}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Business Owner Name</FormLabel>
              <Input
                name="businessOwnerName"
                value={business.businessOwnerName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Business Owner Email</FormLabel>
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
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
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
