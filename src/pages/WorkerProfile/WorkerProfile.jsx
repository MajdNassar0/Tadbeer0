import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Star, Briefcase, Clock, Calendar, 
  Share2, ShieldCheck, Wrench,
  Circle, Award, MessageCircle, Phone, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom"; 

const API_BASE   = "https://tadbeer0.runasp.net/api";
const IMAGE_BASE = "https://tadbeer0.runasp.net/";

// Returns a coloured avatar URL from a name string
const avatarUrl = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "W")}&background=001F3F&color=F7A823&size=200&bold=true`;

const reviewerAvatar = (name) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=F7A823&color=fff&size=80&bold=true`;

// Prepend IMAGE_BASE if the url is relative, otherwise return as-is
const fullImg = (url, fallback) => {
  if (!url) return fallback;
  return url.startsWith("http") ? url : `${IMAGE_BASE}${url}`;
};

const WorkerProfile = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [worker,  setWorker ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [page,    setPage   ] = useState(1);
  const reviewsPerPage = 4;

  const paginated  = reviews.slice((page - 1) * reviewsPerPage, page * reviewsPerPage);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  // ── Fetch reviews ──────────────────────────────────────────
  useEffect(() => {
    axios.get(`${API_BASE}/General/Reviews`, { params: { workerId: id } })
      .then(res => setReviews(res.data?.items ?? res.data ?? []))
      .catch(() => setReviews([]));
  }, [id]);

  // ── Fetch worker (both endpoints in parallel) ──────────────
  useEffect(() => {
    const fetchWorker = async () => {
      try {
        const [mainRes, profileRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/General/Workers/${id}`),
          axios.get(`${API_BASE}/General/Workers/${id}/profile`),
        ]);

        const main    = mainRes.status    === "fulfilled" ? (mainRes.value.data?.data    ?? mainRes.value.data)    : {};
        const profile = profileRes.status === "fulfilled" ? (profileRes.value.data?.data ?? profileRes.value.data) : {};

        // Merge: main wins for identity/phone/status, profile wins for workingHours/workImages
        setWorker({
          ...main,
          workingHours : profile.workingHours ?? main.workingHours ?? [],
          workImages   : profile.workImages   ?? main.workImages   ?? [],
          // phoneNumbers is array of {id, number, userId}
          phoneNumbers : main.phoneNumbers    ?? profile.phoneNumbers ?? [],
        });
      } catch (err) {
        console.error("Error fetching worker:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorker();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#F7A823]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-[#001F3F] rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );

  if (!worker) return (
    <div className="text-center py-20 font-bold text-red-500">العامل غير موجود</div>
  );

  const fullName   = `${worker.firstName ?? ""} ${worker.lastName ?? ""}`.trim();
  const workerPhoto = fullImg(worker.profileImage, avatarUrl(fullName));
  // phoneNumbers is [{id, number, userId}], phoneNumber is a plain string
  const phone = worker.phoneNumber || worker.phoneNumbers?.[0]?.number || null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans" dir="rtl">

      {/* Hero */}
      <div className="relative bg-[#001F3F] h-48 md:h-64 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Profile card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-gray-50">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

                {/* Photo */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#F7A823] rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                  <img
                    src={workerPhoto}
                    onError={(e) => { e.target.src = avatarUrl(fullName); }}
                    className="w-44 h-44 rounded-3xl border-8 border-white shadow-sm object-cover relative z-10"
                    alt={fullName}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-600 text-white rounded-full border-white z-20">
                    <Circle />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-right space-y-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                      <h1 className="text-4xl font-black text-[#001F3F]">{fullName}</h1>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-sm font-black border border-amber-100">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        {worker.avgRating?.toFixed(1) || "5.0"}
                      </div>
                    </div>
                    <p className="text-[#F7A823] font-bold text-lg flex items-center justify-center md:justify-start gap-2">
                      <Award size={20} />
                      {worker.specialtyNames?.[0] || "فني معتمد"}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-6 py-4 border-y border-gray-50">
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="bg-slate-100 p-2 rounded-lg"><Briefcase size={18} /></div>
                      <span className="font-bold">+{worker.experienceYears || 0} سنوات</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="bg-slate-100 p-2 rounded-lg"><MapPin size={18} /></div>
                      <span className="font-bold">{worker.city || "نابلس"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <div className="bg-slate-100 p-2 rounded-lg"><Clock size={18} /></div>
                      <span className="font-bold">
                        {worker.status === "Active" || worker.status === "active" ? "متاح الآن" : worker.status || "متاح الآن"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                    <button
                      onClick={() => navigate(`/booking/${worker.id}`)}
                      className="flex-1 md:flex-none bg-[#F7A823] hover:bg-[#e59a1d] text-white px-12 py-4 rounded-2xl font-black shadow-lg shadow-orange-200 transition-all active:scale-95"
                    >
                      احجز الموعد الآن
                    </button>
                    <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* About */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.section whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm md:col-span-2">
                <h2 className="text-xl font-black mb-4 text-[#001F3F] flex items-center gap-2">
                  <div className="w-2 h-8 bg-[#F7A823] rounded-full" />
                  نبذة تعريفية
                </h2>
                <p className="text-slate-500 leading-loose text-lg">
                  {worker.jobDescription || worker.bio ||
                    `فني محترف بخبرة واسعة في ${worker.specialtyNames?.[0] || "المجال التخصصي"}. ألتزم بتقديم حلول مبتكرة وعملية مع ضمان الجودة العالية في كافة التفاصيل التقنية والفنية.`}
                </p>
              </motion.section>

              {[
                { title: "أدوات حديثة",  icon: <Wrench />,     color: "bg-blue-500",  text: "نستخدم أحدث التقنيات لضمان دقة التنفيذ" },
                { title: "ضمان العمل",   icon: <ShieldCheck />, color: "bg-green-500", text: "نقدم ضمان حقيقي على كافة الخدمات" },
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm flex items-start gap-4">
                  <div className={`${item.color} p-3 rounded-2xl text-white shadow-lg`}>{item.icon}</div>
                  <div>
                    <h4 className="font-black text-[#001F3F]">{item.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Work images */}
            {worker.workImages?.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black mb-6 text-[#001F3F] flex items-center gap-2">
                  <div className="w-2 h-8 bg-[#F7A823] rounded-full" />
                  أعمال سابقة
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {worker.workImages.map((img, idx) => (
                    <div key={idx} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm group">
                      <img
                        src={fullImg(img.imageUrl, "")}
                        alt={`عمل ${idx + 1}`}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* ── Reviews ── */}
            <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mt-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black text-[#001F3F] flex items-center gap-2">
                  <div className="w-2 h-8 bg-[#F7A823] rounded-full" />
                  تقييمات العملاء
                </h2>
                <div className="flex items-center gap-2 bg-amber-50 text-amber-600 px-4 py-2 rounded-xl border border-amber-100">
                  <Star className="w-5 h-5 fill-amber-500" />
                  <span className="text-lg font-black">{worker.avgRating?.toFixed(1) || "5.0"}</span>
                </div>
              </div>

              {reviews.length === 0 ? (
                <p className="text-center text-slate-400 py-8">لا توجد تقييمات بعد</p>
              ) : (
                <div className="grid gap-4">
                  {paginated.map((r) => {
                    // Use userImage if API ever returns it, else fallback to avatar
                    const photo = r.userImage
                      ? fullImg(r.userImage, reviewerAvatar(r.userName))
                      : reviewerAvatar(r.userName);

                    return (
                      <div key={r.id}
                        className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            {/* ✅ User avatar in comment */}
                            <img
                              src={photo}
                              alt={r.userName}
                              className="w-10 h-10 rounded-full object-cover border-2 border-amber-100 shrink-0"
                              onError={(e) => { e.target.src = reviewerAvatar(r.userName); }}
                            />
                            <div>
                              <p className="font-bold text-gray-900 leading-tight">{r.userName}</p>
                              <div className="flex mt-1">
                                {[1,2,3,4,5].map((i) => (
                                  <Star key={i} size={12}
                                    className={i <= r.rate ? "text-amber-400 fill-amber-400" : "text-gray-200"} />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-md">
                            {r.rate}.0
                          </span>
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 leading-relaxed italic pr-4 border-r-2 border-amber-100">
                            "{r.comment || "هذا العميل لم يترك تعليقاً نصياً، قام بالتقييم فقط."}"
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {reviews.length > reviewsPerPage && (
                <div className="flex justify-center gap-2 mt-6">
                  <button onClick={() => setPage(p => Math.max(p - 1, 1))}
                    className="px-3 py-1 bg-gray-100 rounded-lg text-sm">السابق</button>
                  <span className="px-3 py-1 text-sm">{page} / {totalPages}</span>
                  <button onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                    className="px-3 py-1 bg-gray-100 rounded-lg text-sm">التالي</button>
                </div>
              )}
            </motion.section>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">

            {/* Contact */}
            <div className="bg-white rounded-[2rem] p-8 text-[#001F3F] relative overflow-hidden group shadow-2xl shadow-blue-900/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-6 relative z-10">تواصل مباشر</h3>
              <div className="space-y-4 relative z-10">
                {phone ? (
                  <>
                    <a href={`tel:${phone}`}
                      className="w-full hover:bg-amber-50 border border-amber-200 py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors">
                      <Phone size={20} className="text-[#F7A823]" />
                      <span className="font-bold">{phone}</span>
                    </a>
                    <a href={`https://wa.me/${phone.replace(/[^0-9]/g, "")}`}
                      target="_blank" rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg">
                      <MessageCircle size={20} />
                      <span className="font-bold">واتساب</span>
                    </a>
                  </>
                ) : (
                  <p className="text-center text-slate-400 text-sm py-2">لا يوجد رقم هاتف متاح</p>
                )}
              </div>
            </div>

            {/* Working hours */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 px-8 py-6 border-b border-gray-50">
                <h3 className="font-black flex items-center gap-3 text-[#001F3F]">
                  <Calendar className="w-5 h-5 text-[#F7A823]" />
                  أوقات العمل
                </h3>
              </div>
              <div className="p-8">
                {worker.workingHours?.length > 0 ? (
                  <div className="space-y-5">
                    {worker.workingHours.map((wh) => {
                      const dayNames = {
                        0: "الأحد", 1: "الاثنين", 2: "الثلاثاء", 3: "الأربعاء",
                        4: "الخميس", 5: "الجمعة", 6: "السبت",
                        Sunday:"الأحد", Monday:"الاثنين", Tuesday:"الثلاثاء",
                        Wednesday:"الأربعاء", Thursday:"الخميس", Friday:"الجمعة", Saturday:"السبت",
                      };
                      const dayLabel = wh.dayOfWeek != null ? (dayNames[wh.dayOfWeek] ?? wh.dayOfWeek) : "—";
                      const fmt = (t) => t?.slice(0, 5) || "—";
                      return (
                        <div key={wh.id} className="flex justify-between items-center">
                          <span className="text-slate-600 font-bold">{dayLabel}</span>
                          <div className="h-px flex-1 mx-4 bg-slate-100" />
                          <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-black">
                            {fmt(wh.startTime)} - {fmt(wh.endTime)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm text-center">لا تتوفر أوقات عمل محددة</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-center text-white relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')] bg-center bg-no-repeat" />
              <MapPin className="mx-auto mb-3 text-[#F7A823]" size={32} />
              <p className="font-black text-lg">منطقة الخدمة</p>
              <p className="text-slate-400 text-sm mt-1">يغطي كافة مناطق مدينة {worker.city || "نابلس"}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
