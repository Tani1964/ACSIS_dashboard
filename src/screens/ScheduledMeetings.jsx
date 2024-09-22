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
  Spinner,
  Center,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth, axi } from "../context/AuthContext";
import * as XLSX from "xlsx";

const ScheduledMeetings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [companyProfile, setCompanyProfile] = useState("");
  const { authState } = useAuth();
  const navigate = useNavigate();

  const getMeetings = async () => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      const response = await axi.get("/admin/get-all-scheduled-meetings", {
        headers,
      });
      const meetingsData = response.data.meetings || [];
      console.log(meetingsData);
      setMeetings(meetingsData);
      setFilteredMeetings(meetingsData);
    } catch (error) {
      if (!error.response) {
        alert("Network error: Please check your internet connection.");
      } else if (error.response.status === 401) {
        alert("Unauthorized: Please log in again.");
        navigate("/login");
      } else {
        alert("An error occurred: " + error.response.data.message);
      }
      console.error("Failed to fetch meetings:", error);
    } finally {
      setLoading(false);
    }
  };

 

  const exportToExcel = () => {
    const worksheetData = filteredMeetings.map((filteredMeeting) => ({
      // "Date Enrolled": filteredMeeting.dateEnrolled,
      "Proposer's Fullname": filteredMeeting.proposer?.full_name,
      "Proposer's email": filteredMeeting.proposer?.email,
      "Company's profile": filteredMeeting.company_profile ,
      "Reason for meeting": filteredMeeting.description  ,
      
      // "updated at": filteredMeeting.review?.updated_at,
      // Owner: "ACSIS",
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Scheduled Meetings");

    XLSX.writeFile(wb, "scheduled_meetings.xlsx");
  };

  useEffect(() => {
    getMeetings();
  }, [authState.token, navigate]);

  useEffect(() => {
    applyFilters();
  }, [filter, statusFilter, meetings]);

  const changeStatus = async (status, id) => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      await axi.patch(
        "/admin/review-meeting-schedule",
        { meetingId: id, reviewStatus: status },
        { headers }
      );
      // Re-fetch meetings after status change
      getMeetings();
    } catch (error) {
      if (!error.response) {
        alert("Network error: Please check your internet connection.");
      } else if (error.response.status === 401) {
        alert("Unauthorized: Please log in again.");
        navigate("/login");
      } else {
        alert("An error occurred: " + error.response.data.message);
      }
      console.error("Failed to change status:", error);
    }
  };

  const applyFilters = () => {
    const now = new Date();
    let filtered = meetings;

    // Apply date filter
    if (filter === "last-week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      filtered = filtered.filter(
        (meeting) => new Date(meeting.review?.updated_at) >= oneWeekAgo
      );
    } else if (filter === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      filtered = filtered.filter(
        (meeting) => new Date(meeting.review?.updated_at) >= oneMonthAgo
      );
    } else if (filter === "year") {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      filtered = filtered.filter(
        (meeting) => new Date(meeting.review?.updated_at) >= oneYearAgo
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (meeting) =>
          meeting.review?.review_status.toLowerCase() === statusFilter
      );
    }

    setFilteredMeetings(filtered);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const viewMeeting = (id) => {
    navigate(`/meeting/${id}`);
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
        <Flex className="justify-between items-center">
          <Box>
            <Heading>Scheduled Meetings</Heading>
            <Text color={"grey"}>
              An overview of the status of all scheduled meetings
            </Text>
          </Box>
          <Button
            colorScheme="green"
            variant={"outline"}
            onClick={exportToExcel}
            size={"sm"}
          >
            Export to Excel
          </Button>
        </Flex>
        <Flex className="flex flex-row justify-between mt-5 py-4">
          <Text color={"grey"} fontWeight={20}>
            {filteredMeetings.length} Meetings
          </Text>
          <Flex gap={4}>
            <Select
              value={filter}
              onChange={handleFilterChange}
              maxWidth="200px"
            >
              <option value="all">All</option>
              <option value="last-week">Last Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </Select>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              maxWidth="200px"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="declined">Declined</option>
            </Select>
          </Flex>
        </Flex>
      </Box>

      <Box overflowY="auto" maxHeight="40vh" maxWidth={"78vw"}>
        <Table>
          <TableCaption>Meetings</TableCaption>
          <Thead
            position="sticky"
            top="0"
            bg="white"
            zIndex="1"
            roundedTop={10}
          >
            <Tr className="bg-[#F6F7FB] border border-[#EAECF0]">
              <Th>S/N</Th>
              <Th>Proposer Name</Th>
              <Th>Proposer Email</Th>
              <Th>Business Name</Th>
              <Th>Status</Th>
              <Th>Date Reviewed</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(filteredMeetings) &&
              filteredMeetings.map((data, index) => (
                <Tr key={data.id}>
                  <Td>{index + 1}</Td>
                  <Td>{data.proposer?.full_name || "N/A"}</Td>
                  <Td>{data.proposer?.email || "N/A"}</Td>
                  <Td>{data.recipient?.business_name || "N/A"}</Td>
                  <Td>
                    <Menu>
                      <MenuButton
                        as={Button}
                        variant={"outline"}
                        size={"sm"}
                        colorScheme={
                          data.review?.review_status.toLowerCase() ===
                          "approved"
                            ? "green"
                            : data.review?.review_status.toLowerCase() ===
                              "pending"
                            ? "orange"
                            : "red"
                        }
                      >
                        {data.review?.review_status || "Unknown"}
                      </MenuButton>
                      <MenuList>
                        <MenuItem
                          onClick={() => changeStatus("approved", data.id)}
                        >
                          Approve
                        </MenuItem>
                        <MenuItem
                          onClick={() => changeStatus("declined", data.id)}
                        >
                          Decline
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                  <Td>
                    {data.review?.updated_at
                      ? new Date(data.review.updated_at).toLocaleDateString()
                      : "N/A"}
                  </Td>
                  <Td>
                    <Button
                      onClick={() => {
                        setName(data.proposer?.full_name || "N/A");
                        setDescription(
                          data.description || "No description available"
                        );
                        setCompanyProfile(
                          data.company_profile || "No profile available"
                        );
                        onOpen();
                      }}
                    >
                      View Proposal
                    </Button>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{name} Meeting Proposal</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Box>
              <Text fontWeight="bold">Proposal:</Text>
              <Text>{description}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">Company Profile:</Text>
              <Text>{companyProfile}</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ScheduledMeetings;
