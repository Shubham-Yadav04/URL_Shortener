"use client"
import { motion } from "motion/react"
import { useState,useRef, ChangeEvent } from "react"
import { Copy, Check, AlertTriangle } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
export default function RegisterView() {
  const [copied, setCopied] = useState(false);
 const inputRef=useRef<any>({});
 const [created, setCreated] = useState<{ shortUrl: string } | null>(null);
  const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    
    const { name, value } = e.target;
    if(inputRef.current){
        inputRef.current[name] = value;
    }
  };
const backendUrl= process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if(inputRef.current){
        inputRef.current.isProtected=isPasswordProtected;
        if(!isPasswordProtected) inputRef.current.password=""
    }
    try{

    const res=await fetch(`${backendUrl}/mapping/shorten/{userId}`,{
        method:"POST",
        headers:{
            "Content-Type":"application/json"

        },
        body:JSON.stringify(inputRef.current)
    })
    if(res.ok){
        const data=await res.json();
        setCreated(data);
        alert("Url successFully Created \n"+data.shortUrl)
    }
    else{
        const data=await res.json();
        alert("Url creation failed \n"+data.message)
    }
    }
catch(err){
    console.log(err);
}
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-2xl">
      <h1 className="font-heading text-2xl font-bold tracking-tight text-white mb-2">Register a new URL</h1>
      <p className="text-sm text-gray-400 mb-8">Create a new short link for your destination.</p>
      
      {!inputRef.current ? (
        <form onSubmit={handleSubmit}  className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Destination URL</label>
            <input type="url" placeholder="https://your-long-url.com/path" className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-2 text-white text-xl placeholder-gray-700 focus:outline-none focus:ring-0 focus:border-white transition-all" required name="url" onChange={(e)=>handleChange(e)}/>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Project / Name (Optional)</label>
            <input type="text" placeholder="e.g. Summer Campaign" className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-2 text-white text-xl placeholder-gray-700 focus:outline-none focus:ring-0 focus:border-white transition-all" name="projectName" onChange={(e)=>handleChange(e)}/>
          </div>

          <div className="flex flex-col gap-4 mt-2 transition-all">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex flex-col gap-1">
                <span className="text-base font-medium text-white pointer-events-none">Password Protection</span>
                <span className="text-sm text-gray-500 pointer-events-none">Require a password to access this URL</span>
              </div>
              <button 
                type="button"
                onClick={() => setIsPasswordProtected(!isPasswordProtected)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors outline-none focus:ring-2 focus:ring-white/30 ${isPasswordProtected ? 'bg-white' : 'bg-white/20'}`}
              >
                <div className={`w-4 h-4 rounded-full transform transition-transform ${isPasswordProtected ? 'translate-x-[22px] bg-black' : 'translate-x-0 bg-white/60'}`} />
              </button>
            </div>
            
            {isPasswordProtected && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="flex flex-col gap-2 pt-2 overflow-hidden">
                <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Set Password</label>
                <input type="password" placeholder="Enter secure password" required={isPasswordProtected} className="w-full bg-transparent border-0 border-b border-white/20 px-0 py-2 text-white text-xl placeholder-gray-700 focus:outline-none focus:ring-0 focus:border-white transition-all" 
                name="password" 
            onChange={(e)=> handleChange(e)}
                />
              </motion.div>
            )}
          </div>

          <div className="pt-6">
            <button type="submit" className="bg-white text-black font-semibold rounded-full px-8 py-3 hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Shorten URL
            </button>
          </div>
        </form>
      ) : (

        created?.shortUrl &&<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4">
          <div className="flex items-center gap-4 mb-10 pb-6 border-b border-white/10">
            <span className="font-mono text-white text-xl tracking-tight">{created.shortUrl}</span>
            <button 
              className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors ml-auto"
              onClick={() => {
  navigator.clipboard.writeText(created.shortUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} />}
              <span className="text-sm font-medium uppercase tracking-wider">{copied ? "Copied" : "Copy"}</span>
            </button>
          </div>
          
           <div className="mb-10 w-fit">
            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">QR Code</h4>
            <div className="bg-white p-4 rounded-2xl w-max">
              <QRCodeSVG value={created.shortUrl } size={120} />
            </div>
            <p className="text-xs text-gray-500 mt-4 font-medium">Scan to test your URL</p>
          </div>


          <button onClick={() => setCreated(null)} className="text-white text-sm font-semibold uppercase tracking-wider hover:text-gray-300 transition-colors flex items-center gap-2">
            ← Create Another
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
