import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#030303] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="w-full max-w-md bg-[#0a0a0c] border border-white/10 p-10 rounded-3xl z-10">
        <div className="mb-10 text-center">
            <span className="font-heading font-extrabold text-2xl tracking-tighter text-white">
              Shorten.it
            </span>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
