import { Box, Heading, Text, Flex, Card, Spinner, Center } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { axi } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import { Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
} from 'chart.js';
import {  useNavigate } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, BarController);

const Dashboard = () => {
  const { authState } = useAuth();
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    if (!authState.token) {
      navigate("/login")
    }
    const getMetrics = async () => {
      try {
        const headers = { Authorization: `Bearer ${authState.token}` };
        const response = await axi.get("/admin/get-Metrics", { headers });
        setMetrics(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/login");
        } else {
          console.error("Failed to fetch metrics:", error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    getMetrics();
  }, [authState.token]);

  const doughnutChartData = {
    labels: ["Approved", "Pending", "Declined"],
    datasets: [
      {
        data: [metrics.approvedPitches || 0, metrics.pendingReviews || 0, metrics.declinedPitches || 0],
        backgroundColor: ["#48BB78", "#ED8936", "#F56565"],
        hoverBackgroundColor: ["#9AE6B4", "#FBD38D", "#FEB2B2"],
      },
    ],
  };

  const barChartData = {
    labels: ['Total Users', 'Total Businesses', 'Total Pitches'],
    datasets: [
      {
        label: 'Users Metrics',
        data: [metrics.totalUsers || 0, metrics.totalBusinesses || 0, metrics.totalPitches || 0],
        backgroundColor: ['grey', 'green', 'yellow'],
        borderColor: ['grey', 'green', 'yellow'],
        borderWidth: 0.5,
      },
    ],
  };

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box px={4} overflowY="hidden" height="100vh">
      <Box borderBottom="2px" borderColor="gray.200" px={4} py={1}>
        <Heading as="h5" size="xl">Dashboard</Heading>
        <Text color="gray.500">An overview of the status of all pitched ideas</Text>
      </Box>
      <Flex borderBottom="2px" borderColor="gray.200" p={4} wrap="wrap">
        <Box borderRight="2px" borderColor="gray.200" w="16.67%" p={2}>
          <Text color="gray.500">Total Users</Text>
          <Text fontWeight="bold" fontSize="xl">{metrics.totalUsers}</Text>
        </Box>
        <Box borderRight="2px" borderColor="gray.200" w="16.67%" p={2}>
          <Text color="gray.500">Total Businesses</Text>
          <Text fontWeight="bold" fontSize="xl">{metrics.totalBusinesses}</Text>
        </Box>
        <Box borderRight="2px" borderColor="gray.200" w="16.67%" p={2}>
          <Text color="gray.500">Total Pitches</Text>
          <Text fontWeight="bold" fontSize="xl">{metrics.totalPitches}</Text>
        </Box>
        <Box borderRight="2px" borderColor="gray.200" w="16.67%" p={2}>
          <Text color="green.500">Approved Pitches</Text>
          <Text fontWeight="bold" fontSize="xl">{metrics.approvedPitches}</Text>
        </Box>
        <Box borderRight="2px" borderColor="gray.200" w="16.67%" p={2}>
          <Text color="orange.500">Pending Pitches</Text>
          <Text fontWeight="bold" fontSize="xl">{metrics.pendingReviews}</Text>
        </Box>
        <Box w="16%" p={2}>
          <Text color="red.500">Declined Pitches</Text>
          <Text fontWeight="bold" fontSize="xl">{metrics.declinedPitches}</Text>
        </Box>
      </Flex>
      <Flex height="40vh" mt={4} justify="space-around" >
        <Card w="45%" display={"flex"} flexDirection={"row"} padding={2}>
        <Text>Pitch Status Breakdown:</Text>
          <Doughnut data={doughnutChartData} />
        </Card>
        <Card w="45%" h={'100%'} padding={2}>
          <Text>Users Information Breakdown:</Text>
          <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
        </Card>
      </Flex>
    </Box>
  );
};

export default Dashboard;
