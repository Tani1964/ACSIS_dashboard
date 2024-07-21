import { Box, Flex, Image, Input, Button, Heading, FormControl, FormLabel, FormErrorMessage, Text, Checkbox, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import LeftImg from "../assets/images/Frame 3.svg"; // replace with the appropriate image path
import { axi } from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Add loading state
  const { setAuthInfo, setUserInfo } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const newErrors = {};
    if (!email) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true); // Show loader

    try {
      const formData = { email, password };
      const response = await axi.post("/auth/login", formData);
      setAuthInfo(response.data.token);
      setUserInfo(response.data.user); // Assuming the user info is part of the response
      if (response.data.isAdmin) {
        navigate("/");
      } else {
        alert("You're not permitted to access this page");
      }
    } catch (error) {
      if (!error.response) {
        // Network error
        alert("Network error: Please check your internet connection.");
      } else if (error.response.status === 401) {
        // Reauthorization error
        alert("Unauthorized: Invalid email or password.");
      }else if (error.response.status === 422) {
        // Reauthorization error
        alert("Unauthorized: Invalid email or password.");
      } else {
        // Other errors
        alert("An error occurred: " + error.response.data.message);
      }
      console.error("Failed to login:", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <Flex height="100vh" width="100vw" overflowY={"clip"} flexDirection={["column", "row"]}>
      <Flex
        flex="1"
        align="center"
        justify="center"
        p={8}
        flexDirection="column"
        bg="white"
        borderRight="1px solid #E2E8F0"
      >
        <Box mb={6} textAlign="center">
          <Heading size="lg" mb={2}>Sign in</Heading>
          <Text>Please enter your details to sign in</Text>
        </Box>
        <FormControl id="email" isInvalid={errors.email} mb={3}>
          <FormLabel>Email Address</FormLabel>
          <Input 
            placeholder="Email Address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            aria-label="Email Address" 
          />
          {errors.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
        </FormControl>
        <FormControl id="password" isInvalid={errors.password} mb={3}>
          <FormLabel>Password</FormLabel>
          <Input 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            aria-label="Password" 
          />
          {errors.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
        </FormControl>
        <Flex justify="space-between" mb={6} width="100%">
          <Checkbox>Remember me</Checkbox>
          {/* <Button variant="link" colorScheme="teal">Forgot password?</Button> */}
        </Flex>
        <Button colorScheme="green" width="100%" mb={3} onClick={handleLogin} isLoading={loading}>
          Sign in
        </Button>
      </Flex>
      <Flex flex="1" align="center" justify="center" p={8} bg="gray.50">
        <Box textAlign="center">
          <Image src={LeftImg} alt="Visual Representation" mt={20} height={"100vh"} /> {/* Ensure the image path is correct */}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Login;
