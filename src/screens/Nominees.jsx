import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { axi } from '../context/AuthContext';
import { Box, Heading, Text, List, ListItem, Divider } from '@chakra-ui/react';

const Nominees = () => {
  const { id } = useParams();
  const [data, setData] = useState([]); // Use useState to initialize state

  const getData = async () => {
    try {
      const response = await axi.get(`/award/get-award-nominees/${id}`);
      setData(response.data.nominees); // Assuming the response contains nominees in this structure
      console.log(response.data);
    } catch (error) {
      console.error("Failed to fetch nominees:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <Box p={5}>
      <Heading mb={4}>Nominees</Heading>
      <List spacing={3}>
        {data.map((nominee) => (
          <Box key={nominee.id} p={4} borderWidth={1} borderRadius="md" shadow="sm">
            <Text fontWeight="bold">{nominee.name}</Text>
            <Text>Award: {nominee.award.title}</Text> {/* Adjust this according to the structure of the award object */}
            <Divider mt={2} />
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default Nominees;
