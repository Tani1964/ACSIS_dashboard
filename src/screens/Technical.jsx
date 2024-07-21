import { Box, Button, Text, Heading, Spinner, Center, Alert, AlertIcon } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PitchOptions from "../components/PitchOptions";
import { useAuth, axi } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Technical = () => {
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
        setData(response.data.pitch.technical_agreement);
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
      <PitchOptions id={id} route={"technical"} state={status} />
      <Box overflowY={"scroll"} height={"50vh"} paddingLeft={4}>
        <Box mb={4} gap={4}>
          <Heading as="h6" size="sm">
            Does your company have any current investors?
          </Heading>
          <Text>{data.have_current_investors ? "Yes" : "No"}</Text>
        </Box>
        <Box mb={4} gap={4}>
          <Heading as="h6" size="sm">
            Description:
          </Heading>
          <Text>
            {data.have_current_investors_description
              ? data.have_current_investors_description
              : "No description provided"}
          </Text>
        </Box>
        <Box mb={4} gap={4}>
          <Heading as="h6" size="sm">
            Does your company currently employ people?
          </Heading>
          <Text>{data.have_current_employees ? "Yes" : "No"}</Text>
        </Box>
        <Box mb={4} gap={4}>
          <Heading as="h6" size="sm">
            Description:
          </Heading>
          <Text>
            {data.have_current_employees_description
              ? data.have_current_employees_description
              : "No description provided"}
          </Text>
        </Box>
        <Box mb={4} gap={4}>
          <Heading as="h6" size="sm">
            Do you have any existing debt or liability which we should be aware of?:
          </Heading>
          <Text>{data.have_debts ? "Yes" : "No"}</Text>
        </Box>
        <Box mb={4} gap={4}>
          <Heading as="h6" size="sm">
            Description:
          </Heading>
          <Text>
            {data.have_debts_description
              ? data.have_debts_description
              : "No description provided"}
          </Text>
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
