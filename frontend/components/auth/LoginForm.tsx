"use client";

import Link from "next/link";
import { ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginForm() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center mb-2">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h2>
        <p className="text-sm text-gray-400">Log in to manage your short links.</p>
      </div>

      <form className="flex flex-col gap-4">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all font-sans"
            required 
          />
        </div>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="password" 
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

        <button type="submit" className="w-full bg-white text-black font-semibold rounded-xl py-4 flex items-center justify-center gap-2 hover:bg-gray-200 transition-all group">
          Log In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-2">
        Don't have an account? <Link href="/signup" className="text-white font-medium hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
