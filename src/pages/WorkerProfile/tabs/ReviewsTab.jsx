import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronRight, ChevronLeft } from "lucide-react";
import StarRating from "../../../components/UI/StarRating";
import Skeleton from "../../../components/UI/Skeleton";
import axios from "axios";

const API_BASE = "https://tadbeer0.runasp.net/api";
const PER_PAGE = 4;

const ReviewsTab = ({
  workerId,       // passed from WorkerProfile
  rating = 0,
  reviewsCount = 0,
  loading: parentLoading = false,
  specialtyTabs = [],
}) => {
  const [activeTab, setActiveTab] = useState(null);
  const [reviews,   setReviews]   = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [tabs,      setTabs]      = useState(specialtyTabs);
  const [page,      setPage]      = useState(1);

  // Build specialty tabs from worker if not passed
  useEffect(() => {
    if (specialtyTabs.length > 0) { setTabs(specialtyTabs); return; }
    if (!workerId) return;
    axios.get(`${API_BASE}/General/Workers/${workerId}`)
      .then((res) => {
        const data  = res.data?.data ?? res.data;
        const ids   = data?.specialtyIds   ?? [];
        const names = data?.specialtyNames ?? [];
        setTabs(ids.map((sid, i) => ({ id: sid, name: names[i] ?? `خدمة ${i + 1}` })));
      })
      .catch(() => {});
  }, [workerId, specialtyTabs]);

  // Fetch reviews when tab changes
  useEffect(() => {
    if (!workerId) return;
    setLoading(true);
    setPage(1);

    // always fetch all reviews, filter client-side by specialtyName
    axios.get(`${API_BASE}/General/Reviews`, {
      params: { workerId, pageNumber: 1, pageSize: 100 },
    })
      .then((res) => {
        const all = res.data?.items ?? res.data ?? [];
        if (activeTab === null) {
          setReviews(all);
        } else {
          const tabName = tabs.find(t => String(t.id) === String(activeTab))?.name ?? null;
          setReviews(
            all.filter(r =>
              String(r.specialtyId) === String(activeTab) ||
              (tabName && r.specialtyName === tabName)
            )
          );
        }
      })
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, [workerId, activeTab, tabs]);

  const totalPages = Math.ceil(reviews.length / PER_PAGE);
  const paginated  = reviews.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleTab = (id) => { setActiveTab(id); setPage(1); };

  if (parentLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-20 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">

      {/* Overall rating */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <p className="text-base font-black text-[#001F3F] mb-2">تقييمات العملاء</p>
        <div className="flex items-center gap-2 flex-wrap">
          <Star className="w-5 h-5 fill-[#F7A823] text-[#F7A823]" />
          <span className="text-xl font-black text-gray-800">{Number(rating).toFixed(1)}</span>
          <StarRating rating={rating} />
        </div>
      </div>

      {/* Service filter tabs */}
      {tabs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTab(null)}
            className={`px-4 py-1.5 text-sm font-bold rounded-xl border transition-all ${
              activeTab === null
                ? "bg-[#001F3F] text-white border-[#001F3F] shadow"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
            }`}
          >
            الكل
          </button>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTab(tab.id)}
              className={`px-4 py-1.5 text-sm font-bold rounded-xl border transition-all ${
                activeTab === tab.id
                  ? "bg-[#F7A823] text-white border-[#F7A823] shadow"
                  : "bg-white text-gray-500 border-gray-200 hover:border-amber-300 hover:text-amber-600"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      )}

      {/* Reviews list */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeTab ?? "all"}-${page}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="space-y-3"
        >
          {loading ? (
            <>
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
              <Skeleton className="h-24 rounded-2xl" />
            </>
          ) : paginated.length === 0 ? (
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-10 text-center">
              <p className="text-gray-400 text-sm">لا توجد تعليقات لهذه الخدمة</p>
            </div>
          ) : (
            paginated.map((review, i) => {
              const rate = Number(review.rating ?? review.rate ?? 0);
              return (
                <motion.div
                  key={review.id ?? i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-[#001F3F] text-sm">{review.userName || "مستخدم"}</p>
                      {review.date && <p className="text-xs text-gray-400 mt-0.5">{review.date}</p>}
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-lg shrink-0">
                      <Star className="w-3.5 h-3.5 fill-[#F7A823] text-[#F7A823]" />
                      <span className="text-xs font-black text-amber-700">{rate.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <StarRating rating={rate} />
                  </div>
                  <p className="mt-3 text-sm text-gray-600 leading-6 border-r-2 border-amber-200 pr-3">
                    {review.comment}
                  </p>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-30 hover:border-gray-300 transition-all"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-xl text-sm font-bold border transition-all ${
                  page === p
                    ? "bg-[#001F3F] text-white border-[#001F3F]"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-gray-200 bg-white disabled:opacity-30 hover:border-gray-300 transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

    </div>
  );
};

export default ReviewsTab;
