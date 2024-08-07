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
  Textarea,
  IconButton,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { axi } from "../context/AuthContext";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";

const Events = () => {
  const { authState } = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    day: "",
    time: "",
    durationHours: 0,
    dateTime: "",
    registrationLink: "",
    image: null,
    sponsorImages: [],
    sponsors: [],
    otherLinks: [],
  });
  const [newSponsor, setNewSponsor] = useState({
    name: "",
    description: "",
    website: "",
    image: null,
  });
  const [newLink, setNewLink] = useState({ title: "", url: "" });

  useEffect(() => {
    const getEvents = async () => {
      try {
        const headers = { Authorization: `Bearer ${authState.token}` };
        const response = await axi.get("/event/get-all-events", { headers });
        setEvents(response.data);
        // console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };
    getEvents();
  }, [authState.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setNewEvent({ ...newEvent, [name]: files[0] });
  };

  const handleSponsorLogoChange = (e) => {
    const { files } = e.target;
    setNewEvent({ ...newEvent, sponsorImages: Array.from(files) });
  };

  const handleDateChange = (date) => {
    if (date) {
      const dateString = date.format("YYYY-MM-DD"); // Ensure date format is correct
      setNewEvent({ ...newEvent, date: dateString });
    }
  };

  const handleTimeChange = (e) => {
    setNewEvent({ ...newEvent, time: e.target.value });
  };

  const handleAddSponsor = () => {
    const newSponsorWithImage = { ...newSponsor, image: null }; // Handle image upload separately
    setNewEvent({
      ...newEvent,
      sponsors: [...newEvent.sponsors, newSponsorWithImage],
    });
    setNewSponsor({ name: "", description: "", website: "", image: null });
  };

  const handleDeleteSponsor = (index) => {
    const updatedSponsors = newEvent.sponsors.filter((_, i) => i !== index);
    setNewEvent({ ...newEvent, sponsors: updatedSponsors });
  };

  const handleAddLink = () => {
    setNewEvent({
      ...newEvent,
      otherLinks: [...newEvent.otherLinks, newLink],
    });
    setNewLink({ title: "", url: "" });
  };

  const handleDeleteLink = (index) => {
    const updatedLinks = newEvent.otherLinks.filter((_, i) => i !== index);
    setNewEvent({ ...newEvent, otherLinks: updatedLinks });
  };

  const handleAddEvent = async () => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}`, "Content-Type": "multipart/form-data" };
      const combinedDateTime = new Date(`${newEvent.date}T${newEvent.time}`).toISOString();
  
      const formData = new FormData();
      formData.append("title", newEvent.title);
      formData.append("description", newEvent.description);
      formData.append("location", newEvent.location);
      formData.append("dateTime", combinedDateTime);
      formData.append("day", newEvent.day);
      formData.append("durationHours", newEvent.durationHours);
      formData.append("registrationLink", newEvent.registrationLink);
  
      if (newEvent.image) {
        formData.append("image", newEvent.image);
      }
  
      newEvent.sponsorImages.forEach((image, index) => {
        formData.append(`sponsorImages`, image);  // Ensure the backend expects "sponsorImages"
      });
  
      formData.append("sponsors", JSON.stringify(newEvent.sponsors));
      formData.append("otherLinks", JSON.stringify(newEvent.otherLinks));
  
      console.log([...formData.entries()]);  // Check the form data being sent
  
      await axi.post("/event/create-event", formData, { headers });
  
      setEvents([...events, { ...newEvent, id: events.length + 1 }]);
      setNewEvent({
        title: "",
        description: "",
        location: "",
        date: "",
        day: "",
        time: "",
        durationHours: 0,
        registrationLink: "",
        image: null,
        sponsorImages: [],
        sponsors: [],
        otherLinks: [],
      });
  
      const response = await axi.get("/event/get-all-events", { headers });
      setEvents(response.data);
      onClose();
    } catch (error) {
      console.error("Failed to add event:", error);
    }
  };
  

  const handleDeleteEvent = async (eventId) => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      await axi.delete(`/event/delete-event/${eventId}`, { headers });
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Failed to delete event:", error);
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
    <Box px={6} py={4}>
      <Box>
        <Heading>Events</Heading>
        <Text color="gray.500">An overview of all events.</Text>
        <Flex justify="space-between" mt={5} py={4}>
          <Text color="gray.500" fontWeight="bold">
            {events.length} Events
          </Text>
          <Button colorScheme="green" size="md" gap={2} onClick={onOpen}>
            <AiOutlineUsergroupAdd />
            Add New Event
          </Button>
        </Flex>
      </Box>

      <Box overflowY="auto" maxHeight="60vh">
        <Table position="sticky" top="0" bg="white" zIndex="1" roundedTop={10}>
          <TableCaption>All Events</TableCaption>
          <Thead>
            <Tr bg="#F6F7FB" border="1px solid #EAECF0">
              <Th>S/N</Th>
              <Th>Event Title</Th>
              <Th>Location</Th>
              <Th>Date</Th>
              <Th>Time</Th>
              <Th>Description</Th>
              <Th>Day</Th>
              <Th>Predicted Duration</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {events.map((event, index) => (
              <Tr key={event.id}>
                <Td>{index + 1}</Td>
                <Td>{event.title}</Td>
                <Td>{event.location}</Td>
                <Td>{new Date(event.date_time).toLocaleDateString()}</Td>
                <Td>
                  {new Date(event.date_time).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Td>
                <Td>{event.description}</Td>
                <Td>{event.day}</Td>
                <Td>{event.duration_hours} hours</Td>
                <Td>
                  <DeleteIcon
                    cursor="pointer"
                    onClick={() => handleDeleteEvent(event.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Event Title</FormLabel>
              <Input
                name="title"
                value={newEvent.title}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={newEvent.location}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Date</FormLabel>
              <DateTime
                value={newEvent.date}
                onChange={handleDateChange}
                dateFormat="YYYY-MM-DD"
                timeFormat={false}
                inputProps={{ placeholder: "Select Date" }}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Time</FormLabel>
              <Input
                name="time"
                type="time"
                value={newEvent.time}
                onChange={handleTimeChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={newEvent.description}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Day</FormLabel>
              <Input
                name="day"
                type="text"
                value={newEvent.day}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Predicted Duration (hours)</FormLabel>
              <Input
                name="durationHours"
                type="number"
                value={newEvent.durationHours}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Registration Link</FormLabel>
              <Input
                name="registrationLink"
                value={newEvent.registrationLink}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Event Image</FormLabel>
              <Input
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Sponsor Logo Images</FormLabel>
              <Input
                name="sponsorImages"
                type="file"
                accept="image/*"
                multiple
                onChange={handleSponsorLogoChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Sponsors</FormLabel>
              {newEvent.sponsors.map((sponsor, index) => (
                <Flex
                  key={index}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Text fontWeight="bold">{sponsor.name}</Text>
                    <Text>{sponsor.description}</Text>
                  </Box>
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDeleteSponsor(index)}
                  />
                </Flex>
              ))}
              <Box mt={2}>
                <Input
                  placeholder="Sponsor Name"
                  value={newSponsor.name}
                  onChange={(e) =>
                    setNewSponsor({ ...newSponsor, name: e.target.value })
                  }
                />
                <Input
                  mt={2}
                  placeholder="Sponsor Description"
                  value={newSponsor.description}
                  onChange={(e) =>
                    setNewSponsor({
                      ...newSponsor,
                      description: e.target.value,
                    })
                  }
                />
                <Button mt={2} onClick={handleAddSponsor}>
                  Add Sponsor
                </Button>
              </Box>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Other Links</FormLabel>
              {newEvent.otherLinks.map((link, index) => (
                <Flex
                  key={index}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Box>
                    <Text fontWeight="bold">{link.title}</Text>
                    <Text>{link.url}</Text>
                  </Box>
                  <IconButton
                    icon={<DeleteIcon />}
                    size="sm"
                    colorScheme="red"
                    onClick={() => handleDeleteLink(index)}
                  />
                </Flex>
              ))}
              <Box mt={2}>
                <Input
                  placeholder="Link Title"
                  value={newLink.title}
                  onChange={(e) =>
                    setNewLink({ ...newLink, title: e.target.value })
                  }
                />
                <Input
                  mt={2}
                  placeholder="Link URL"
                  value={newLink.url}
                  onChange={(e) =>
                    setNewLink({ ...newLink, url: e.target.value })
                  }
                />
                <Button mt={2} onClick={handleAddLink}>
                  Add Link
                </Button>
              </Box>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="green" onClick={handleAddEvent}>
              Add Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Events;
