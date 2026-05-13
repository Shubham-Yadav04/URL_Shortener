"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  username: string;
  email: string;
  // Add other user fields as needed
}
export type ProjectDetail={
  id:number;
  name:string;
  shortUrl:string
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  projectDetail:ProjectDetail[] | null;
  login: (userData: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  setProjectDetail:React.Dispatch<React.SetStateAction<ProjectDetail[] | null>>;
  getAllMapping:()=>Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = "http://localhost:8080";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [projectDetail,setProjectDetail] = useState<ProjectDetail[] |  null>(null)

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
    const response = await axios.get(`${BACKEND_URL}/mapping/user/${user?.id}`,{
      withCredentials:true,
    });
    if(response.status===200){
      setProjectDetail(response.data);
    }else{
      setProjectDetail([]);
    }
  }catch(error){
    console.error("Mapping fetch failed:",error);
    setProjectDetail([]);
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
    setProjectDetail([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        projectDetail,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
        setProjectDetail,
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
