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
  Spinner,
  Center,
  Select,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth, axi } from "../context/AuthContext";

const ScheduledMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [filteredMeetings, setFilteredMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getMeetings = async () => {
      try {
        const headers = { Authorization: `Bearer ${authState.token}` };
        const response = await axi.get("/admin/get-all-scheduled-meetings", { headers });
        const meetingsData = response.data || []; // Ensure it's an array
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
        { meetingId: id, meetingLink: "", reviewStatus: status },
        { headers }
      );
      const response = await axi.get("/admin/get-all-scheduled-meetings", { headers });
      const meetingsData = response.data || [];
      setMeetings(meetingsData);
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
      filtered = filtered.filter(meeting =>
        new Date(meeting.review.updated_at) >= oneWeekAgo
      );
    } else if (filter === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      filtered = filtered.filter(meeting =>
        new Date(meeting.review.updated_at) >= oneMonthAgo
      );
    } else if (filter === "year") {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(now.getFullYear() - 1);
      filtered = filtered.filter(meeting =>
        new Date(meeting.review.updated_at) >= oneYearAgo
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(meeting =>
        meeting.review.review_status.toLowerCase() === statusFilter
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
        <Heading>Scheduled Meetings</Heading>
        <Text color={"grey"}>
          An overview of the status of all scheduled meetings
        </Text>
        <Flex className="flex flex-row justify-between mt-5 py-4">
          <Text color={"grey"} fontWeight={20}>
            {filteredMeetings.length} Meetings
          </Text>
          <Flex gap={4}>
            <Select value={filter} onChange={handleFilterChange} maxWidth="200px">
              <option value="all">All</option>
              <option value="last-week">Last Week</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </Select>
            <Select value={statusFilter} onChange={handleStatusFilterChange} maxWidth="200px">
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="declined">Declined</option>
            </Select>
          </Flex>
        </Flex>
      </Box>

      <Box overflowY="auto" maxHeight="55vh">
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
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Status</Th>
              <Th>Reviewer</Th>
              <Th>Date Scheduled</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(filteredMeetings) && filteredMeetings.map((data, index) => (
              <Tr key={data.id}>
                <Td>{index + 1}</Td>
                <Td>{data.user?.full_name || "N/A"}</Td>
                <Td>{data.user?.email || "N/A"}</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={Button}
                      variant={"outline"}
                      size={"sm"}
                      colorScheme={
                        data.review.review_status.toLowerCase() === "approved"
                          ? "green"
                          : data.review.review_status.toLowerCase() === "pending"
                          ? "orange"
                          : "red"
                      }
                    >
                      {data.review.review_status || "Unknown"}
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
                <Td>{data.review.reviewer_name || "Not yet reviewed"}</Td>
                <Td>
                  {new Date(data.review.updated_at).toLocaleDateString() || "N/A"}
                </Td>
                <Td>
                  <Button onClick={() => viewMeeting(data.id)}>
                    View Meeting
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default ScheduledMeetings;
