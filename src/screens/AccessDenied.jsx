import React from "react";
import { Box, Heading, Text, Button, Flex } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <Flex
      height="100vh"
      justifyContent="center"
      alignItems="center"
      bg="gray.50"
      padding="4"
    >
      <Box
        textAlign="center"
        bg="white"
        p={8}
        rounded="md"
        boxShadow="lg"
        maxWidth="400px"
        width="100%"
      >
        <Heading as="h2" size="lg" mb={4} color="red.600">
          Access Denied
        </Heading>
        <Text fontSize="md" mb={6}>
          Access denied. Please use a desktop client.
        </Text>
        <Button colorScheme="teal" onClick={handleBackToLogin}>
          Back to Login
        </Button>
      </Box>
    </Flex>
  );
};

export default AccessDenied;
