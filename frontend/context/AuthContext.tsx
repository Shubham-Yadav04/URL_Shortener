"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  username: string;
  email: string;
  // Add other user fields as needed
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  mapping:any[];
  login: (userData: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setMapping:React.Dispatch<React.SetStateAction<any[]>>;
  getAllMapping:()=>Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = "http://localhost:8080";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mapping,setMapping]= useState<any[]>([]);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/user/me`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data);
        console.log("User data:", response.data);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
const getAllMapping = async()=>{
  try{
    const response = await axios.get(`${BACKEND_URL}/mapping/${user?.id}`,{
      withCredentials:true,
    });
    if(response.status===200){
      setMapping(response.data);
      console.log("Mapping data:",response.data);
    }else{
      setMapping([]);
    }
  }catch(error){
    console.error("Mapping fetch failed:",error);
    setMapping([]);
  }
}
  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    // Implement backend logout if available
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
         mapping,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
        setMapping,
        getAllMapping
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
