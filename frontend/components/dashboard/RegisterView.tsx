"use client"
import { motion } from "motion/react"
import { useState, useRef, ChangeEvent } from "react"
import { Copy, Check } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useAuth } from "@/context/AuthContext"

export default function RegisterView() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const inputRef = useRef<Record<string, string | boolean>>({});

  const [created, setCreated] = useState<{ shortUrl: string } | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    inputRef.current[name] = value;
  };

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    inputRef.current.isProtected = isPasswordProtected;
    if (!isPasswordProtected) inputRef.current.password = "";

    try {
      const res = await fetch(`${backendUrl}/mapping/shorten/${user.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputRef.current),
      });

      if (res.ok) {
        const data = await res.json();
        setCreated(data);
      } else {
        const data = await res.json();
        alert("URL creation failed\n" + data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-full bg-[#111]"
    >
    
      <h1 className="font-heading text-2xl  font-bold tracking-tight text-white mb-2 text-center">
        Register a new URL
      </h1>
      <p className="text-sm text-gray-300 mb-6 text-center">
        Create a new short link for your destination.
      </p>

      {!created?.shortUrl ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl  mx-auto bg-[#222] rounded-lg p-3">
          <div className="flex flex-col gap-1.5 p-2 pl-4 ">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Destination URL
            </label>
            <input
              type="url"
              name="url"
              placeholder="https://your-long-url.com/path"
              required
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/15 px-0 py-2 text-sm text-white placeholder:text-xs placeholder:text-gray-600 focus:outline-none focus:border-white/50 transition-colors"
            />
          </div>

          {/* Project / Name */}
          <div className="flex flex-col gap-1.5 p-2 pl-4">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Project / Name&nbsp;
              <span className="normal-case font-normal text-gray-600">(optional)</span>
            </label>
            <input
              type="text"
              name="projectName"
              placeholder="e.g. Summer Campaign"
              onChange={handleChange}
              className="w-full bg-transparent border-b border-white/15 px-0 py-2 text-sm text-white placeholder:text-xs placeholder:text-gray-600 focus:outline-none focus:border-white/50 transition-colors"
            />
          </div>

          {/* Password Protection toggle */}
          <div className="flex flex-col gap-3 mt-1 p-2 pl-4">
            <div className="flex items-center justify-between py-3 border-y border-white/10">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-white">Password Protection</span>
                <span className="text-xs text-gray-500">Require a password to access this URL</span>
              </div>
              <button
                type="button"
                aria-pressed={isPasswordProtected}
                onClick={() => setIsPasswordProtected(!isPasswordProtected)}
                className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors outline-none focus:ring-2 focus:ring-white/20 ${
                  isPasswordProtected ? "bg-white" : "bg-white/15"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transform transition-transform ${
                    isPasswordProtected
                      ? "translate-x-[18px] bg-black"
                      : "translate-x-0 bg-white/50"
                  }`}
                />
              </button>
            </div>

            {isPasswordProtected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex flex-col gap-1.5 overflow-hidden"
              >
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Set Password
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter a secure password"
                  required={isPasswordProtected}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-white/15 px-0 py-2 text-sm text-white placeholder:text-xs placeholder:text-gray-600 focus:outline-none focus:border-white/50 transition-colors"
                />
              </motion.div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-2 w-full text-center">
            <button
              type="submit"
              className="bg-white text-black text-sm font-semibold  rounded-full px-6 py-2.5 hover:bg-gray-200 transition-all shadow-[0_0_18px_rgba(255,255,255,0.08)]"
            >
              Shorten URL
            </button>
          </div>
        </form>
      ) : (
       
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
          
          <div className="flex items-center gap-4 mb-8 pb-5 border-b border-white/10">
            <span className="font-mono text-sm text-white tracking-tight break-all">
              {created.shortUrl}
            </span>
            <button
              className="text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors ml-auto shrink-0"
              onClick={() => {
                navigator.clipboard.writeText(created.shortUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied
                ? <Check size={16} className="text-green-400" />
                : <Copy size={16} />}
              <span className="text-xs font-semibold uppercase tracking-wider">
                {copied ? "Copied" : "Copy"}
              </span>
            </button>
          </div>

          {/* QR Code */}
          <div className="mb-8 w-fit">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
              QR Code
            </h4>
            <div className="bg-white p-3 rounded-xl w-max">
              <QRCodeSVG value={created.shortUrl} size={110} />
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">Scan to test your URL</p>
          </div>
          <button
            onClick={() => {
              setCreated(null);
              inputRef.current = {};
            }}
            className="text-white text-xs font-semibold uppercase tracking-widest hover:text-gray-300 transition-colors flex items-center gap-2"
          >
            ← Create Another
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
