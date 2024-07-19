import { Box, ChakraProvider, Flex } from "@chakra-ui/react";
import Sidebar from "./components/Sidebar";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";

// Screens
import Dashboard from "./screens/Dashboard";
import Pitches from "./screens/Pitches";
import Events from "./screens/Events";
import Support from "./screens/Support";
import Personnel from "./screens/Personnel";
import Personal from "./screens/Personal";
import Professional from "./screens/Professional";
import Competition from "./screens/Competition";
import Notifications from "./screens/Notifications";
import Login from "./screens/Login"
import { useAuth } from "./context/AuthContext";
import Businesses from "./screens/Businesses";
import Technical from "./screens/Technical"

const isAuthenticated = () => {
  // Replace this with your actual authentication logic
  const {authState} = useAuth();
  return authState.authenticated;
};

const ProtectedRoute = ({ element }) => {
  console.log(isAuthenticated())
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const Screens = () => {
  return (
    <Flex  overflowX={"clip"}>
      <Sidebar />
      <Box flex="1">
        <Header />
        <Box p="2" overflowY={"clip"} height={"80vh"}>
          <Routes>
            <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/pitches" element={<ProtectedRoute element={<Pitches />} />} />
            <Route path="/businesses" element={<ProtectedRoute element={<Businesses />} />} />
            <Route path="/events" element={<ProtectedRoute element={<Events />} />} />
            <Route path="/personnel" element={<ProtectedRoute element={<Personnel />} />} />
            <Route path="/support" element={<ProtectedRoute element={<Support />} />} />
            <Route path="/pitch/:id" element={<ProtectedRoute element={<Personal />} />} />
            <Route path="/pitch/professional/:id" element={<ProtectedRoute element={<Professional />} />} />
            <Route path="/pitch/competition/:id" element={<ProtectedRoute element={<Competition />} />} />
            <Route path="/pitch/technical/:id" element={<ProtectedRoute element={<Technical/>} />} />
            <Route path="/notifications" element={<ProtectedRoute element={<Notifications />} />} />
          </Routes>
        </Box>
      </Box>
    </Flex>
  );
};

const App = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Screens />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
