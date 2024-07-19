import React, { useState } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  Button,
  CloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const mockNotifications = [
  {
    id: 1,
    title: "System Update",
    description: "The system will be updated tonight at 12 AM.",
    type: "info",
  },
  {
    id: 2,
    title: "New Message",
    description: "You have received a new message from John.",
    type: "success",
  },
  {
    id: 3,
    title: "Account Alert",
    description: "Your account password will expire in 3 days.",
    type: "warning",
  },
  {
    id: 4,
    title: "Server Down",
    description: "The server is currently down. Please try again later.",
    type: "error",
  },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleDismiss = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
  };

  return (
    <Box className="px-8 py-4">
      <Heading>Notifications</Heading>
      <Text color={"grey"}>You have {notifications.length} notifications.</Text>

      <Box mt={5}>
        {notifications.map((notification) => (
          <Alert status={notification.type} mb={4} key={notification.id}>
            <AlertIcon />
            <Flex flex="1" justifyContent="space-between">
              <Box>
                <AlertTitle>{notification.title}</AlertTitle>
                <AlertDescription>{notification.description}</AlertDescription>
              </Box>
              <CloseButton
                onClick={() => handleDismiss(notification.id)}
                alignSelf="flex-start"
              />
            </Flex>
          </Alert>
        ))}
      </Box>
    </Box>
  );
};

export default Notifications;
