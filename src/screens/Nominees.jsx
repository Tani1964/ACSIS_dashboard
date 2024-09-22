import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { axi } from '../context/AuthContext';
import { Box, Heading, Text, List, Divider } from '@chakra-ui/react';

const Nominees = () => {
  const { id } = useParams();
  const [data, setData] = useState([]); 
  const [pitchNames, setPitchNames] = useState({}); // State to store fetched pitch names

  const getData = async () => {
    try {
      const response = await axi.get(`/award/get-award-nominees/${id}`);
      setData(response.data.nominees);
    } catch (error) {
      console.error("Failed to fetch nominees:", error);
    }
  };

  const getPitch = async (pitchId) => {
    try {
      const response = await axi.get(`/pitch/get-pitch/${pitchId}`);
      return response.data.pitch.competition_questions.business_name; // Assuming the pitch response contains a `pitch_name` field
    } catch (error) {
      console.error("Failed to fetch pitch:", error);
      return "Unknown Pitch"; // Fallback in case of an error
    }
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const fetchPitches = async () => {
      const pitches = {};
      await Promise.all(
        data.map(async (nominee) => {
          if (nominee.pitch_nominee) {
            const pitchName = await getPitch(nominee.pitch_nominee.id);
            console.log(pitchName)
            
            pitches[nominee.pitch_nominee.id] = pitchName; // Store it with its ID as the key
          }
        })
      );
      console.log(pitches)
      setPitchNames(pitches); // Set all fetched pitch names in one go
    };

    if (data.length > 0) {
      fetchPitches(); // Fetch the pitch names after nominees are loaded
    }
  }, [data]);

  return (
    <Box p={5}>
      <Heading mb={4}>Nominees</Heading>
      <List spacing={3} overflow={"scroll"} height={"60vh"}>
        {data.map((nominee) => (
          <Box key={nominee.id} p={4} borderWidth={1} borderRadius="md" shadow="sm">
            <Text fontWeight="bold">
              {nominee.user_nominee
                ? nominee.user_nominee.full_name
                : nominee.business_nominee
                ? nominee.business_nominee.full_name
                : pitchNames[nominee.pitch_nominee?.id] || "Loading..."}
            </Text>
            <Text fontWeight="light">Category: {nominee.nominee_type}</Text>
            <Divider mt={2} />
            <Text>Votes: {nominee.votes_count}</Text>
          </Box>
        ))}
      </List>
    </Box>
  );
};

export default Nominees;
