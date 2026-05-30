import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Star, CheckCircle, Award } from "lucide-react";
import StarRating from "../../../components/UI/StarRating";
import Skeleton from "../../../components/UI/Skeleton";
import axios from "axios";

const API = "https://tadbeer0.runasp.net/api";

const StatsBar = ({ worker }) => {
  const [stats, setStats] = useState({
    experienceYears: worker?.experienceYears ?? 0,
    rating: 0,
    completedJobs: 0,
    reviewsCount: 0,
  });
  const [loading,  setLoading ] = useState(true);
  const [isWorker, setIsWorker] = useState(false);

  useEffect(() => {
    if (!worker?.id) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        // Decode role from JWT without a library
        let role = null;
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null;
        } catch {}

        const isWorkerRole = role === "Worker";
        setIsWorker(isWorkerRole);

        const [reviewsRes, bookingsRes] = await Promise.all([
          axios.get(`${API}/General/Reviews`, {
            params: { workerId: worker.id, pageNumber: 1, pageSize: 100 },
          }),
          isWorkerRole
            ? axios.get(`${API}/Worker/Bookings`, {
                headers: { Authorization: `Bearer ${token}` },
              })
            : Promise.resolve(null),
        ]);

        const reviews      = reviewsRes.data?.items ?? reviewsRes.data ?? [];
        const totalReviews = reviewsRes.data?.totalCount ?? reviews.length;
        const avgRating    = worker.avgRating ?? 0;

        const allBookings   = bookingsRes ? (bookingsRes.data?.items ?? bookingsRes.data ?? []) : [];
        const completedJobs = isWorkerRole
          ? allBookings.filter(b => b.status === "Completed").length
          : 0;

        setStats({
          experienceYears: worker?.experienceYears ?? 0,
          rating: parseFloat(Number(avgRating).toFixed(1)),
          completedJobs,
          reviewsCount: totalReviews,
        });
      } catch (err) {
        console.error("StatsBar fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [worker?.id]);

  const statCards = [
    {
      icon: Briefcase,
      label: "سنوات الخبرة",
      value: `${stats.experienceYears}+`,
      colorClass: "text-sky-600",
      darkColorClass: "text-sky-900",
      bgClass: "bg-white border-sky-100 hover:border-sky-400 hover:shadow-sky-100",
      iconBg: "bg-sky-50",
    },
    {
      icon: Star,
      label: "التقييم العام",
      value: stats.rating,
      colorClass: "text-amber-600",
      darkColorClass: "text-amber-900",
      bgClass: "bg-white border-amber-100 hover:border-amber-400 hover:shadow-amber-100",
      iconBg: "bg-amber-50",
      isRating: true,
    },
    {
      icon: Award,
      label: "عدد التقييمات",
      value: stats.reviewsCount,
      colorClass: "text-violet-600",
      darkColorClass: "text-violet-900",
      bgClass: "bg-white border-violet-100 hover:border-violet-400 hover:shadow-violet-100",
      iconBg: "bg-violet-50",
    },
    {
      icon: CheckCircle,
      label: "مهام منجزة",
      value: stats.completedJobs,
      colorClass: "text-emerald-600",
      darkColorClass: "text-emerald-900",
      bgClass: "bg-white border-emerald-100 hover:border-emerald-400 hover:shadow-emerald-100",
      iconBg: "bg-emerald-50",
    },
  ];

  // For visitors (3 cards): put rating in the middle → [سنوات, التقييم, عدد التقييمات]
  // For workers (4 cards): [سنوات, التقييم, عدد التقييمات, مهام]
  const visibleCards = isWorker
    ? statCards
    : [statCards[0], statCards[1], statCards[2]];

  return (
    <div className={`grid gap-4 mb-6 ${
      visibleCards.length === 3
        ? "grid-cols-3 max-w-2xl mx-auto"
        : "grid-cols-2 lg:grid-cols-4"
    }`}>
      {visibleCards.map((s, i) => (
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
              <Skeleton className="h-7 w-16 rounded-lg" />
            ) : (
              <div className="flex flex-col items-center leading-tight">
                <span className={`text-2xl font-black tabular-nums tracking-tight ${s.darkColorClass}`}>
                  {s.value}
                </span>
                {s.isRating && (
                  <div className="mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity scale-90">
                    <StarRating rating={s.value} size={12} />
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
