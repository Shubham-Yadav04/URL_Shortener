import SignupForm from "@/components/auth/SignupForm";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-[#09090b] text-[#141413] dark:text-[#f5f5f2] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden paper-texture">
      {/* Top Header Row */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between max-w-4xl mx-auto z-20">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-lg bg-[#141413] dark:bg-white text-white dark:text-black flex items-center justify-center font-serif text-sm font-bold">
            S.
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight text-[#141413] dark:text-[#f5f5f2]">
            Shorten<span className="text-emerald-600 dark:text-emerald-400">.it</span>
          </span>
        </Link>
        <ThemeToggle variant="icon" />
      </div>

      {/* Ambient Glow */}
      <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />

      {/* Auth Card */}
      <div className="w-full max-w-md bg-white dark:bg-[#121215] border border-[#e6e3da] dark:border-[#232329] p-7 sm:p-10 rounded-3xl z-10 shadow-xl transition-all">
        <SignupForm />
      </div>
    </div>
  );
}
