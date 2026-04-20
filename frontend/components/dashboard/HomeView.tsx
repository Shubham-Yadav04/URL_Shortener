import { motion } from "motion/react"
import { MousePointerClick, Globe, Smartphone, TrendingUp } from "lucide-react"
export default function HomeView() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="font-heading text-2xl font-bold tracking-tight text-white mb-2">Welcome back, User</h1>
      <p className="text-sm text-gray-400 mb-8">Here's a quick overview of your link performance.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-medium"><MousePointerClick size={14}/> Total Clicks</div>
          <div className="text-3xl font-bold text-white tracking-tight">2,077</div>
          <div className="text-xs text-white flex items-center gap-1 mt-1"><TrendingUp size={12}/> +12% this week</div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-medium"><Globe size={14}/> Active Links</div>
          <div className="text-3xl font-bold text-white tracking-tight">2</div>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-gray-400 text-xs font-medium"><Smartphone size={14}/> Top Source</div>
          <div className="text-3xl font-bold text-white tracking-tight">Twitter</div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl">
        <h2 className="font-heading text-lg font-semibold text-white mb-2">Recent Activity</h2>
        <p className="text-sm text-gray-400">Select a link from the sidebar to view detailed analytics.</p>
      </div>
    </motion.div>
  );
}