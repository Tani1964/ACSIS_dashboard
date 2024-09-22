import { Box, Button, Text, Heading, Spinner, Center, Alert, AlertIcon } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PitchOptions from "../components/PitchOptions";
import { useAuth, axi } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Personal = () => {
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
        setData(response.data.pitch.personal_information);
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
      
      <PitchOptions id={id} route={"personal"} state={"pending"} />
      <Box overflowY={"scroll"} height={"50vh"} paddingLeft={4}>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Full Name:
          </Heading>
          <Text>{data.full_name}</Text>
        </Box>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Email:
          </Heading>
          <Text>{data.email}</Text>
        </Box>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Phone Number:
          </Heading>
          <Text>{data.phone_number}</Text>
        </Box>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Date of Birth:
          </Heading>
          <Text>
            {new Date(data.date_of_birth).toLocaleDateString()}
          </Text>
        </Box>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Ethnicity:
          </Heading>
          <Text>{data.ethnicity}</Text>
        </Box>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Nationality:
          </Heading>
          <Text>{data.nationality}</Text>
        </Box>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Disability Support Required:
          </Heading>
          <Text>
            {data.requires_disability_support ? "Yes" : "No"}
          </Text>
        </Box>
        {data.requires_disability_support && (
          <Box mb={4} display={"flex"} gap={4}>
            <Heading as="h6" size="sm">
              Disability Support Description:
            </Heading>
            <Text>
              {data.disability_support_description}
            </Text>
          </Box>
        )}
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Created At:
          </Heading>
          <Text>
            {new Date(data.created_at).toLocaleString()}
          </Text>
        </Box>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Updated At:
          </Heading>
          <Text>
            {new Date(data.updated_at).toLocaleString()}
          </Text>
        </Box>
      </Box>
      <Button
        colorScheme="green"
        color={"white"}
        as={Link}
        to={`/pitch/professional/${id}`}
      >
        Next
      </Button>
    </Box>
  );
};

export default Personal;
