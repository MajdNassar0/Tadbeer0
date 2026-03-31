import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  MessageCircle,
  BadgeCheck,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAVY = "#001F3F";
const ORANGE = "#F7A823";
const INFO_BG = "#F0F7FF";
const PAGE_SIZE = 4;

function StarRatingRow({ value }) {
  const rounded = Math.min(5, Math.max(0, Math.round(value * 2) / 2));
  return (
    <div
      className="flex items-center gap-1 justify-end mt-2"
      dir="ltr"
      aria-label={`التقييم ${value} من 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rounded >= i;
        const half = !filled && rounded >= i - 0.5 && rounded < i;
        return (
          <span key={i} className="relative inline-flex w-4 h-4">
            <Star
              className={`w-4 h-4 ${filled ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
              strokeWidth={filled ? 0 : 1.2}
            />
            {half && (
              <span className="absolute inset-0 overflow-hidden w-1/2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" strokeWidth={0} />
              </span>
            )}
          </span>
        );
      })}
      <span className="text-xs font-bold text-gray-600 mr-1 tabular-nums">
        {value.toFixed(1)}
      </span>
    </div>
  );
}

const workers = [
  {
    id: 1,
    name: "م. أحمد علي",
    specialty: "كهربائي منازل وتجاري",
    rating: 4.7,
    experience: "+10 سنوات",
    location: "رام الله",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
  },
  {
    id: 2,
    name: "م. خالد السعد",
    specialty: "لوحات وتوصيلات",
    rating: 4.9,
    experience: "+8 سنوات",
    location: "القدس",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
  },
  {
    id: 3,
    name: "م. سعد المطيري",
    specialty: "صيانة طوارئ",
    rating: 4.6,
    experience: "+12 سنة",
    location: "غزة",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop",
  },
  {
    id: 4,
    name: "م. فيصل العتيبي",
    specialty: "إنارة وشبكات",
    rating: 4.8,
    experience: "+6 سنوات",
    location: "نابلس",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  },
  {
    id: 5,
    name: "م. ناصر الدوسري",
    specialty: "أنظمة ذكية",
    rating: 4.5,
    experience: "+9 سنوات",
    location: "الخليل",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
  },
  {
    id: 6,
    name: "م. عماد النتشة",
    specialty: "تمديدات صناعية",
    rating: 4.7,
    experience: "+11 سنة",
    location: "بيت لحم",
    image:
      "https://images.unsplash.com/photo-1556157382-97eda2f62237?w=200&h=200&fit=crop",
  },
  {
    id: 7,
    name: "م. طارق جابر",
    specialty: "طاقة احتياطية وups",
    rating: 4.4,
    experience: "+7 سنوات",
    location: "جنين",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop",
  },
  {
    id: 8,
    name: "م. يوسف الكردي",
    specialty: "إنارة خارجية",
    rating: 4.9,
    experience: "+5 سنوات",
    location: "طولكرم",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop",
  },
];

