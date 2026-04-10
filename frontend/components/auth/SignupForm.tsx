"use client";

import Link from "next/link";
import { ArrowRight, Mail, Lock, User } from "lucide-react";

export default function SignupForm() {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="text-center mb-2">
        <h2 className="font-heading text-3xl font-bold tracking-tight text-white mb-2">Create Account</h2>
        <p className="text-sm text-gray-400">Join Shorten.it and start tracking.</p>
      </div>

      <form className="flex flex-col gap-4">
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Full Name" 
            className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/30 transition-all font-sans"
            required 
          />
        </div>
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

        <button type="submit" className="w-full bg-white text-black font-semibold rounded-xl py-4 mt-2 flex items-center justify-center gap-2 hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all group">
          Sign Up <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-2">
        Already have an account? <Link href="/login" className="text-white font-medium hover:underline">Log in</Link>
      </p>
    </div>
  );
}
