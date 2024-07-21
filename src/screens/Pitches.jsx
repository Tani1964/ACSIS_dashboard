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
  Spinner,
  Center,
} from "@chakra-ui/react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { axi } from "../context/AuthContext";

const Pitches = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { authState } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getPitches = async () => {
      try {
        const headers = { Authorization: `Bearer ${authState.token}` };
        const response = await axi.get("/admin/get-Pitches", { headers });
        setPitches(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    getPitches();
  }, [authState.token]);

  const changeStatus = async (status, id) => {
    try {
      console.log(id, status);
      const headers = { Authorization: `Bearer ${authState.token}` };
      await axi.patch(
        "/admin/review-pitch",
        { pitchId: id, reviewStatus: status },
        { headers }
      );
      const response = await axi.get("/admin/get-Pitches", { headers });
      setPitches(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const viewPitch = (id, data) => {
    const pitchData = {
      personalInformation: data.personal_information,
      professionalBackground: data.professional_background,
      competitionQuestions: data.competition_questions,
      technicalAgreement: data.technical_agreement,
    };

    navigate(`/pitch/${id}`);
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
        <Heading>Pitches</Heading>
        <Text color={"grey"}>
          An overview of the status of all pitched ideas
        </Text>
        <Flex className="flex flex-row justify-between mt-5 py-4">
          <Text color={"grey"} fontWeight={20}>
            {pitches.length} Pitches
          </Text>
        </Flex>
      </Box>

      <Box overflowY="auto" maxHeight="55vh">
        <Table>
          <TableCaption>Pitches</TableCaption>
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
              <Th>Date Submitted</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {pitches.map((data, index) => (
              <Tr key={data.id}>
                <Td>{index + 1}</Td>
                <Td>{data.user.full_name}</Td>
                <Td>{data.user.email}</Td>
                <Td>
                  {console.log(data.id)}
                  <Menu>
                    <MenuButton
                      onClick={onOpen}
                      as={Button}
                      variant={"outline"}
                      size={"sm"}
                      colorScheme={
                        data.review.review_status.toLowerCase() === "approved"
                          ? "green"
                          : data.review.review_status.toLowerCase() ===
                            "pending"
                          ? "orange"
                          : "red"
                      }
                    >
                      {data.review.review_status}
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
                  {new Date(data.review.updated_at).toLocaleDateString()}
                </Td>
                <Td>
                  <Button onClick={() => viewPitch(data.id, data)}>
                    View Pitch
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

export default Pitches;
