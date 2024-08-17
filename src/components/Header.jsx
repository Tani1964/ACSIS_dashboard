import {
  Kbd,
  Card,
  Flex,
  Box,
  Text,
  Input,
  IconButton,
  Icon,
  Avatar,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { FiSearch, FiBell } from "react-icons/fi";
import Logo from "../assets/images/logo.png";
import { Link } from "react-router-dom";
import { BiBell, BiUser, BiLogOut, BiUserVoice } from "react-icons/bi";
import { useAuth, axi } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";



const Header = () => {
  const [user, setUser] = useState({})
  const {setAuthInfo, setUserInfo, authState} = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    const getUser = async () => {
      try {
        const token = await localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axi.get("/admin/get-user", { headers });
        setUser(response.data.user);
      } catch (e) {
        if (e.response?.status === 401) {
          setAuthInfo(null);
          navigate("/login");
        } else if (e.response?.status === 403 && e.response.data.message === "Access denied. Please use a desktop client.") {
          // Handle the 403 error specifically
          console.error("Access denied. Please use a desktop client.");
          // Optionally, navigate to a different page or show a message to the user
          navigate("/access-denied"); // Example
        } else {
          console.error("An unexpected error occurred:", e);
        }
      }
    };
    getUser();
  }, [setUserInfo]);
  

  const handleLogout = async() =>{
    setAuthInfo(null)
  }
  return (
    <Card>
      <Flex
        as="header"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        padding="4"
        boxShadow="md"
      >
        <Flex alignItems="center">
          <img src={Logo} className="h-10 border-white-4" />
        </Flex>

        <Flex alignItems="" className="gap-4 items-center">
          <Flex className="bg-gray-100 py-2 px-4 items-center border-2 border-gray-200 rounded-lg">
          <FiSearch className="h-5 w-8"/>
            <Input disabled placeholder="Search..." maxW="200px" mr="2" size="sm" />
            <span className="flex h-fit gap-2">
              <Kbd className="bg-white h-fit">ctrl</Kbd>{" "}
              <Kbd className="bg-white h-fit">F</Kbd>
            </span>
          </Flex>
          {console.log(user?.full_name)}
          <Box p={4}>
              <Menu>
                <MenuButton>
                  <Avatar
                    size="sm"
                    name={user?.full_name}
                    
                    bg={"white"}
                    color={"green"}
                  />
                </MenuButton>

                <MenuList>
                  {/* <MenuItem>
                  <a href="/profile">Profile</a>
                </MenuItem> */}
                  {/* <MenuItem>
                    <BiBell /> <a href="/notifications">Notifications</a>
                  </MenuItem> */}
                  <MenuItem onClick={handleLogout}>
                    <BiLogOut /> Logout
                  </MenuItem>
                </MenuList>
              </Menu>
              </Box>
          
        </Flex>
      </Flex>
    </Card>
  );
};

export default Header;
