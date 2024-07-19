import { Box, Button, Text, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PitchOptions from "../components/PitchOptions";
import { useAuth, axi } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";


const Professional = () => {
  const { id } = useParams();
  const Navigator = useNavigate();
  console.log(id);
  const [data, setData] = useState({});
  const { setAuthInfo, setUserInfo, user, authState } = useAuth();
  const [status, setStatus] = useState("")

  const headers = { Authorization: `Bearer ${authState.token}` };
  const fetchData = async() => {
    const response = await axi.get(`/admin/get-pitch/${id}`,{headers} )
    setData(response.data.pitch.professional_background)
    setStatus(response.data.pitch.review_status)
    console.log(id)
  }

  useEffect(()=>{
    
    fetchData()
  }, [])
  return (
    <Box>
        <PitchOptions id={id} route={"professional"} state={status}/>
        <Box overflowY={"scroll"} height={"50vh"} paddingLeft={4}>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Current Occupation:
          </Heading>
          <Text>{data.current_occupation}</Text>
        </Box>
        <Box mb={4} display={"flex"} gap={4}>
          <Heading as="h6" size="sm">
            Linkedln Url:
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
