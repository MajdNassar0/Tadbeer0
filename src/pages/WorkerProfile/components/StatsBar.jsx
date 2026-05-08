import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Star, CheckCircle, Award } from "lucide-react";
import StarRating from "../../../components/UI/StarRating";
import Skeleton from "../../../components/UI/Skeleton";

const StatsBar = ({ worker, loading }) => {
  const stats = [
    { 
      icon: Briefcase, 
      label: "سنوات الخبرة", 
      value: `${worker?.experienceYears || 0}+`, 
      colorClass: "text-sky-600",
      darkColorClass: "text-sky-900",
      // تم تغيير الخلفية إلى bg-white
      bgClass: "bg-white border-sky-100 hover:border-sky-400 hover:shadow-sky-100",
      iconBg: "bg-sky-50"
    },
    { 
      icon: Star, 
      label: "التقييم العام", 
      value: worker?.rating || 0, 
      colorClass: "text-amber-600",
      darkColorClass: "text-amber-900",
      // تم تغيير الخلفية إلى bg-white
      bgClass: "bg-white border-amber-100 hover:border-amber-400 hover:shadow-amber-100",
      iconBg: "bg-amber-50",
      isRating: true 
    },
    { 
      icon: CheckCircle, 
      label: "مهام منجزة", 
      value: worker?.completedJobs || 0, 
      colorClass: "text-emerald-600",
      darkColorClass: "text-emerald-900",
      // تم تغيير الخلفية إلى bg-white
      bgClass: "bg-white border-emerald-100 hover:border-emerald-400 hover:shadow-emerald-100",
      iconBg: "bg-emerald-50"
    },
    { 
      icon: Award, 
      label: "عدد التقييمات", 
      value: worker?.reviewsCount || 0, 
      colorClass: "text-violet-600",
      darkColorClass: "text-violet-900",
      // تم تغيير الخلفية إلى bg-white
      bgClass: "bg-white border-violet-100 hover:border-violet-400 hover:shadow-violet-100",
      iconBg: "bg-violet-50"
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((s, i) => (
        <motion.div 
          key={s.label}
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: i * 0.08 }}
          className={`group relative flex flex-col items-center justify-center rounded-[1.5rem] border-2 p-4 text-center transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${s.bgClass}`}
        >
          <div className={`mb-2 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-105 ${s.iconBg}`}>
            <s.icon className={`w-5 h-5 ${s.colorClass}`} strokeWidth={2.5} />
          </div>

          <div className="flex flex-col items-center">
            {loading ? (
              <Skeleton className="h-7 w-16 rounded-lg"/>
            ) : (
              <div className="flex flex-col items-center leading-tight">
                <span className={`text-2xl font-black tabular-nums tracking-tight ${s.darkColorClass}`}>
                  {s.value}
                </span>
                {s.isRating && (
                  <div className="mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity scale-90">
                    <StarRating rating={s.value} size={12}/>
                  </div>
                )}
              </div>
            )}
            
            <span className={`mt-1 text-[9px] font-bold uppercase tracking-wider opacity-70 group-hover:opacity-100 transition-all ${s.colorClass}`}>
              {s.label}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsBar;