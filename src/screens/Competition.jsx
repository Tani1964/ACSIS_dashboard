import { Box, Button, Text, Heading, Spinner, Center, Alert, AlertIcon } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PitchOptions from "../components/PitchOptions";
import { useAuth, axi } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Competition = () => {
  const { id } = useParams();
  const Navigator = useNavigate();
  const [data, setData] = useState({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authState } = useAuth();

  useEffect(() => {
    const headers = { Authorization: `Bearer ${authState.token}` };
    const fetchData = async () => {
      try {
        const response = await axi.get(`/admin/get-pitch/${id}`, { headers });
        setData(response.data.pitch.competition_questions);
        setStatus(response.data.pitch.review_status);
      } catch (error) {
        if (!error.response) {
          setError("Network error: Please check your internet connection.");
        } else if (error.response.status === 401) {
          setError("Unauthorized: Please log in again.");
          Navigator("/login");
        } else {
          setError("An error occurred: " + error.response.data.message);
        }
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, authState.token, Navigator]);

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center height="100vh">
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Center>
    );
  }

  return (
    <Box>
      <PitchOptions id={id} route={"competition"} state={status} />
      <Box overflowY={"scroll"} height={"50vh"} paddingLeft={4}>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Business Name:
          </Heading>
          <Text>{data.business_name}</Text>
        </Box>
        <Box mb={4} gap={4}>
          <Heading as="h6" size="sm">
            Please provide a brief description of your business:
          </Heading>
          <Text>{data.business_description}</Text>
        </Box>
        <Box mb={4} gap={4}>
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
        <Box mb={4} gap={4}>
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
