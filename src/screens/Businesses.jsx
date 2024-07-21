import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Th,
  Td,
  Tr,
  Heading,
  Text,
  Flex,
  Button,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
  Center
} from "@chakra-ui/react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { axi } from "../context/AuthContext";


const Businesses = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState([]);
  const [pitch, setPitch] = useState([]);
  const { authState } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const headers = { Authorization: `Bearer ${authState.token}` };
        const response = await axi.get("/admin/get-businesses", { headers });
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [authState.token]);

  if (loading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }


  return (
    <Box className="px-6 py-4">
      <Box>
        <Heading>Businesses</Heading>
        <Text color={"grey"}>
          An overview of all businesses
        </Text>
        <Flex className="flex flex-row justify-between mt-5 py-4">
          <Text color={"grey"} fontWeight={20}>
            {data.length} Businesses
          </Text>
        </Flex>
      </Box>

      <Box overflowY="auto" maxHeight="55vh">
        <Table>
          <TableCaption>Businesses</TableCaption>
          <Thead
            position="sticky"
            top="0"
            bg="white"
            zIndex="1"
            roundedTop={10}
          >
            <Tr className="bg-[#F6F7FB] border border-[#EAECF0]">
              <Th>S/N</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Owner</Th>
              <Th>Owner Email</Th>
              <Th>Date Created</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {data.map((data, index) => (
              <Tr key={data.id}>
                <Td>{index + 1}</Td>
                <Td>{data.business_name}</Td>
                <Td>{data.business_description}</Td>
                <Td>
                  {data.business_owner_name}
                  
                </Td>
                <Td>
                  {data.business_owner_email}
                  
                </Td>
                <Td>{new Date(
              data.created_at
            ).toLocaleDateString()}</Td>
                
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default Businesses;
