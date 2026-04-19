import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-7 h-7 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const Reviews = () => {
  const navigate  = useNavigate();
  const [reviews, setReviews] = useState(null);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/auth/login"); return; }
      try {
        const res = await axios.get("https://tadbeer0.runasp.net/api/General/Reviews",
          { headers: { Authorization: `Bearer ${token}` } });
        const items = res.data.items ?? res.data ?? [];
        setReviews(Array.isArray(items) ? items : []);
      } catch (err) {
        setReviews([]);
        if (err.response?.status === 401) { localStorage.clear(); navigate("/auth/login"); }
      }
    };
    load();
  }, [navigate]);

  const avg = reviews?.length
    ? (reviews.reduce((s, r) => s + (r.rate ?? 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <h2 className="text-base font-medium text-gray-700">
          تقييماتي
          <span className="mr-2 text-xs font-normal text-gray-400">({reviews?.length ?? 0})</span>
        </h2>
        {avg && (
          <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-yellow-700 font-medium">{avg} متوسط التقييم</span>
          </div>
        )}
      </div>

      {reviews === null ? <Spinner /> : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Star size={20} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">لا توجد تقييمات بعد</p>
          <p className="text-xs text-gray-300">ستظهر هنا بعد إتمام الحجوزات</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((r, i) => (
            <div key={r.id ?? i}
                 className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">{r.userName || "مستخدم"}</span>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={13}
                      className={j < Math.round(r.rate ?? 0)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-100 text-gray-200"
                      }
                    />
                  ))}
                </div>
              </div>
              {r.comment ? (
                <p className="text-xs text-gray-500 leading-relaxed">{r.comment}</p>
              ) : (
                <p className="text-xs text-gray-300 italic">لا يوجد تعليق</p>
              )}
              <p className="text-[10px] text-gray-300">
                {r.createdAt ? new Date(r.createdAt).toLocaleDateString("ar-EG") : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;