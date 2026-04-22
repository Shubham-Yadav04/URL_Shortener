"use client";

import Link from "next/link";
import { ArrowRight, Mail, Lock } from "lucide-react";
import axios from "axios";

import { useRouter } from "next/navigation";
import { useState } from "react";


export default function LoginForm() {
  const backendURL="http://localhost:8080/user/login"
  const googleAuthURL="http://localhost:8080/user/google"
  const router= useRouter();
  const [error,setError] = useState<string>();
  
  const handleLogin=async(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault()
    setError(""); // Clear previous errors
    const formData= new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    if (!data.email || !data.password) {
      setError("Every field is compulsory");
      return;
    }

    try{
      const res= await axios.post(backendURL,{
        email:data.email,
        password: data.password
      },{withCredentials:true});
      
      if(res.status===200){
        router.push('/dashboard')
      } else {
        setError(res.data || "Login failed");
      }
    } catch(err:any){
      console.log(err);
      setError(err.response?.data || err.message || "An error occurred");
    }
  }

  const handleGoogleLogin = () => {
    window.location.href = googleAuthURL;
  };

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center mb-2">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h2>
        <p className="text-sm text-gray-400">Log in to manage your short links.</p>
      </div>

      <div className="flex flex-col gap-4">
        <button 
          onClick={handleGoogleLogin}
          className="w-full bg-white/5 border border-white/10 rounded-xl py-4 flex items-center justify-center gap-3 text-white hover:bg-white/10 transition-all font-medium"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-neutral-900 px-2 text-gray-500">Or continue with</span>
          </div>
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="email" 
              name='email'
              placeholder="Email Address" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all font-sans"
              required 
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="password" 
              name='password'
              placeholder="Password" 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all font-sans"
              required 
            />
          </div>
          
          <div className="flex justify-between items-center px-1 mb-2">
            <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
              <input type="checkbox" className="rounded bg-white/5 border-white/10" />
              Remember me
            </label>
            <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">Forgot password?</Link>
          </div>

          {error && <p className="text-red-500 text-sm w-full text-center">{error}</p>}

          <button type="submit" className="w-full bg-white text-black font-semibold rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-gray-200 transition-all group">
            Log In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-gray-400 mt-2">
        Don't have an account? <Link href="/signup" replace className="text-white font-medium hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
