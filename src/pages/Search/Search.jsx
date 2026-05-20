import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

const categories = [
  { id: "all", label: "الكل", icon: "🔧" },
  { id: "plumbing", label: "سباكة", icon: "🚿" },
  { id: "electric", label: "كهرباء", icon: "⚡" },
  { id: "ac", label: "تكييف", icon: "❄️" },
  { id: "painting", label: "دهانات", icon: "🎨" },
  { id: "carpentry", label: "نجارة", icon: "🪚" },
  { id: "cleaning", label: "تنظيف", icon: "🧹" },
];

const mockWorkers = [
  { id: 1, name: "أحمد الخالد", category: "plumbing", rating: 4.9, reviews: 128, price: 80, available: true, experience: 7 },
  { id: 2, name: "محمد العمري", category: "electric", rating: 4.8, reviews: 95, price: 100, available: true, experience: 5 },
  { id: 3, name: "خالد السعيد", category: "ac", rating: 4.7, reviews: 210, price: 120, available: false, experience: 10 },
  { id: 4, name: "يوسف الحربي", category: "painting", rating: 4.9, reviews: 74, price: 90, available: true, experience: 6 },
  { id: 5, name: "عمر الزهراني", category: "carpentry", rating: 4.6, reviews: 60, price: 110, available: true, experience: 8 },
  { id: 6, name: "سامي النجار", category: "cleaning", rating: 4.8, reviews: 140, price: 70, available: false, experience: 4 },
  { id: 7, name: "فيصل الدوسري", category: "electric", rating: 5.0, reviews: 33, price: 95, available: true, experience: 3 },
  { id: 8, name: "راشد المطيري", category: "plumbing", rating: 4.7, reviews: 88, price: 85, available: true, experience: 9 },
];

const StarRating = ({ rating }) => (
  <span className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
    ★ {rating}
  </span>
);

const WorkerCard = ({ worker }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group hover:-translate-y-1"
  >
    {/* Avatar area */}
    <div className="relative bg-gradient-to-br from-yellow-50 to-amber-100 p-6 pb-4">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-yellow-200 mx-auto">
        {worker.name.charAt(0)}
      </div>
      {/* availability badge */}
      <span
        className={`absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-full ${
          worker.available
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-500"
        }`}
      >
        {worker.available ? "• متاح الآن" : "• غير متاح"}
      </span>
    </div>

    <div className="p-5 text-right" dir="rtl">
      <h3 className="font-black text-gray-900 text-lg leading-tight">{worker.name}</h3>
      <p className="text-yellow-600 text-sm font-semibold mt-0.5">
        {categories.find((c) => c.id === worker.category)?.label}
      </p>

      <div className="flex items-center justify-between mt-3">
        <StarRating rating={worker.rating} />
        <span className="text-gray-400 text-xs">{worker.reviews} تقييم</span>
      </div>

      <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
        <span className="font-bold text-gray-800">
          {worker.price} ر.س<span className="font-normal text-gray-400">/ساعة</span>
        </span>
        <span>{worker.experience} سنوات خبرة</span>
      </div>

      <NavLink
        to={`/booking/${worker.id}`}
        className={`mt-4 w-full block text-center py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
          worker.available
            ? "bg-yellow-500 hover:bg-yellow-600 text-white shadow-md shadow-yellow-100 active:scale-95"
            : "bg-gray-100 text-gray-400 cursor-not-allowed pointer-events-none"
        }`}
      >
        {worker.available ? "احجز الآن" : "غير متاح"}
      </NavLink>
    </div>
  </motion.div>
);

const Search = () => {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  const filtered = mockWorkers
    .filter((w) => {
      const matchCat = activeCategory === "all" || w.category === activeCategory;
      const matchQuery =
        query === "" ||
        w.name.includes(query) ||
        categories.find((c) => c.id === w.category)?.label.includes(query);
      const matchAvail = onlyAvailable ? w.available : true;
      return matchCat && matchQuery && matchAvail;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      return 0;
    });

  return (
    <div className="min-h-screen bg-[#f8f6f3]" dir="rtl">
      {/* Header / Search bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="container mx-auto px-6 lg:px-20 py-4">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            {/* Search input */}
            <div className="relative flex-1 w-full">
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                🔍
              </span>
              <input
                type="text"
                placeholder="ابحث عن فني أو خدمة..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pr-11 pl-4 py-3 rounded-2xl border-2 border-gray-100 focus:border-yellow-400 focus:outline-none text-right bg-[#f8f6f3] font-medium text-gray-800 transition"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#f8f6f3] border-2 border-gray-100 focus:border-yellow-400 focus:outline-none rounded-2xl px-4 py-3 text-sm font-semibold text-gray-700 cursor-pointer transition"
            >
              <option value="rating">الأعلى تقييماً</option>
              <option value="reviews">الأكثر تقييماً</option>
              <option value="price_asc">السعر: الأقل أولاً</option>
              <option value="price_desc">السعر: الأعلى أولاً</option>
            </select>

            {/* Available toggle */}
            <button
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                onlyAvailable
                  ? "border-green-400 bg-green-50 text-green-700"
                  : "border-gray-100 bg-[#f8f6f3] text-gray-600 hover:border-gray-200"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
                  onlyAvailable ? "bg-green-500 border-green-500" : "border-gray-300"
                }`}
              >
                {onlyAvailable && (
                  <span className="text-white text-[10px] font-black">✓</span>
                )}
              </span>
              متاح الآن فقط
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-20 py-8">
        {/* Category pills */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all duration-200 border-2 ${
                activeCategory === cat.id
                  ? "bg-yellow-500 border-yellow-500 text-white shadow-md shadow-yellow-100"
                  : "bg-white border-gray-100 text-gray-600 hover:border-yellow-300 hover:text-yellow-600"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            <span className="font-black text-gray-900 text-base">{filtered.length}</span> فني متاح
          </p>
        </div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filtered.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <p className="text-6xl mb-4">🔍</p>
              <h3 className="text-xl font-black text-gray-800 mb-2">لا توجد نتائج</h3>
              <p className="text-gray-500">جرب تغيير الفئة أو كلمة البحث</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Search;
