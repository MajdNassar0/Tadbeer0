import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Star, CheckCircle, Award } from "lucide-react";
import StarRating from "../../../components/UI/StarRating";
import Skeleton from "../../../components/UI/Skeleton"; // (Sk)

const StatsBar = ({ worker, loading }) => {
  const stats = [
    { icon: Briefcase, label: "سنوات الخبرة", value: `${worker?.experienceYears || worker?.yearsOfExperience || 0}+`, color: "#001e3c" },
    { icon: Star, label: "التقييم العام", value: worker?.rating || 0, color: "#f59e0b", isRating: true },
    { icon: CheckCircle, label: "مهام منجزة", value: worker?.completedJobs || 0, color: "#16a34a" },
    { icon: Award, label: "عدد التقييمات", value: worker?.reviewsCount || 0, color: "#7c3aed" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((s, i) => (
        <motion.div 
          key={s.label}
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: i * 0.07 }}
          className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center hover:shadow-md hover:border-orange-200 transition-all duration-300"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: `${s.color}15` }}>
            <s.icon size={18} style={{ color: s.color }}/>
          </div>
          {loading ? (
            <Skeleton className="h-6 w-12"/>
          ) : s.isRating ? (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xl font-black text-gray-800">{s.value}</span>
              <StarRating rating={s.value} size={11}/>
            </div>
          ) : (
            <span className="text-xl font-black text-gray-800">{s.value}</span>
          )}
          <span className="text-xs text-gray-400 font-medium">{s.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;