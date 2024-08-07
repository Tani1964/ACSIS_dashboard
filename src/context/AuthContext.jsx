import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export const AuthContext = createContext();

export const axi = axios.create({
  baseURL: "http://ec2-16-170-223-254.eu-north-1.compute.amazonaws.com/api/v1", // Replace with your actual base URL
  // baseURL: "https://1e2d-197-210-29-244.ngrok-free.app/api/v1", // Replace with your actual base URL
});

// Custom hook to use Auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem(TOKEN_KEY) || null,
    authenticated: !!localStorage.getItem(TOKEN_KEY),
  });
  const [user, setUser] = useState(JSON.parse(localStorage.getItem(USER_KEY)) || null);

  const [nav, setNav] = useState("")

  useEffect(()=>setNav("Dashboard"),[])

  // Set up Axios interceptor to attach token to requests
  useEffect(() => {
    const requestInterceptor = axi.interceptors.request.use((config) => {
      if (authState.token) {
        config.headers.Authorization = `Bearer ${authState.token}`;
      }
      return config;
    });

    return () => {
      axi.interceptors.request.eject(requestInterceptor);
    };
  }, [authState.token]);

  // Function to update auth state and store token in localStorage
  const setAuthInfo = (token) => {
    setAuthState({
      token,
      authenticated: !!token,
    });
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  };

  const setUserInfo = (user) => {
    setUser(user);
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthInfo, user, setUserInfo, nav, setNav }}>
      {children}
    </AuthContext.Provider>
  );
};
