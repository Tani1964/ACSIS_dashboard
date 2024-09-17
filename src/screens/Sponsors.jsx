import {
  Box,
  Image,
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
  Select,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { useEffect, useState } from "react";
import { axi } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import * as XLSX from "xlsx";

/**
 * @typedef {Object} SponsorData
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} description
 * @property {string} website
 * @property {string} eventId
 * @property {string} image
 */

const Sponsors = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authState } = useAuth();
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    website: "",
    eventId: "",
    image: null,
  });
  const toast = useToast();

  const getSponsors = async () => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.get("/sponsor/get-all-sponsors", { headers });
      setSponsors(response.data);
    } catch (error) {
      console.error("Failed to fetch sponsors:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSponsors();
  }, [authState.token]);

  const addSponsor = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${authState.token}`,
        "Content-Type": "multipart/form-data",
      };
      const form = new FormData();
      Object.keys(formData).forEach((key) => {
        form.append(key, formData[key]);
      });

      await axi.post("/sponsor/create-sponsor", form, { headers });
      onClose();
      getSponsors(); // Refresh sponsors list
    } catch (error) {
      console.error("Failed to add sponsor:", error);
      toast({
        title: "Error",
        description: "Failed to add sponsor. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const deleteSponsor = async (id) => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      await axi.delete(`/sponsor/delete-sponsor/${id}`, { headers });
      toast({
        title: "Success",
        description: "Sponsor deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      getSponsors(); // Refresh sponsors list
    } catch (error) {
      console.error("Failed to delete sponsor:", error);
      toast({
        title: "Error",
        description: "Failed to delete sponsor. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const exportToExcel = () => {
    const worksheetData = sponsors.map((sponsor) => ({
      // "Date Enrolled": filteredMeeting.dateEnrolled,
      "Sponsor's name": sponsor.name,
      "Sponsor's category": sponsor.category,
      "Sponsor's website": sponsor.website ,
      
      // "updated at": filteredMeeting.review?.updated_at,
      Owner: "ACSIS",
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sponsors");

    XLSX.writeFile(wb, "Sponsors.xlsx");
  };

  return (
    <Box className="px-6 py-4">
      <Box>
        <Heading>Sponsors</Heading>
        <Text color={"grey"}>An overview of all sponsors for events.</Text>
        <Flex className="flex flex-row justify-between mt-5 py-4">
          <Text color={"grey"} fontWeight={20}>
            {sponsors.length} Sponsors
          </Text>
          <Flex gap={2}> 
          <Button
            colorScheme="green"
            variant={"outline"}
            onClick={exportToExcel}
            size={"md"}
          >
            Export to Excel
          </Button>
          <Button colorScheme="green" size="md" gap={2} onClick={onOpen}>
            <AiOutlineUsergroupAdd />
            Add New Sponsor
          </Button>
          </Flex>
        </Flex>
      </Box>

      <Box overflowY="auto" maxHeight="60vh">
        <Table position="sticky" top="0" bg="white" zIndex="1" roundedTop={10}>
          <TableCaption>Event Sponsors</TableCaption>
          <Thead>
            <Tr className="bg-[#F6F7FB] border border-[#EAECF0]">
              <Th>S/N</Th>
              <Th>Name</Th>
              <Th>Logo</Th>
              <Th>Category</Th>
              <Th>Website</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {sponsors.map((data, index) => (
              <Tr key={data.id}>
                <Td>{index + 1}</Td>
                <Td>{data.name}</Td>
                <Td><Image src={data.image} height={100} /></Td>
                <Td>{data.category}</Td>
                <Td>{data.website}</Td>
                <Td onClick={() => deleteSponsor(data.id)}>
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
          <ModalHeader>Add New Sponsor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input name="name" value={formData.name} onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Category</FormLabel>
              <Select name="category" value={formData.category} onChange={handleChange}>
                <option value="general">General</option>
                <option value="event">Event</option>
                <option value="award">Award</option>
                <option value="pitch">Pitch</option>
                <option value="business">Business</option>
              </Select>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input name="description" value={formData.description} onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Website</FormLabel>
              <Input name="website" value={formData.website} onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Event ID</FormLabel>
              <Input name="eventId" value={formData.eventId} onChange={handleChange} />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Image</FormLabel>
              <Input type="file" name="image" onChange={handleChange} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="green" onClick={addSponsor}>
              Add Sponsor
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Sponsors;
