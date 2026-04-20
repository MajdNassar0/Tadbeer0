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

function StarRow({ rate = 0 }) {
  const filled = Math.round(rate);
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={11}
          className={i < filled
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-100 text-gray-200"
          }
        />
      ))}
      <span className="text-gray-400 mr-1 text-[10px]">({rate})</span>
    </div>
  );
}

const Reviews = () => {
  const navigate  = useNavigate();
  const [reviews, setReviews] = useState(null);
  const [search,  setSearch ] = useState("");

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

  // Average rating
  const avg = reviews?.length
    ? (reviews.reduce((s, r) => s + (r.rate ?? 0), 0) / reviews.length).toFixed(1)
    : null;

  const filtered = reviews?.filter(r => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      r.userName?.toLowerCase().includes(q) ||
      r.workerName?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q)
    );
  }) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h2 className="text-base font-medium text-gray-700">
            التقييمات
            <span className="mr-2 text-xs font-normal text-gray-400">
              ({reviews?.length ?? 0})
            </span>
          </h2>
          {avg && (
            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
              <Star size={11} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs text-yellow-700 font-medium">{avg} متوسط التقييم</span>
            </div>
          )}
        </div>
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="بحث باسم المستخدم أو الفني..."
          className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2
                     text-xs outline-none focus:ring-2 focus:ring-yellow-400/30 w-56"
        />
      </div>

      {reviews === null ? <Spinner /> : reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Star size={20} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">لا توجد تقييمات حالياً</p>
          <p className="text-xs text-gray-300">ستظهر التقييمات هنا فور إضافتها</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-400 border-b border-gray-100">
                <th className="py-3 px-6 text-right font-medium">المستخدم</th>
                <th className="py-3 px-4 text-right font-medium">الفني</th>
                <th className="py-3 px-4 text-right font-medium">التقييم</th>
                <th className="py-3 px-4 text-right font-medium">التعليق</th>
                <th className="py-3 px-4 text-right font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-gray-300">
                    لا توجد نتائج مطابقة للبحث
                  </td>
                </tr>
              ) : filtered.map((r, i) => (
                <tr key={r.id ?? i} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-800">{r.userName || "—"}</td>
                  <td className="py-4 px-4 text-gray-500">{r.workerName || "—"}</td>
                  <td className="py-4 px-4"><StarRow rate={r.rate ?? 0} /></td>
                  <td className="py-4 px-4 text-gray-500 max-w-xs">
                    {r.comment
                      ? <span className="line-clamp-2">{r.comment}</span>
                      : <span className="text-gray-300 italic">لا يوجد تعليق</span>
                    }
                  </td>
                  <td className="py-4 px-4 text-gray-400">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString("ar-EG")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Reviews;