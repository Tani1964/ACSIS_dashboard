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
import Login from "./screens/Login";
import { useAuth } from "./context/AuthContext";
import Businesses from "./screens/Businesses";
import Technical from "./screens/Technical";
import ScheduledMeetings from "./screens/ScheduledMeetings";
import Awards from "./screens/Awards";
import Nominees from "./screens/Nominees";
import AccessDenied from "./screens/AccessDenied";
import Sponsors from "./screens/Sponsors";
import Terms from "./screens/Privacy";
import DeleteAccount from "./screens/Delete";

const isAuthenticated = () => {
  const { authState } = useAuth();
  return authState.token ? true : false;
};

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const Screens = () => {
  return (
    <Flex overflowX={"clip"}>
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
            <Route path="/pitch/technical/:id" element={<ProtectedRoute element={<Technical />} />} />
            <Route path="/notifications" element={<ProtectedRoute element={<Notifications />} />} />
            <Route path="/scheduledMeetings" element={<ProtectedRoute element={<ScheduledMeetings />} />} />
            <Route path="/awards" element={<ProtectedRoute element={<Awards />} />} />
            <Route path="/awards/nominees/:id" element={<ProtectedRoute element={<Nominees />} />} />
            <Route path="/sponsors" element={<ProtectedRoute element={<Sponsors />} />} />
            <Route path="/access-denied" element={<ProtectedRoute element={<AccessDenied />} />} />
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
          {/* Unprotected Privacy Route */}
          <Route path="/privacy" element={<Terms />} />
          <Route path="/delete" element={<DeleteAccount />} />

          {/* Protected Screens */}
          <Route path="/*" element={<Screens />} />

          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