function Workers() {
  const [page, setPage] = useState(1);
  const [rating45, setRating45] = useState(false);
  const [rating40, setRating40] = useState(false);
  const [availability, setAvailability] = useState("now");

  const totalPages = Math.max(1, Math.ceil(workers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const paginatedWorkers = workers.slice(start, start + PAGE_SIZE);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-white font-sans pb-16" dir="rtl">
      {/* Hero */}
      <section className="bg-[#fafbfc] border-b border-gray-100 pt-10 pb-12 px-4">
        <div className="max-w-7xl mx-auto text-right">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
            style={{ color: NAVY }}
          >
            أفضل الفنيين في مجال أعمال الكهرباء
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-gray-500 text-base md:text-lg max-w-2xl mr-0 ml-auto"
          >
            نخبة من الخبراء المعتمدين لتقديم حلول كهربائية ذكية وآمنة
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Sidebar filters — أول عنصر في RTL يظهر يميناً */}
        <aside className="w-full lg:w-80 shrink-0 order-2 lg:order-1">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-6 text-right">
              <SlidersHorizontal className="w-5 h-5" style={{ color: NAVY }} />
              <h2 className="text-lg font-bold" style={{ color: NAVY }}>
                تصفية النتائج
              </h2>
            </div>

            <div className="space-y-6 text-right">
              <div>
                <p className="text-sm font-bold text-gray-800 mb-3">التقييم</p>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rating45}
                    onChange={(e) => setRating45(e.target.checked)}
                    className="rounded border-gray-300 text-[#F7A823] focus:ring-orange-400"
                  />
                  <span className="text-sm text-gray-600">4.5 فأعلى</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rating40}
                    onChange={(e) => setRating40(e.target.checked)}
                    className="rounded border-gray-300 text-[#F7A823] focus:ring-orange-400"
                  />
                  <span className="text-sm text-gray-600">4.0 فأعلى</span>
                </label>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-800 mb-3">التوفر</p>
                {[
                  { id: "now", label: "متاح الآن" },
                  { id: "24h", label: "خلال 24 ساعة" },
                  { id: "weekend", label: "عطلة نهاية الأسبوع" },
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className="flex items-center gap-2 mb-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="availability"
                      checked={availability === opt.id}
                      onChange={() => setAvailability(opt.id)}
                      className="text-[#F7A823] focus:ring-orange-400"
                    />
                    <span className="text-sm text-gray-600">{opt.label}</span>
                  </label>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="w-full py-3 rounded-xl text-white font-bold text-sm shadow-md"
                style={{ backgroundColor: NAVY }}
              >
                تطبيق الفلاتر
              </motion.button>
            </div>
          </div>
        </aside>

        {/* Cards grid */}
        <main className="flex-1 order-1 lg:order-2 min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paginatedWorkers.map((w, i) => (
              <motion.article
                key={`${safePage}-${w.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="relative bg-white rounded-[14px] border border-gray-100 shadow-sm p-5 pt-12 hover:shadow-md transition-shadow"
              >
                <span
                  className="absolute top-3 start-3 z-10 inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm border border-gray-100/80"
                  style={{ backgroundColor: INFO_BG, color: NAVY }}
                >
                  <BadgeCheck className="w-3.5 h-3.5 shrink-0" />
                  فني معتمد
                </span>
                <div className="text-right">
                  <div className="flex items-center gap-3">
                    <img
                      src={w.image}
                      alt=""
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shrink-0"
                    />
                    <h3 className="font-bold text-gray-900 text-base leading-tight min-w-0 flex-1">
                      {w.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                    {w.specialty}
                  </p>
                  <StarRatingRow value={w.rating} />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div
                    className="rounded-xl px-3 py-3 text-right"
                    style={{ backgroundColor: INFO_BG }}
                  >
                    <p className="text-xs text-gray-500 mb-1">الخبرة</p>
                    <p className="text-sm font-bold" style={{ color: NAVY }}>
                      {w.experience}
                    </p>
                  </div>
                  <div
                    className="rounded-xl px-3 py-3 text-right"
                    style={{ backgroundColor: INFO_BG }}
                  >
                    <p className="text-xs text-gray-500 mb-1">الموقع</p>
                    <p className="text-sm font-bold" style={{ color: NAVY }}>
                      {w.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-stretch gap-3 mt-5">
                  <button
                    type="button"
                    className="w-12 shrink-0 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors"
                    style={{ color: NAVY }}
                    aria-label="محادثة"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="button"
                    className="flex-1 py-3 rounded-xl text-white font-bold text-sm"
                    style={{ backgroundColor: ORANGE }}
                  >
                    احجز الآن
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="flex flex-wrap items-center justify-center gap-2 mt-10"
              aria-label="ترقيم الصفحات"
              dir="rtl"
            >
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none"
                style={{ color: safePage <= 1 ? undefined : NAVY }}
              >
                <ChevronRight className="w-4 h-4" />
                السابق
              </button>

              <div className="flex items-center gap-1.5 mx-1">
                {pageNumbers.map((num) => {
                  const isActive = num === safePage;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPage(num)}
                      className="min-w-[2.5rem] h-10 rounded-xl text-sm font-bold transition-colors"
                      style={
                        isActive
                          ? { backgroundColor: NAVY, color: "#fff" }
                          : { backgroundColor: "#f3f4f6", color: NAVY }
                      }
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage >= totalPages}
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-bold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none"
                style={{
                  color: safePage >= totalPages ? undefined : NAVY,
                }}
              >
                التالي
                <ChevronLeft className="w-4 h-4" />
              </button>
            </nav>
          )}
        </main>
      </div>
    </div>
  );
}

export default Workers;
