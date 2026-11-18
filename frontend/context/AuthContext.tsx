"use client";

import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { BACKEND_URL } from "@/lib/backend";

interface User {
  userId: string;
  username: string;
  email: string;
  hasPassword: boolean;
}
export type ProjectDetail={
  mappingId:number;
  name:string;
  shortUrl:string;
  expiresAt:string | null;
  active:boolean;
  uniqueViews:number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  projectDetail:ProjectDetail[] | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setProjectDetail:React.Dispatch<React.SetStateAction<ProjectDetail[] | null>>;
  getAllMapping:()=>Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [projectDetail,setProjectDetail] = useState<ProjectDetail[] |  null>(null)

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/user/me`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const getAllMapping = useCallback(async () => {
  if (!user) {
    setProjectDetail([]);
    return;
  }
  try{
    const response = await axios.get(`${BACKEND_URL}/mapping/user`,{
      withCredentials:true,
    });
    if(response.status===200){
      setProjectDetail(response.data);
    }else{
      setProjectDetail([]);
    }
  }catch{
    setProjectDetail([]);
  }
  }, [user]);
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = (userData: User) => {
    setUser(userData);
  };
  
  const logout = useCallback(async () => {
    await axios.post(`${BACKEND_URL}/user/logout`, {}, { withCredentials: true });
    setUser(null);
    setProjectDetail([]);
  }, []);

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
