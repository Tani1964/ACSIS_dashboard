import React from 'react';
import { Box, Heading, Text, Flex, Button } from "@chakra-ui/react";
import { Link, useNavigate } from 'react-router-dom';
import { axi, useAuth } from '../context/AuthContext';

const PitchOptions = ({ route, id, state }) => {
  const { authState } = useAuth();
  const navigate = useNavigate();

  const changeStatus = async (status, pitchId) => {
    try {
      const headers = { Authorization: `Bearer ${authState.token}` };
      await axi.patch(
        "/admin/review-pitch",
        { pitchId: pitchId, reviewStatus: status },
        { headers }
      );
      navigate("/pitches");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Flex className='justify-between px-4 pt-4 gap-2 '>
      <Flex gap={4} paddingY={3}>
        <Text as={Link} to={`/pitch/${id}`} className={route === "personal" ? "text-[#196100] border-b-2 border-b-[#196100] pb-4" : ""}>
          Personal information
        </Text>
        <Text as={Link} to={`/pitch/professional/${id}`} className={route === "professional" ? "text-[#196100] border-b-2 border-b-[#196100] pb-4" : ""}>
          Professional background
        </Text>
        <Text as={Link} to={`/pitch/competition/${id}`} className={route === "competition" ? "text-[#196100] border-b-2 border-b-[#196100] pb-4" : ""}>
          Competition questions
        </Text>
        <Text as={Link} to={`/pitch/technical/${id}`} className={route === "technical" ? "text-[#196100] border-b-2 border-b-[#196100] pb-4" : ""}>
          Technical Agreements
        </Text>
      </Flex>
      {state !== "approved"||"denied"&&<Flex gap={4}>
        <Button color={"white"} colorScheme='green' onClick={() => changeStatus("approved", id)}>Approve Pitch</Button>
        <Button borderWidth={1} borderColor={"grey"} onClick={() => changeStatus("declined", id)}>Decline Pitch</Button>
      </Flex>}
    </Flex>
  );
};

export default PitchOptions;
