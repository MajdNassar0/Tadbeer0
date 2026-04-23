import React, { useEffect, useState } from "react";
import axios from "axios";
import { Star, MessageSquare, Loader2, ChevronRight, ChevronLeft, User } from "lucide-react";

const API = "https://tadbeer0.runasp.net/api";

const Reviews = () => {
  const [reviews, setReviews] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const workerId = localStorage.getItem("workerId");

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token || !workerId) return;

      try {
        const res = await axios.get(`${API}/General/Reviews`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { workerId: workerId }
        });
        setReviews(res.data.items ?? []);
      } catch (err) {
        setReviews([]);
      }
    };
    load();
  }, [workerId]);

  if (reviews === null) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="animate-spin text-amber-500 w-8 h-8" />
        <p className="text-gray-400 text-sm font-medium">جاري تحميل التقييمات...</p>
      </div>
    );
  }

  const paginated = reviews.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(reviews.length / pageSize);

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-2" dir="rtl">
      
      {/* Header Section */}
      <div className="flex items-center justify-between border-b pb-4 border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <MessageSquare className="text-amber-500" size={20} />
          آراء العملاء
          <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">
            {reviews.length}
          </span>
        </h3>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <MessageSquare className="mx-auto text-gray-300 mb-2" size={40} />
          <p className="text-gray-500 font-medium">لا توجد تقييمات حالياً</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {paginated.map((r) => (
            <div 
              key={r.id} 
              className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 leading-tight">{r.userName}</p>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={12}
                          className={i <= r.rate ? "text-amber-400 fill-amber-400" : "text-gray-200"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                  {r.rate}.0
                </span>
              </div>

              <div className="mt-4 relative">
                <p className="text-sm text-gray-600 leading-relaxed italic pr-4 border-r-2 border-amber-100">
                  "{r.comment || "هذا العميل لم يترك تعليقاً نصياً، قام بالتقييم فقط."}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Professional Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button 
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={20} />
          </button>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  page === i + 1 
                  ? "bg-amber-500 text-white shadow-lg shadow-amber-200" 
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Reviews;