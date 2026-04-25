import { motion } from "motion/react"
import { MousePointerClick, Globe, Smartphone, TrendingUp } from "lucide-react"
import { useAuth } from "@/context/AuthContext";

export default function HomeView() {
  const { user } = useAuth();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-white mb-1">
          Welcome back, {user?.username}
        </h1>
        <p className="text-xs sm:text-sm text-gray-400">
          Here's a quick overview of your link performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-xl flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
            <MousePointerClick size={12} /> Total Clicks
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">2,077</div>
          <div className="text-xs text-emerald-400 flex items-center gap-1">
            <TrendingUp size={11} /> +12% this week
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-xl flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
            <Globe size={12} /> Active Links
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">2</div>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-xl flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-medium">
            <Smartphone size={12} /> Top Source
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Twitter</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 border border-white/10 p-4 sm:p-6 rounded-xl">
        <h2 className="font-heading text-sm sm:text-base font-semibold text-white mb-1.5">
          Recent Activity
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Select a link from the sidebar to view detailed analytics.
        </p>
      </div>
    </motion.div>
  );
}
