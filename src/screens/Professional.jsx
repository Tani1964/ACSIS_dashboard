import { Box, Button, Text, Heading, Spinner, Center, Alert, AlertIcon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PitchOptions from "../components/PitchOptions";
import { useAuth, axi } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Professional = () => {
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
        setData(response.data.pitch.professional_background);
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
      <PitchOptions id={id} route={"professional"} state={status} />
      <Box overflowY={"scroll"} height={"50vh"} paddingLeft={4}>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Current Occupation:
          </Heading>
          <Text>{data.current_occupation}</Text>
        </Box>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            LinkedIn URL:
          </Heading>
          <Text>{data.linkedin_url}</Text>
        </Box>
      </Box>
      <Button colorScheme="green" color={"white"}>
        <Link to={`/pitch/competition/${id}`}>Next</Link>
      </Button>
    </Box>
  );
};

export default Professional;
