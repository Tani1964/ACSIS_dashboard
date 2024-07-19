import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Avatar,
  Text,
  VStack,
  HStack,
  Divider,
  Icon,
  Link,
} from "@chakra-ui/react";
import { FiHome, FiCalendar, FiSettings, FiArrowRight } from "react-icons/fi";
import { FaLightbulb, FaBuilding } from "react-icons/fa";
import { useAuth, axi } from "../context/AuthContext";
import { Link as RouterLink } from "react-router-dom";

const Sidebar = () => {
  const [user, setUser] = useState({});
  const { nav, setNav, setUserInfo } = useAuth();

  useEffect(() => {
    const getUser = async () => {
      const token = await localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axi.get("/admin/get-user", { headers });
      setUser(response.data.user);
    };
    getUser();
  }, [setUserInfo]);

  const links = [
    { name: "Dashboard", icon: FiHome, to: "/", key: "dashboard" },
    { name: "Pitches", icon: FaLightbulb, to: "/pitches", key: "pitches" },
    { name: "Events", icon: FiCalendar, to: "/events", key: "events" },
    { name: "Businesses", icon: FaBuilding, to: "/businesses", key: "businesses" },
    { name: "Personnel", icon: FiSettings, to: "/personnel", key: "personnel" },
  ];

  const linkStyle = {
    display: "flex",
    alignItems: "center",
    paddingX: 2,
    paddingY: 2,
    cursor: "pointer",
    width: "100%",
    borderRadius: "md",
    justifyContent: "space-between",
  };

  return (
    <ChakraProvider>
      <Flex h="100vh" bg="gray.50">
        <Box
          w="250px"
          p="5"
          bg="white"
          shadow="md"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <VStack spacing="5" align="start">
            <HStack spacing="3">
              <Avatar
                name={user.full_name}
                color={"#25B161"}
                backgroundColor={"#E0FFED"}
              />
              <Box>
                <Text fontSize={14} fontWeight="bold">
                  {user.full_name}
                </Text>
                <Text fontSize={12} color="gray.500">
                  {user.email}
                </Text>
              </Box>
            </HStack>

            <Divider />

            <VStack spacing="3" align="start">
              {links.slice(0, 4).map((link) => (
                <Link
                  as={RouterLink}
                  to={link.to}
                  key={link.key}
                  {...linkStyle}
                  onClick={() => setNav(link.key)}
                  color={nav === link.key ? "#25B161" : "gray"}
                  backgroundColor={nav === link.key ? "#E0FFED" : null}
                  border={nav === link.key ? "1px solid #25B161" : null}
                >
                  <Box display="flex" alignItems="center">
                    <Icon as={link.icon} mr="3" />
                    <Text>{link.name}</Text>
                  </Box>
                  {nav === link.key && <Icon as={FiArrowRight} ml="auto" />}
                </Link>
              ))}
            </VStack>
          </VStack>

          {user.role === "superadmin" && (
            <VStack spacing="3" align="start">
              <Divider />
              {links.slice(4).map((link) => (
                <Link
                  as={RouterLink}
                  to={link.to}
                  key={link.key}
                  {...linkStyle}
                  onClick={() => setNav(link.key)}
                  color={nav === link.key ? "#25B161" : "gray"}
                  backgroundColor={nav === link.key ? "#E0FFED" : null}
                  border={nav === link.key ? "1px solid #25B161" : null}
                >
                  <Box display="flex" alignItems="center">
                    <Icon as={link.icon} mr="3" />
                    <Text>{link.name}</Text>
                  </Box>
                  {nav === link.key && <Icon as={FiArrowRight} ml="auto" />}
                </Link>
              ))}
            </VStack>
          )}
        </Box>
      </Flex>
    </ChakraProvider>
  );
};

export default Sidebar;
