import { Box, Heading, Text, Flex } from "@chakra-ui/react";
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

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, BarController);

const Dashboard = () => {
  const { authState } = useAuth();
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    const getMetrics = async () => {
      try {
        const headers = { Authorization: `Bearer ${authState.token}` };
        const response = await axi.get("/admin/get-Metrics", { headers });
        setMetrics(response.data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      }
    };
    getMetrics();
  }, [authState.token]);

  const doughnutChartData = {
    labels: ["Approved", "Pending", "Declined"],
    datasets: [
      {
        data: [metrics.approvedPitches || 0, metrics.pendingReviews || 0, metrics.declinedPitches || 0],
        // data: [40, 90, 100],
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
        // data: [40, 90, 100],
        backgroundColor: ['grey', 'green', 'yellow'],
        borderColor: ['grey', 'green', 'yellow'],
        borderWidth: 0.5,
      },
    ],
  };

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
      <Flex  height="40vh" mt={4} justify="space-around">
        <Box w="30%">
          <Doughnut data={doughnutChartData} />
        </Box>
        <Box w="45%" h={'100%'}>
          <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
        </Box>
      </Flex>
    </Box>
  );
};

export default Dashboard;
