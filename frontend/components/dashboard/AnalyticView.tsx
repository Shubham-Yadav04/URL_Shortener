import { motion } from "motion/react"
import { useEffect, useState } from "react"
import { Copy, Check, BarChart3, Globe, Smartphone, MousePointerClick } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useAnalytic } from "@/context/AnalyticContext";
import { useAuth ,ProjectDetail} from "@/context/AuthContext";


export default function AnalyticsView({ id }: { id: string }) {
  const [urlData, setUrlData] = useState<any>(null);
const {projectSummary,setProjectSummary} = useAnalytic();
const BACKEND_URL="http://localhost:8080"
useEffect(()=>{

   const fetchProjectSummary=async()=>{
const urlData=await fetch(`${BACKEND_URL}/analytic/summary/${id}`,
  {credentials:"include"}
)
const data= await urlData.json();
if(data){
 setProjectSummary(prev=> [...prev,data])
  setUrlData({
    ...data
  });
}
else {
  const data={
    totalCount:0,
    topCountry:"Null",
    topDevice:"Null",
    projectName:"",
    id
  }
  setUrlData({
    ...data
  });
}
    }

  if(projectSummary==null || !projectSummary.some((project)=>project.id===id)){
        // fetch the project summary and set it up in the context window 
   
    fetchProjectSummary();

  }
  else {
    projectSummary?.forEach((project)=>{
    if(project.id==id){
      
  setUrlData({
    ...project
  });
    }
  })
}
},[id])

  if(urlData===null){
    return (
      <div className="w-full h-full flex justify-center items-center">
      <p className="text-center w-full  ">...loading</p>
      </div>
    )
  }
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-8">
      <div className="mb-2 pt-4 px-2">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-white mb-2">{urlData.projectName}</h1>
        <p className="text-sm text-gray-400 break-all">{urlData.longURL}</p>
      </div> 

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-1"><MousePointerClick size={16} /> Total Clicks</div>
              <div className="text-3xl font-bold text-white">{urlData.totalCount || 0}</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-1"><Globe size={16} /> Top Location</div>
              <div className="text-3xl font-bold text-white">{urlData.topCountry || "--"}</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-1"><Smartphone size={16} /> Device Type</div>
              <div className="text-3xl font-bold text-white">{urlData.topDevice || "--"}</div>
            </div> 
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-1"><Smartphone size={16} /> Top Platform</div>
              <div className="text-3xl font-bold text-white">{urlData.topPlatform || "--"}</div>
            </div> 
          </div>

          <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
            <h3 className="font-heading text-lg font-semibold text-white flex items-center gap-2 mb-8"><BarChart3 size={20} className="text-white" /> Click Traffic</h3>
            <div className="flex items-end h-[200px] gap-2 md:gap-4">
              {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                <div key={i} className="flex-1 bg-white/50 rounded-t-md opacity-80" style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <UrlDetails id={id}/>
        </div>
      </div>
    </motion.div>
  );
}

function UrlDetails({id}: {id: string}){
  const {projectDetail} =useAuth();
  const [copied, setCopied] = useState(false);
  const [shortUrl,setShortUrl] = useState<any>(null);
  useEffect(()=>{ 
    if(projectDetail!==null){
      const url=projectDetail.find((project:ProjectDetail)=>project.id===Number(id));
      if(url){
       
        setShortUrl(url.shortUrl);
      }
    }
  },[projectDetail])
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl sticky top-8">
            <h3 className="font-heading text-lg font-semibold text-white mb-6">Link Details</h3>
            
            <div className="bg-black/50 border border-white/10 p-3 rounded-xl flex items-center justify-between mb-8">
              <span className="font-mono text-white text-sm truncate">{shortUrl}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(shortUrl);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="text-gray-400 hover:text-white transition-colors"
                title="Copy shortUrl"
              >
                {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
              </button>
            </div>

            <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">QR Code</h4>
            <div className="bg-white p-4 rounded-xl flex justify-center w-max mx-auto shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <QRCodeSVG value={shortUrl} size={160} />
            </div>
          </div>
  )
}
