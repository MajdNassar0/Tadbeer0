import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useNavigate,useParams } from "react-router-dom";
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
  Search,
  Clock
} from "lucide-react";

// Color Palette
const NAVY = "#001F3F";
const ORANGE = "#F7A823";
const INFO_BG = "#F0F7FF"; 
const API_BASE = "https://tadbeer0.runasp.net/api";
const IMAGE_BASE = "https://tadbeer0.runasp.net/";


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
  
  // Sidebar States
  const [ratingFilter, setRatingFilter] = useState(null);
  const [availability, setAvailability] = useState("all"); // Default to show all

  const specialtyIdFromUrl = searchParams.get("specialtyId");

  useEffect(() => {
    const fetchWorkers = async () => {
      setLoading(true);
      try {
        const params = {};
        if (specialtyIdFromUrl) params.specialtyId = specialtyIdFromUrl;

        const res = await axios.get(`${API_BASE}/General/Workers`, { params });
        const rawData = Array.isArray(res.data)
          ? res.data
          : res.data?.workers ?? res.data?.items ?? res.data?.data ?? [];
        setWorkers(rawData);
      } catch (err) {
        console.error("Error fetching workers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, [specialtyIdFromUrl]); // re-fetch when specialty changes

  const selectedSpecialtyName = useMemo(() => {
    if (!specialtyIdFromUrl || workers.length === 0) return null;
    const workerWithSpecialty = workers.find(w => w.specialtyIds?.includes(specialtyIdFromUrl));
    if (workerWithSpecialty) {
      const index = workerWithSpecialty.specialtyIds.indexOf(specialtyIdFromUrl);
      return workerWithSpecialty.specialtyNames?.[index];
    }
    return null;
  }, [workers, specialtyIdFromUrl]);

  // --- FILTERING LOGIC ---
  const filteredWorkers = useMemo(() => {
    let result = [...workers];

    // 1. Specialty Filter
    if (specialtyIdFromUrl) {
      result = result.filter(w => w.specialtyIds?.includes(specialtyIdFromUrl));
    }

    // 2. Rating Filter
    if (ratingFilter) {
      result = result.filter(w => (w.avgRating || 5.0) >= ratingFilter);
    }

    // 3. Availability ("Motah") Filter
    if (availability === "now") {
      // Logic: Show workers who are currently active/available
      result = result.filter(w => w.isAvailable === true || w.status === "Available");
    } else if (availability === "24h") {
      // Logic: Flexible check for workers available soon
      result = result.filter(w => w.availableWithin24h === true || w.isAvailable === true);
    }

    return result;
  }, [workers, specialtyIdFromUrl, ratingFilter, availability]);

  const PAGE_SIZE = 4;
  const totalPages = Math.max(1, Math.ceil(filteredWorkers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedWorkers = filteredWorkers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white font-sans pb-16" dir="rtl">
      
      {/* Hero */}
      <section className="bg-[#fafbfc] border-b border-gray-100 pt-10 pb-12 px-4 relative">
        <div className="max-w-7xl mx-auto text-right relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ color: NAVY }}
          >
            {selectedSpecialtyName ? `فنيو ${selectedSpecialtyName}` : "الفنيون المعتمدون"}
          </motion.h1>
          <p className="text-gray-500 text-base max-w-2xl">
            تصفح قائمة الخبراء المتاحين لخدمتك الآن.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar */}
        <aside className="w-full lg:w-80 shrink-0 order-2 lg:order-1 text-right">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-8 border-b border-gray-50 pb-4">
              <SlidersHorizontal className="w-5 h-5 text-gray-400" />
              <h2 className="text-lg font-bold" style={{ color: NAVY }}>تصفية النتائج</h2>
            </div>

            <div className="space-y-8">
              {/* Availability Section (Motah) */}
              <div>
                <p className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock size={16} className="text-orange-500" /> التوفر الحالي
                </p>
                {[
                  { id: "all", label: "الكل" },
                  { id: "now", label: "متاح الآن" },
                  { id: "24h", label: "خلال 24 ساعة" },
                ].map((opt) => (
                  <label key={opt.id} className="flex items-center gap-3 mb-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio" name="avail"
                        checked={availability === opt.id}
                        onChange={() => { setAvailability(opt.id); setPage(1); }}
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#F7A823] transition-all cursor-pointer"
                      />
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-[#F7A823] scale-0 peer-checked:scale-100 transition-transform"></div>
                    </div>
                    <span className={`text-sm font-medium transition-colors ${availability === opt.id ? "text-orange-600 font-bold" : "text-gray-600"}`}>
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Rating Section */}
              <div className="pt-6 border-t border-gray-50">
                <p className="text-sm font-bold text-gray-800 mb-4">التقييم</p>
                {[4.5, 4.0].map((val) => (
                  <label key={val} className="flex items-center gap-3 mb-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio" name="rating"
                        checked={ratingFilter === val}
                        onChange={() => { setRatingFilter(val); setPage(1); }}
                        className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-full checked:border-[#F7A823] transition-all cursor-pointer"
                      />
                      <div className="absolute w-2.5 h-2.5 rounded-full bg-[#F7A823] scale-0 peer-checked:scale-100 transition-transform"></div>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">{val} فأعلى</span>
                  </label>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#002d5c" }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-md"
                style={{ backgroundColor: NAVY }}
              >
                تحديث البحث
              </motion.button>
            </div>
          </div>
        </aside>

        {/* Workers Grid */}
        <main className="flex-1 order-1 lg:order-2">
          {loading ? (
             <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-[#F7A823]"></div></div>
          ) : filteredWorkers.length === 0 ? (
            <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
               <Search size={48} className="text-slate-200 mx-auto mb-4" />
               <p className="text-slate-500 font-bold">عذراً، لا يوجد فنيين متاحين حالياً بهذا الاختيار</p>
               <button onClick={() => {setAvailability("all"); setRatingFilter(null)}} className="mt-4 text-orange-500 font-bold text-sm underline">إعادة ضبط الفلاتر</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {paginatedWorkers.map((w, i) => (
                    <motion.article
                      layout key={w.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative bg-slate-50 rounded-[24px] border border-gray-200 shadow-sm p-6 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative">
                          <img
                            src={
                              w.profileImage && w.profileImage !== "string"
                                ? (w.profileImage.startsWith("http") ? w.profileImage : `${IMAGE_BASE}${w.profileImage}`)
                                : `https://ui-avatars.com/api/?name=${encodeURIComponent((w.firstName || "") + " " + (w.lastName || ""))}&background=001F3F&color=F7A823&size=200&bold=true`
                            }
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent((w.firstName || "") + " " + (w.lastName || ""))}&background=001F3F&color=F7A823&size=200&bold=true`;
                            }}
                            className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md"
                            alt={`${w.firstName} ${w.lastName}`}
                          />
                          {/* Online status indicator for "Motah Now" */}
                          {(w.isAvailable || w.status === "Available") && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 text-lg leading-tight truncate">{w.firstName} {w.lastName}</h3>
                          <p className="text-xs font-bold mt-1 uppercase" style={{ color: ORANGE }}>{w.specialtyNames?.[0] || "فني متخصص"}</p>
                          {w.emailConfirmed && (
                            <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1 rounded-lg border border-blue-100" style={{ backgroundColor: INFO_BG, color: NAVY }}>
                              <BadgeCheck className="w-3.5 h-3.5 text-blue-500" /> فني معتمد
                            </div>
                          )}
                        </div>
                      </div>

                      <StarRatingRow value={w.avgRating || 5.0} />

                      <div className="grid grid-cols-2 gap-3 mt-6">
                        <div className="bg-white rounded-xl px-3 py-3 border border-slate-200 shadow-sm">
                          <p className="text-[10px] text-gray-400 font-bold mb-1">الخبرة</p>
                          <p className="text-xs font-black" style={{ color: NAVY }}>{w.experienceYears || 0} سنوات</p>
                        </div>
                        <div className="bg-white rounded-xl px-3 py-3 border border-slate-200 shadow-sm">
                          <p className="text-[10px] text-gray-400 font-bold mb-1">الموقع</p>
                          <p className="text-xs font-black truncate" style={{ color: NAVY }}>{w.city || "فلسطين"}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 mt-6">
                        <motion.button onClick={() => navigate(`/worker-profile/${w.id}`)} className="flex-1 py-3 rounded-xl border border-gray-300 bg-white text-gray-600 font-bold text-xs">عرض الملف</motion.button>
<motion.button
  onClick={() => navigate(`/booking/${w.id}`)}
  className="flex-[1.4] py-3 rounded-xl text-white font-bold text-xs shadow-lg"
  style={{ backgroundColor: ORANGE }}
>
  احجز موعد الآن
</motion.button>                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>

              {/* Pagination Section (4 per page) */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-14">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={safePage === 1} className="w-10 h-10 flex items-center justify-center border rounded-xl bg-white disabled:opacity-30"><ChevronRight size={20} style={{ color: NAVY }} /></button>
                  <div className="px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md" style={{ backgroundColor: NAVY }}>{safePage} / {totalPages}</div>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="w-10 h-10 flex items-center justify-center border rounded-xl bg-white disabled:opacity-30"><ChevronLeft size={20} style={{ color: NAVY }} /></button>
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