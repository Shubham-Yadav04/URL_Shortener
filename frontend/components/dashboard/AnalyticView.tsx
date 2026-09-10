import { motion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Copy,
  Check,
  BarChart3,
  Globe,
  Smartphone,
  MousePointerClick,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useAnalytic } from "@/context/AnalyticContext";
import { useAuth, ProjectDetail } from "@/context/AuthContext";
import DetailedAnalyticsView from "@/components/dashboard/DetailedAnalyticsView";
import Last7DaysBarGraph from "@/components/dashboard/Last7DaysBarGraph";

export default function AnalyticsView({ id }: { id: string }) {
  const [urlData, setUrlData] = useState<any>(null);
  const [showDetailedView, setShowDetailedView] = useState<boolean>(false);
  const { projectSummary, setProjectSummary } = useAnalytic();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/";
  useEffect(() => {
    const fetchProjectSummary = async () => {
      try{
      const urlData = await fetch(`${BACKEND_URL}analytic/summary/${id}`, {
        credentials: "include",
      });
      const data = await urlData.json();
      if (data) {
        setProjectSummary((prev) => [...prev, data]);
        setUrlData({
          ...data,
        });
      } else {
        const data = {
          totalCount: 0,
          topCountry: "Null",
          topDevice: "Null",
          projectName: "",
          id,
        };
        setUrlData({
          ...data,
        });
      }}
      catch (error) {
        console.error("Error fetching project summary:", error);
      }
    };

    if (
      projectSummary == null ||
      !projectSummary.some((project) => project.id === id)
    ) {
      // fetch the project summary and set it up in the context window

      fetchProjectSummary();
    } else {
      projectSummary?.forEach((project) => {
        if (project.id == id) {
          setUrlData({
            ...project,
          });
        }
      });
    }
  }, [id]);

  if (urlData === null) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p className="text-center w-full  ">...loading</p>
      </div>
    );
  }

  if (showDetailedView) {
    return (
      <DetailedAnalyticsView
        urlData={urlData}
        id={id}
        onBack={() => setShowDetailedView(false)}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-8"
    >
      <div className="mb-2 pt-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-white mb-1">
            {urlData.projectName || "URL Analytics"}
          </h1>
          <p className="text-sm text-gray-400 break-all">{urlData.longURL}</p>
        </div>

        {/* Detailed Analytics Button */}
        <button
          onClick={() => setShowDetailedView(true)}
          className="group relative inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-white text-black font-semibold text-xs sm:text-sm shadow-[0_0_25px_rgba(255,255,255,0.15)] hover:bg-gray-100 hover:shadow-[0_0_35px_rgba(255,255,255,0.25)] transition-all duration-300 transform active:scale-95 shrink-0"
        >
          <Sparkles
            size={16}
            className="text-amber-500 group-hover:rotate-12 transition-transform duration-300"
          />
          <span>Detailed Analytics</span>
          <ArrowRight
            size={16}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-1">
                <MousePointerClick size={16} /> Total Clicks
              </div>
              <div className="text-3xl font-bold text-white">
                {urlData.totalCount || 0}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-1">
                <Globe size={16} /> Top Location
              </div>
              <div className="text-3xl font-bold text-white">
                {urlData.topCountry || "--"}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-1">
                <Smartphone size={16} /> Device Type
              </div>
              <div className="text-3xl font-bold text-white">
                {urlData.topDevice || "--"}
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
              <div className="flex items-center gap-2 text-gray-400 text-sm font-medium mb-1">
                <Smartphone size={16} /> Top Platform
              </div>
              <div className="text-3xl font-bold text-white">
                {urlData.topPlatform || "--"}
              </div>
            </div>
          </div>

          <Last7DaysBarGraph id={id} />
        </div>

        <div className="lg:col-span-1">
          <UrlDetails id={id} />
        </div>
      </div>
    </motion.div>
  );
}

function UrlDetails({ id }: { id: string }) {
  const { projectDetail } = useAuth();
  const [copied, setCopied] = useState(false);
  const shortUrl =
    projectDetail?.find((project: ProjectDetail) => project.id === Number(id))
      ?.shortUrl ?? "";
  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl sticky top-8">
      <h3 className="font-heading text-lg font-semibold text-white mb-6">
        Link Details
      </h3>

      <div className="bg-black/50 border border-white/10 p-3 rounded-xl flex items-center justify-between mb-8">
        <span className="font-mono text-white text-sm truncate">
          {shortUrl}
        </span>
        <button
          onClick={() => {
            navigator.clipboard.writeText(shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          className="text-gray-400 hover:text-white transition-colors"
          title="Copy shortUrl"
        >
          {copied ? (
            <Check size={18} className="text-green-400" />
          ) : (
            <Copy size={18} />
          )}
        </button>
      </div>

      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        QR Code
      </h4>
      <div className="bg-white p-4 rounded-xl flex justify-center w-max mx-auto shadow-[0_0_30px_rgba(255,255,255,0.05)]">
        <QRCodeSVG value={shortUrl} size={160} />
      </div>
    </div>
  );
}
