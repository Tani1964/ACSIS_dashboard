import { Box, Button, Text, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PitchOptions from "../components/PitchOptions";
import { useAuth, axi } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const Competition = () => {
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
      <PitchOptions id={id} route={"competition"} state={status} />
      <Box  overflowY={"scroll"} height={"50vh"} paddingLeft={4}>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Business Name:
          </Heading>
          <Text>{data.business_name}</Text>
        </Box>
        <Box mb={4}  gap={4}>
          <Heading as="h6" size="sm">
          Please provide a brief description of your business:
          </Heading>
          <Text>{data.business_description}</Text>
        </Box>
        <Box mb={4}  gap={4}>
          <Heading as="h6" size="sm">
          Why are you interested in this competition?:
          </Heading>
          <Text>{data.reason_of_interest}</Text>
        </Box>
        <Box mb={4} gap={4}>
          <Heading as="h6" size="sm">
          How do you plan to use the investment prize if you win?:
          </Heading>
          <Text>{data.investment_prize_usage_plan}</Text>
        </Box>
        <Box mb={4} gap={4}>
          <Heading as="h6" size="sm">
          What impact do you hope to achieve with investment into your vision?:
          </Heading>
          <Text>{data.impact_plan_with_investment_prize}</Text>
        </Box>
        <Box mb={4}  gap={4}>
          <Heading as="h6" size="sm">
          Please provide a short summary of why you should be given the opportunity to be on <span style={{color:"#196100"}}>PITCH IT TO</span> <span style={{color:"#F1A31E"}}>CLINCH IT</span>:
          </Heading>
          <Text>{data.summary_of_why_you_should_participate}</Text>
        </Box>
      </Box>
      <Button
        colorScheme="green"
        color={"white"}
        as={Link}
        to={`/pitch/technical/${id}`}
      >
        Next
      </Button>
    </Box>
  );
};

export default Competition;
