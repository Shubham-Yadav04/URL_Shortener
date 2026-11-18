"use client";

import Link from "next/link";
import { ArrowRight, Mail, Lock } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { BACKEND_URL } from "@/lib/backend";

export default function LoginForm() {
  const backendURL = `${BACKEND_URL}/user/login`;
  const googleAuthURL = `${BACKEND_URL}/oauth2/authorization/google-login`;
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    if (!data.email || !data.password) {
      setError("Please fill in both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        backendURL,
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        login(res.data);
        router.replace("/dashboard");
      } else {
        setError(res.data || "Authentication failed");
      }
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? typeof err.response?.data === "string"
          ? err.response.data
          : err.message
        : "An error occurred during authentication.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = googleAuthURL;
  };

  return (
    <div className="w-full flex flex-col gap-5 text-[#141413] dark:text-[#f5f5f2]">
      <div className="text-center mb-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
          AUTHENTICATION
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-[#141413] dark:text-[#f5f5f2] mt-1 mb-1">
          Welcome Back
        </h2>
        <p className="text-xs text-[#6e6d66] dark:text-[#8e8d86] font-light">
          Sign in to manage your shortened links and telemetry.
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full bg-[#faf8f5] dark:bg-[#18181d] border border-[#e6e3da] dark:border-[#232329] rounded-xl py-3 px-4 flex items-center justify-center gap-2.5 text-xs font-semibold text-[#141413] dark:text-[#f5f5f2] hover:bg-[#f4f2ea] dark:hover:bg-[#202026] transition-all shadow-xs"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative my-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e6e3da] dark:border-[#232329]" />
          </div>
          <div className="relative flex justify-center text-[10px] font-mono uppercase">
            <span className="bg-white dark:bg-[#121215] px-2 text-[#8e8d86]">
              Or continue with email
            </span>
          </div>
        </div>

        <form className="flex flex-col gap-3.5" onSubmit={handleLogin}>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e8d86]" size={16} />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              className="w-full bg-[#faf8f5] dark:bg-[#18181d] border border-[#e6e3da] dark:border-[#232329] rounded-xl pl-10 pr-4 py-3 text-sm text-[#141413] dark:text-[#f5f5f2] placeholder-[#8e8d86] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e8d86]" size={16} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full bg-[#faf8f5] dark:bg-[#18181d] border border-[#e6e3da] dark:border-[#232329] rounded-xl pl-10 pr-4 py-3 text-sm text-[#141413] dark:text-[#f5f5f2] placeholder-[#8e8d86] focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-sans"
              required
            />
          </div>

          {error && (
            <p role="alert" className="text-xs text-red-500 text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#141413] text-white dark:bg-white dark:text-black font-semibold text-xs uppercase tracking-wider hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all shadow-xs flex items-center justify-center gap-2 group mt-1"
          >
            {isLoading ? "Signing In..." : "Sign In"}
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>

      <p className="text-center text-xs text-[#6e6d66] dark:text-[#8e8d86] pt-1">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          replace
          className="font-semibold text-[#141413] dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors underline underline-offset-2"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
