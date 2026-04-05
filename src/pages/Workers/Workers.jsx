import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Star,
  BadgeCheck,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Briefcase,
  CalendarCheck,
  Search
} from "lucide-react";

// الثوابت اللونية للهوية البصرية
const NAVY = "#001F3F";
const ORANGE = "#F7A823";
const INFO_BG = "#F0F7FF"; 
const API_BASE = "https://tadbeer0.runasp.net/api";
const IMAGE_BASE = "https://tadbeer0.runasp.net/";

// مكون عرض النجوم
function StarRatingRow({ value }) {
  const rounded = Math.min(5, Math.max(0, Math.round(value * 2) / 2));
  return (
    <div className="flex items-center gap-1 justify-end mt-2" dir="ltr">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${rounded >= i ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
          strokeWidth={rounded >= i ? 0 : 1.2}
        />
      ))}
      <span className="text-xs font-bold text-gray-600 mr-1.5 tabular-nums">
        {(value || 5.0).toFixed(1)}
      </span>
    </div>
  );
}

function Workers() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  
  // فلاتر السايدبار
  const [ratingFilter, setRatingFilter] = useState(null);
  const [availability, setAvailability] = useState("now");

  const specialtyIdFromUrl = searchParams.get("specialtyId");

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE}/General/Workers`);
        const rawData = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setWorkers(rawData);
      } catch (err) {
        console.error("Error fetching workers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  const selectedSpecialtyName = useMemo(() => {
    if (!specialtyIdFromUrl || workers.length === 0) return null;
    const workerWithSpecialty = workers.find(w => w.specialtyIds?.includes(specialtyIdFromUrl));
    if (workerWithSpecialty) {
      const index = workerWithSpecialty.specialtyIds.indexOf(specialtyIdFromUrl);
      return workerWithSpecialty.specialtyNames?.[index];
    }
    return null;
  }, [workers, specialtyIdFromUrl]);

  const filteredWorkers = useMemo(() => {
    let result = [...workers];
    if (specialtyIdFromUrl) {
      result = result.filter(w => w.specialtyIds?.includes(specialtyIdFromUrl));
    }
    if (ratingFilter) {
      result = result.filter(w => (w.avgRating || 5.0) >= ratingFilter);
    }
    return result;
  }, [workers, specialtyIdFromUrl, ratingFilter]);

  const PAGE_SIZE = 6;
  const totalPages = Math.max(1, Math.ceil(filteredWorkers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedWorkers = filteredWorkers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white font-sans pb-16" dir="rtl">
      
      {/* Hero Section */}
      <section className="bg-[#fafbfc] border-b border-gray-100 pt-10 pb-12 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-right relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-4 leading-tight tracking-tight"
            style={{ color: NAVY }}
          >
            {selectedSpecialtyName 
              ? `الفنيون المتخصصون في ${selectedSpecialtyName}` 
              : "كافة الفنيين والخبراء المعتمدين"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-base md:text-lg max-w-2xl"
          >
            اختر من بين أفضل المحترفين الموثوقين لإنجاز مهامك بدقة واحترافية عالية.
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10">
        
        {/* السايدبار مع اختيار الدائرة الصفراء */}
        <aside className="w-full lg:w-80 shrink-0 order-2 lg:order-1 text-right">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-8 border-b border-gray-50 pb-4">
              <SlidersHorizontal className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-bold" style={{ color: NAVY }}>تصفية النتائج</h2>
            </div>

            <div className="space-y-8">
              {/* التقييم */}
              <div>
                <p className="text-sm font-bold text-gray-800 mb-4">التقييم</p>
                {[4.5, 4.0].map((val) => (
                  <label key={val} className="flex items-center gap-3 mb-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={ratingFilter === val}
                        onChange={() => setRatingFilter(val)}
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#F7A823] transition-all cursor-pointer focus:ring-2 focus:ring-[#F7A823]/30"
                      />
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-[#F7A823] scale-0 peer-checked:scale-100 transition-transform duration-200 pointer-events-none"></div>
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-navy-900 transition-colors font-medium">
                      {val} فأعلى
                    </span>
                  </label>
                ))}
                {ratingFilter && (
                   <button onClick={() => setRatingFilter(null)} className="text-[11px] text-blue-500 mt-1 hover:underline font-bold pr-8">إظهار الكل</button>
                )}
              </div>

              {/* التوفر */}
              <div className="pt-6 border-t border-gray-50">
                <p className="text-sm font-bold text-gray-800 mb-4">التوفر</p>
                {[
                  { id: "now", label: "متاح الآن" },
                  { id: "24h", label: "خلال 24 ساعة" },
                  { id: "weekend", label: "عطلة نهاية الأسبوع" },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-3 mb-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="availability"
                        checked={availability === opt.id}
                        onChange={() => setAvailability(opt.id)}
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#F7A823] transition-all cursor-pointer focus:ring-2 focus:ring-[#F7A823]/30"
                      />
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-[#F7A823] scale-0 peer-checked:scale-100 transition-transform duration-200 pointer-events-none"></div>
                    </div>
                    <span className="text-sm text-gray-600 group-hover:text-navy-900 transition-colors font-medium">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#002d5c" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md transition-colors"
                style={{ backgroundColor: NAVY }}
              >
                تطبيق الفلاتر
              </motion.button>
            </div>
          </div>
        </aside>

        {/* عرض الفنيين */}
        <main className="flex-1 order-1 lg:order-2 min-w-0">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-orange-500 border-gray-100"></div>
                <p className="mt-4 text-gray-400 font-medium">جاري جلب الفنيين...</p>
             </div>
          ) : filteredWorkers.length === 0 ? (
            <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
               <Search size={48} className="text-gray-200 mx-auto mb-4" />
               <p className="text-gray-500 font-bold">لا يوجد نتائج تطابق بحثك</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {paginatedWorkers.map((w, i) => (
                    <motion.article
                      layout
                      key={w.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                      className="relative bg-white rounded-[20px] border border-gray-100 shadow-sm p-6 pt-12 hover:shadow-xl transition-all duration-300"
                    >
                      {/* شارة التوثيق */}
                      {w.emailConfirmed && (
                        <span
                          className="absolute top-4 start-4 z-10 inline-flex items-center gap-1.5 text-[10px] font-black px-3 py-1 rounded-full border border-gray-100 shadow-sm"
                          style={{ backgroundColor: INFO_BG, color: NAVY }}
                        >
                          <BadgeCheck className="w-3.5 h-3.5" />
                          فني معتمد
                        </span>
                      )}

                      <div className="text-right">
                        <div className="flex items-center gap-4">
                          <img
                            src={w.profileImage ? `${IMAGE_BASE}${w.profileImage}` : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                            alt={w.firstName}
                            onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png" }}
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">
                              {w.firstName} {w.lastName}
                            </h3>
                            <p className="text-xs text-gray-500 font-black mt-1 uppercase tracking-wide">
                              {w.specialtyNames?.[0] || "فني متخصص"}
                            </p>
                          </div>
                        </div>
                        <StarRatingRow value={w.avgRating || 5.0} />
                      </div>

                      {/* تفاصيل سريعة */}
                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="rounded-xl px-3 py-3 flex flex-col justify-center border border-gray-50 shadow-inner" style={{ backgroundColor: "#FBFDFF" }}>
                          <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                            <Briefcase size={12} />
                            <span className="text-[10px] font-bold">الخبرة</span>
                          </div>
                          <p className="text-xs font-black" style={{ color: NAVY }}>{w.experienceYears || 0} سنوات</p>
                        </div>
                        <div className="rounded-xl px-3 py-3 flex flex-col justify-center border border-gray-50 shadow-inner" style={{ backgroundColor: "#FBFDFF" }}>
                          <div className="flex items-center gap-1.5 text-gray-400 mb-1">
                            <MapPin size={12} />
                            <span className="text-[10px] font-bold">الموقع</span>
                          </div>
                          <p className="text-xs font-black truncate" style={{ color: NAVY }}>{w.city || "فلسطين"}</p>
                        </div>
                      </div>

                      {/* الأزرار المحدثة مع التأثيرات */}
                      <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <motion.button
                          whileHover={{ scale: 1.02, backgroundColor: "#f8fafc" }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/worker-profile/${w.id}`)}
                          className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300"
                        >
                          <User size={14} />
                          عرض الملف
                        </motion.button>

                        <motion.button
                          whileHover={{ 
                            scale: 1.03,
                            boxShadow: "0 10px 15px -3px rgba(247, 168, 35, 0.3)"
                          }}
                          whileTap={{ scale: 0.97 }}
                          className="relative flex-[1.4] py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 overflow-hidden group shadow-lg"
                          style={{ backgroundColor: ORANGE }}
                        >
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full" />
                          <CalendarCheck size={14} className="relative z-10" />
                          <span className="relative z-10">احجز موعد الآن</span>
                        </motion.button>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-14" dir="rtl">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="w-10 h-10 flex items-center justify-center border rounded-xl bg-white disabled:opacity-30 hover:border-orange-400 transition-colors shadow-sm"><ChevronRight size={20}/></button>
                  <div className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold shadow-md">{safePage} / {totalPages}</div>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="w-10 h-10 flex items-center justify-center border rounded-xl bg-white disabled:opacity-30 hover:border-orange-400 transition-colors shadow-sm"><ChevronLeft size={20}/></button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default Workers;