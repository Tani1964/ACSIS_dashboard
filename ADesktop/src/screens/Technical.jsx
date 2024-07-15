import { Box, Button, Text, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PitchOptions from "../components/PitchOptions";
import { useAuth, axi } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Technical = () => {
  const { id } = useParams();
  const Navigator = useNavigate();
  console.log(id);
  const [data, setData] = useState({});
  const { setAuthInfo, setUserInfo, user, authState } = useAuth();
  const [status, setStatus] = useState("")

  useEffect(() => {
    const headers = { Authorization: `Bearer ${authState.token}` };
    const fetchData = async () => {
      const response = await axi.get(`/admin/get-pitch/${id}`, { headers });
      setData(response.data.pitch.competition_questions);
      setStatus(response.data.pitch.review_status)
      console.log(id);
    };
    fetchData();
  }, []);
  return (
    <Box>
      <PitchOptions id={id} route={"technical"} state={status} />
      <Box  overflowY={"scroll"} height={"50vh"} paddingLeft={4}>
        <Box mb={4} gap={4}>
          <Heading as="h6" size="sm">
          Does your comapny have any current investors?
          </Heading>
          <Text>{data.have_current_investors}</Text>
        </Box>
        <Box mb={4} gap={4}>
          <Heading as="h6" size="sm">
          Does your company currently employ people?
          </Heading>
          <Text>{data.have_current_investors_description}</Text>
        </Box>
        <Box mb={4}  gap={4}>
          <Heading as="h6" size="sm">
          Do you have any existing debt or liability which we should be aware of?
          </Heading>
          <Text>{data.have_current_employees}</Text>
        </Box>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Full Name:
          </Heading>
          <Text>{data.have_current_employees_description}</Text>
        </Box>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Full Name:
          </Heading>
          <Text>{data.have_debts}</Text>
        </Box>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Full Name:
          </Heading>
          <Text>{data.have_debts_description}</Text>
        </Box>
      </Box>
      <Button
        colorScheme="green"
        color={"white"}
        as={Link}
        to={`/pitches`}
      >
        Menu
      </Button>
    </Box>
  );
};

export default Technical;
