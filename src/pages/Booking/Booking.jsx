import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star, MapPin, Briefcase, Clock, Calendar,
  ChevronRight, ChevronLeft, Check, ArrowRight,
  AlertCircle, CheckCircle2, XCircle, Loader2,X
} from "lucide-react";
import { toast, Toaster } from "sonner";

const API        = "https://tadbeer0.runasp.net/api";
const IMAGE_BASE = "https://tadbeer0.runasp.net/";

const JS_DAY_TO_NAME = [
  "sunday","monday","tuesday","wednesday","thursday","friday","saturday"
];

const DAYS_AR = {
  saturday : "السبت",   sunday   : "الأحد",
  monday   : "الاثنين", tuesday  : "الثلاثاء",
  wednesday: "الأربعاء",thursday : "الخميس",
  friday   : "الجمعة",
};

const MONTH_NAMES_AR = [
  "يناير","فبراير","مارس","أبريل","مايو","يونيو",
  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"
];

// Sat=0 … Fri=6 for RTL header
const DAY_NAMES_AR  = ["سبت","أحد","اثن","ثلا","أربع","خمس","جمعة"];
// JS Sun=0 → RTL col where Sat=0
const JS_TO_RTL_COL = [1, 2, 3, 4, 5, 6, 0];

const STEPS = [
  { key: "Pending",   label: "قيد الانتظار" },
  { key: "Confirmed", label: "مقبول"         },
  { key: "Completed", label: "مكتمل"         },
  { key: "Cancelled", label: "ملغى"          },
];

// ONLY THIS PART CHANGED
const STATUS_STYLE = {
  Pending   : { cls: "bg-yellow-50 text-yellow-700", label: "قيد الانتظار" },
  Confirmed : { cls: "bg-blue-50   text-blue-700",   label: "تم القبول" },
  Accepted:  { label: "مقبول",        cls: "bg-blue-50 text-blue-600 border-blue-100" }, 
  Completed : { cls: "bg-green-50  text-green-700",  label: "مكتمل" },
  Cancelled : { cls: "bg-red-50    text-red-700",    label: "ملغى" },
};

function buildCalendar(year, month) {
  const firstDayJS  = new Date(year, month, 1).getDay();
  const firstColRTL = JS_TO_RTL_COL[firstDayJS];
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = [];
  for (let i = 0; i < firstColRTL; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);
  return days;
}

// ── Status bar ────────────────────────────────────────────────────────────────
function StatusBar({ status }) {
  const cancelled   = status === "Cancelled";
  const activeIndex = STEPS.findIndex(s => s.key === status);

  return (
    <div className="bg-white rounded-3xl border border-gray-100 p-5">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 right-6 left-6 h-px bg-gray-100 z-0" />
        {STEPS.map((step, i) => {
          const done    = i < activeIndex;
          const current = i === activeIndex;
          const isCan   = step.key === "Cancelled" && cancelled;
          return (
            <div key={step.key} className="flex flex-col items-center gap-2 relative z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                               border-2 transition-all
                ${current && isCan  ? "bg-red-500    border-red-500    text-white"
                : current           ? "bg-[#001F3F]  border-[#001F3F]  text-white shadow-lg"
                : done              ? "bg-yellow-400 border-yellow-400 text-white"
                :                    "bg-white       border-gray-200   text-gray-300"}`}>
                {done          ? <Check size={16} />
                : current&&isCan? <XCircle size={16} />
                : current       ? <div className="w-2.5 h-2.5 rounded-full bg-white" />
                :                 <div className="w-2 h-2 rounded-full bg-gray-200" />}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap
                ${current&&isCan? "text-red-500"
                : current       ? "text-[#001F3F]"
                : done          ? "text-yellow-500"
                :                 "text-gray-300"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Worker hero card ──────────────────────────────────────────────────────────
function WorkerHeroCard({ worker }) {
  const img  = worker.profileImage && worker.profileImage !== "string"
    ? `${IMAGE_BASE}${worker.profileImage}` : null;
  const name = `${worker.firstName ?? ""} ${worker.lastName ?? ""}`.trim();

  return (
    <div className="bg-[#001F3F] rounded-3xl p-6 flex items-center justify-between relative overflow-hidden">
      <div className="absolute left-0 top-0 w-48 h-48 bg-white/5 rounded-full -translate-x-16 -translate-y-16" />
      <div className="relative z-10 flex-1 min-w-0">
        <p className="text-gray-400 text-xs mb-1">الفني</p>
        <h2 className="text-white text-xl font-medium mb-1">المهندس {name}</h2>
        <p className="text-yellow-400 text-xs mb-3">✏️ {worker.specialtyNames?.[0] || "فني متخصص"}</p>
        <div className="flex flex-wrap gap-2">
          {worker.city && (
            <span className="bg-white/10 text-gray-300 text-[10px] px-3 py-1 rounded-full flex items-center gap-1">
              <MapPin size={9} /> {worker.city}
            </span>
          )}
          {worker.experienceYears != null && (
            <span className="bg-white/10 text-gray-300 text-[10px] px-3 py-1 rounded-full flex items-center gap-1">
              <Briefcase size={9} /> {worker.experienceYears}+ سنوات خبرة
            </span>
          )}
          {worker.emailConfirmed && (
            <span className="bg-white/10 text-gray-300 text-[10px] px-3 py-1 rounded-full">
              ✓ فني معتمد
            </span>
          )}
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-2 mr-4 flex-shrink-0">
        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/20 bg-white/10">
          {img
            ? <img src={img} alt={name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-white text-2xl font-medium">
                {worker.firstName?.[0] ?? "ف"}
              </div>
          }
        </div>
        {worker.avgRating != null && (
          <div className="flex items-center gap-1 bg-yellow-400 text-[#001F3F] px-2.5 py-1 rounded-xl">
            <Star size={11} className="fill-[#001F3F]" />
            <span className="text-xs font-medium">{worker.avgRating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ReviewModal({ booking, onClose, onDone }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const submit = async () => {
    if (!rating) {
      toast.error("يرجى اختيار التقييم");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      await axios.post(`${API}/User/Reviews`, {
        bookingId: booking.id,
        workerId: booking.workerId,
        rate: rating,
        comment: comment.trim() || null,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setDone(true);
      toast.success("تم إرسال التقييم بنجاح!");
      setTimeout(onDone, 1200);

    } catch (err) {
      const msg = err.response?.data?.message || "";

      if (msg.toLowerCase().includes("already")) {
        toast.error("لقد قمت بتقييم هذا الحجز مسبقاً");
      } else {
        toast.error("فشل إرسال التقييم، يرجى المحاولة لاحقاً");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" dir="rtl">
      <div className="bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="p-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
            <h3 className="text-lg font-bold text-[#001F3F]">تقييم الخدمة</h3>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-500 transition-colors">
              <X size={24} />
            </button>
          </div>

          {done ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} className="text-green-500" />
              </div>
              <p className="text-gray-700 font-bold">شكراً على تقييمك!</p>
            </div>
          ) : (
            <>
              {/* ⭐ Rating */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600 mb-3 font-medium">
                  كيف تقيّم تجربتك مع الفني؟
                </p>

                <div className="flex justify-center gap-2">
                  {[1,2,3,4,5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star
                        size={30}
                        className={
                          star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-200"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* (Optional) Categories display only */}
              <div className="space-y-2 mb-6 text-xs text-gray-400 text-center">
                <p>الاحترافية • التواصل • الجودة • الخبرة • الالتزام بالوقت</p>
              </div>

              {/* Comment */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 mr-1">
                  إضافة تعليق (اختياري)
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="كيف كانت تجربتك مع الفني؟"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-[#001F3F]/10 h-24 resize-none transition-all"
                />
              </div>

              {/* Submit */}
              <button
                onClick={submit}
                disabled={loading}
                className="w-full mt-8 bg-[#001F3F] text-white py-4 rounded-2xl font-bold text-sm hover:bg-blue-900 shadow-xl shadow-blue-900/10 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "جارٍ الإرسال..." : "إرسال التقييم"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


// ── Main ──────────────────────────────────────────────────────────────────────
const Booking = () => {
  const { workerId } = useParams();
  const navigate     = useNavigate();

  const [worker,     setWorker    ] = useState(null);
  const [loading,    setLoading   ] = useState(true);
  // Existing bookings for this worker (to gray out taken slots)
  const [takenSlots, setTakenSlots] = useState([]);

  const today = new Date();
  const [calYear,  setCalYear ] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selDate,  setSelDate ] = useState(null);
  const [selSlot,  setSelSlot ] = useState(null);

  const [notes,      setNotes     ] = useState("");
  const [submitting, setSubmitting ] = useState(false);
  const [booked,     setBooked    ] = useState(false);
  const [bookingRes, setBookingRes ] = useState(null);
  const [liveStatus, setLiveStatus ] = useState("Pending");
  const [refreshKey, setRefreshKey ] = useState(0);

  const [rateBook,   setRateBook  ] = useState(null);

  // Fetch worker
  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${API}/General/Workers/${workerId}`);
        const data = res.data?.data || res.data;
        if (!data?.id) throw new Error();
        setWorker(data);
      } catch {
        setWorker(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [workerId]);

  // Fetch existing bookings to mark taken slots
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await axios.get(`${API}/User/Bookings`,
          { headers: { Authorization: `Bearer ${token}` } });
        const items = (res.data.items ?? res.data ?? [])
          .filter(b => b.workerId === workerId &&
            !["cancelled"].includes(b.status?.toLowerCase()));
        setTakenSlots(items);
      } catch {}
    };
    load();
  }, [workerId, refreshKey]);

  // Poll live status after booking
  const pollStatus = useCallback(async () => {
    if (!bookingRes?.id) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/User/Bookings/${bookingRes.id}`,
        { headers: { Authorization: `Bearer ${token}` } });
      setLiveStatus(res.data.status ?? "Pending");
    } catch {}
  }, [bookingRes]);

  useEffect(() => {
    if (!booked) return;
    pollStatus();
    const interval = setInterval(pollStatus, 5000);
    return () => clearInterval(interval);
  }, [booked, pollStatus]);

  const workingHours = worker?.workingHours ?? [];

  const getDayName = (year, month, day) =>
    JS_DAY_TO_NAME[new Date(year, month, day).getDay()];

  const getSlotsForDate = (year, month, day) => {
    const dayName = getDayName(year, month, day);
    return workingHours.filter(wh => wh.dayOfWeek?.toLowerCase() === dayName);
  };

  // Check if a slot is taken on a given date
  const isSlotTaken = (slot, year, month, day) => {
    const pad = n => String(n).padStart(2, "0");
    const dateStr = `${year}-${pad(month+1)}-${pad(day)}`;
    return takenSlots.some(b =>
      b.workingHourId === slot.id &&
      b.bookingDate?.startsWith(dateStr)
    );
  };

  const availableSlots = selDate
    ? getSlotsForDate(selDate.year, selDate.month, selDate.day)
    : [];

  const isPastDay = (day) => {
    if (!day) return false;
    const d = new Date(calYear, calMonth, day); d.setHours(0,0,0,0);
    const t = new Date(); t.setHours(0,0,0,0);
    return d < t;
  };

  const hasSlots = (day) => {
    if (!day) return false;
    const dayName = getDayName(calYear, calMonth, day);
    return workingHours.some(wh => wh.dayOfWeek?.toLowerCase() === dayName);
  };

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11); }
    else setCalMonth(m => m-1);
    setSelDate(null); setSelSlot(null);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0); }
    else setCalMonth(m => m+1);
    setSelDate(null); setSelSlot(null);
  };

  const handleBook = async () => {
    if (!selDate || !selSlot) {
      toast.error("يرجى اختيار التاريخ والوقت أولاً");
      return;
    }
    const dateDayName = getDayName(selDate.year, selDate.month, selDate.day);
    if (dateDayName !== selSlot.dayOfWeek?.toLowerCase()) {
      toast.error("الوقت المختار لا يتوافق مع التاريخ، يرجى إعادة الاختيار");
      setSelSlot(null);
      return;
    }
    if (isSlotTaken(selSlot, selDate.year, selDate.month, selDate.day)) {
      toast.error("هذا الموعد محجوز بالفعل، يرجى اختيار وقت آخر");
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const pad = n => String(n).padStart(2, "0");
      const bookingDate =
        `${selDate.year}-${pad(selDate.month+1)}-${pad(selDate.day)}`;
      const res = await axios.post(`${API}/User/Bookings`, {
        workerId,
        workingHourId: selSlot.id,
        bookingDate,
        startTime: selSlot.startTime,
        endTime:   selSlot.endTime,
      }, { headers: { Authorization: `Bearer ${token}` } });
      setBookingRes(res.data);
      setLiveStatus(res.data.status ?? "Pending");
      setBooked(true);
      setRefreshKey(k => k + 1);
      toast.success("تم الحجز بنجاح!");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.title || "";
      const lmsg = msg.toLowerCase();
      if (lmsg.includes("outside") || lmsg.includes("availability")) {
        toast.error("الوقت المختار خارج أوقات عمل الفني");
      } else if (lmsg.includes("already booked") || lmsg.includes("conflict")) {
        toast.error("هذا الموعد محجوز بالفعل، يرجى اختيار وقت آخر");
      } else if (err.response?.status === 401) {
        toast.error("يرجى تسجيل الدخول أولاً");
        navigate("/auth/login");
      } else if (err.response?.status === 400) {
        toast.error("بيانات الحجز غير صحيحة، يرجى المحاولة مجدداً");
      } else {
        toast.error("فشل الحجز، يرجى المحاولة مجدداً");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!worker) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4" dir="rtl">
      <AlertCircle size={40} className="text-red-300" />
      <p className="text-gray-500">لم يتم العثور على الفني</p>
      <button onClick={() => navigate("/workers")}
              className="text-sm text-yellow-600 underline">
        العودة لقائمة الفنيين
      </button>
    </div>
  );

  const calDays = buildCalendar(calYear, calMonth);

  // ── After booking: status page ──
  if (booked) return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans pb-16">
      <Toaster position="top-center" richColors />
      {rateBook && (
        <ReviewModal
          booking={rateBook}
          onClose={() => setRateBook(null)}
          onDone={() => { setRateBook(null); setRefreshKey(k => k+1); }}
        />
      )}

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-5">
        <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm">
          <ArrowRight size={16} /> العودة
        </button>

        <WorkerHeroCard worker={worker} />
        <StatusBar status={liveStatus} />

        {/* Booking details */}
        <div className="bg-white rounded-3xl border border-gray-100 p-6 space-y-3">
          <h3 className="text-sm font-medium text-gray-700">تفاصيل الحجز</h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[
              { label: "التاريخ", value: selDate
                  ? `${selDate.day} ${MONTH_NAMES_AR[selDate.month]} ${selDate.year}`
                  : "—" },
              { label: "الوقت", value: selSlot
                  ? `${selSlot.startTime?.slice(0,5)} – ${selSlot.endTime?.slice(0,5)}`
                  : "—" },
              { label: "اليوم", value: selSlot
                  ? DAYS_AR[selSlot.dayOfWeek?.toLowerCase()] ?? "—"
                  : "—" },
              { label: "المدة", value: bookingRes?.durationMinutes
                  ? `${bookingRes.durationMinutes} دقيقة`
                  : "—" },
            ].map((row, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-3">
                <p className="text-gray-400 mb-1">{row.label}</p>
                <p className="font-medium text-gray-700">{row.value}</p>
              </div>
            ))}
          </div>

          {/* Status messages */}
          {liveStatus === "Pending" && (
            <div className="flex items-center gap-2 bg-yellow-50 rounded-2xl p-3">
              <Loader2 size={14} className="text-yellow-500 animate-spin flex-shrink-0" />
              <p className="text-xs text-yellow-700">في انتظار موافقة الفني على حجزك</p>
            </div>
          )}
          {liveStatus === "Confirmed" && (
            <div className="flex items-center gap-2 bg-blue-50 rounded-2xl p-3">
              <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0" />
              <p className="text-xs text-blue-700">تم قبول حجزك من قِبل الفني</p>
            </div>
          )}
          {liveStatus === "Completed" && (
            <div className="flex items-center gap-2 bg-green-50 rounded-2xl p-3">
              <CheckCircle2 size={14} className="text-green-500 flex-shrink-0" />
              <p className="text-xs text-green-700">
                تم إتمام الخدمة — يمكنك الآن تقييم الفني من قائمة حجوزاتك أدناه
              </p>
            </div>
          )}
          {liveStatus === "Cancelled" && (
            <div className="flex items-center gap-2 bg-red-50 rounded-2xl p-3">
              <XCircle size={14} className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-700">تم إلغاء الحجز</p>
            </div>
          )}
        </div>

        {/* All bookings with this worker */}
        <MyBookingsList
          workerId={workerId}
          refreshKey={refreshKey}
          onRate={b => setRateBook(b)}
        />

        <button
          onClick={() => navigate("/")}
          className="w-full bg-[#001F3F] text-white py-4 rounded-2xl text-sm
                     font-medium hover:bg-[#002a52] transition-colors"
        >
          العودة للرئيسية
        </button>
      </div>
    </div>
  );

  // ── Booking form ──
  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 font-sans pb-16">
      <Toaster position="top-center" richColors />

      <div className="max-w-5xl mx-auto px-4 pt-6">
        <button onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-gray-400 hover:text-gray-600 text-sm mb-4">
          <ArrowRight size={16} /> العودة
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: form ── */}
        <div className="lg:col-span-2 space-y-5">

          <WorkerHeroCard worker={worker} />

          

          {rateBook && (
            <ReviewModal
              booking={rateBook}
              onClose={() => setRateBook(null)}
              onDone={() => { setRateBook(null); setRefreshKey(k => k+1); }}
            />
          )}

          {/* Calendar */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-5 flex items-center gap-2">
              <Calendar size={16} className="text-yellow-500" />
              اختر الموعد المناسب
            </h3>

            {workingHours.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 mb-4
                              flex items-center gap-3">
                <AlertCircle size={16} className="text-yellow-500 flex-shrink-0" />
                <p className="text-xs text-yellow-700">هذا الفني لم يحدد أوقات عمله بعد</p>
              </div>
            )}

            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ChevronRight size={18} className="text-gray-400" />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {MONTH_NAMES_AR[calMonth]} {calYear}
              </span>
              <button onClick={prevMonth}
                      className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <ChevronLeft size={18} className="text-gray-400" />
              </button>
            </div>

            {/* Day headers — Sat first */}
            <div className="grid grid-cols-7 mb-2">
              {DAY_NAMES_AR.map(d => (
                <div key={d} className="text-center text-[10px] text-gray-400 py-1 font-medium">
                  {d}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {calDays.map((day, i) => {
                if (!day) return <div key={i} />;
                const past       = isPastDay(day);
                const slots      = hasSlots(day);
                const isSelected = selDate?.day === day &&
                                   selDate?.month === calMonth &&
                                   selDate?.year  === calYear;
                return (
                  <button
                    key={i}
                    disabled={past || !slots}
                    onClick={() => { setSelDate({ year: calYear, month: calMonth, day }); setSelSlot(null); }}
                    className={`relative h-10 w-full rounded-xl text-sm transition-all font-medium
                      ${isSelected
                        ? "bg-[#001F3F] text-white shadow-md"
                        : past
                          ? "text-gray-200 cursor-not-allowed"
                          : !slots
                            ? "text-gray-300 cursor-not-allowed"
                            : "hover:bg-yellow-50 text-gray-700"
                      }`}
                  >
                    {day}
                    {slots && !past && !isSelected && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2
                                       w-1 h-1 rounded-full bg-yellow-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-50">
              {[
                { color: "bg-yellow-400", label: "يوم متاح" },
                { color: "bg-[#001F3F]",  label: "اليوم المختار" },
                { color: "bg-gray-200",   label: "غير متاح" },
              ].map(l => (
                <div key={l.label} className="flex items-center gap-1.5 text-[10px] text-gray-400">
                  <span className={`w-2 h-2 rounded-full ${l.color} inline-block`} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>

          {/* Time slots */}
          {selDate && (
            <div className="bg-white rounded-3xl border border-gray-100 p-6">
              <h3 className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                <Clock size={16} className="text-yellow-500" />
                الأوقات المتاحة
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                {DAYS_AR[getDayName(selDate.year, selDate.month, selDate.day)]}
                {" — "}
                {selDate.day} {MONTH_NAMES_AR[selDate.month]} {selDate.year}
              </p>

              {availableSlots.length === 0 ? (
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
                  <AlertCircle size={16} className="text-gray-300 flex-shrink-0" />
                  <p className="text-sm text-gray-400">لا توجد أوقات متاحة في هذا اليوم</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {availableSlots.map((slot, i) => {
                    const taken    = isSlotTaken(slot, selDate.year, selDate.month, selDate.day);
                    const isSel    = selSlot?.id === slot.id;
                    return (
                      <button
                        key={slot.id ?? i}
                        disabled={taken}
                        onClick={() => !taken && setSelSlot(slot)}
                        className={`py-3 px-4 rounded-2xl text-sm border transition-all text-right relative
                          ${taken
                            ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed opacity-50"
                            : isSel
                              ? "bg-[#001F3F] text-white border-[#001F3F] shadow-md"
                              : "bg-gray-50 text-gray-700 border-gray-100 hover:border-yellow-400 hover:bg-yellow-50"
                          }`}
                      >
                        <div className="font-medium">{slot.startTime?.slice(0,5)}</div>
                        <div className={`text-[10px] mt-0.5
                          ${taken ? "text-gray-300"
                          : isSel ? "text-gray-300"
                          : "text-gray-400"}`}>
                          {taken ? "محجوز" : `حتى ${slot.endTime?.slice(0,5)}`}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-5 h-5 bg-yellow-400 rounded-lg flex items-center justify-center text-[10px]">📋</span>
              تفاصيل الخدمة المطلوبة
            </h3>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="اكتب تفاصيل المشكلة أو الخدمة المطلوبة..."
              rows={4}
              className="w-full border border-gray-100 rounded-2xl p-4 text-sm
                         outline-none focus:ring-2 focus:ring-yellow-400/30 bg-gray-50
                         resize-none text-gray-700 placeholder:text-gray-300"
            />
          </div>
        </div>
        

        {/* ── Right: sticky summary ── */}
        <div>
          <div className="bg-white rounded-3xl border border-gray-100 p-6 sticky top-6 space-y-4">
            <h3 className="text-sm font-medium text-gray-700">ملخص الحجز</h3>

            {[
              { icon: <Calendar size={14} className="text-yellow-500" />, label: "التاريخ",
                value: selDate
                  ? `${selDate.day} ${MONTH_NAMES_AR[selDate.month]} ${selDate.year}`
                  : null },
              { icon: <Clock size={14} className="text-yellow-500" />, label: "الوقت",
                value: selSlot
                  ? `${selSlot.startTime?.slice(0,5)} – ${selSlot.endTime?.slice(0,5)}`
                  : null },
              { icon: <MapPin size={14} className="text-yellow-500" />, label: "الموقع",
                value: worker.city || null },
              { icon: <Briefcase size={14} className="text-yellow-500" />, label: "التخصص",
                value: worker.specialtyNames?.[0] || null },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl text-xs">
                {row.icon}
                <div>
                  <p className="text-gray-400">{row.label}</p>
                  <p className="font-medium text-gray-700 mt-0.5">
                    {row.value ?? <span className="text-gray-300">لم يتم الاختيار</span>}
                  </p>
                </div>
              </div>
            ))}

            {/* Working hours in sidebar — Sat, Sun, Mon order */}
            {workingHours.length > 0 && (
              <div className="pt-3 border-t border-gray-50">
                <p className="text-[10px] text-gray-400 mb-2 flex items-center gap-1.5">
                  <Clock size={11} className="text-yellow-500" />
                  أوقات عمل الفني
                </p>
                <div className="space-y-1.5">
                  {[...workingHours]
                    .sort((a, b) => {
                      const order = ["saturday","sunday","monday","tuesday","wednesday","thursday","friday"];
                      return order.indexOf(a.dayOfWeek?.toLowerCase()) -
                             order.indexOf(b.dayOfWeek?.toLowerCase());
                    })
                    .map((wh, i) => (
                      <div key={i} className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-500">
                          {DAYS_AR[wh.dayOfWeek?.toLowerCase()] ?? wh.dayOfWeek}
                        </span>
                        <span className="text-gray-700 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                          {wh.startTime?.slice(0,5)} – {wh.endTime?.slice(0,5)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <button
              onClick={handleBook}
              disabled={submitting || !selDate || !selSlot}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#001F3F] font-medium
                         py-4 rounded-2xl text-sm transition-all disabled:opacity-40
                         disabled:cursor-not-allowed"
            >
              {submitting
                ? <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#001F3F] border-t-transparent rounded-full animate-spin" />
                    جارٍ الحجز...
                  </span>
                : "تأكيد الحجز"
              }
            </button>

            {(!selDate || !selSlot) && (
              <p className="text-[10px] text-gray-300 text-center">
                يرجى اختيار التاريخ والوقت أولاً
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Previous bookings with this worker — shown before submitting */}
          <MyBookingsList
            workerId={workerId}
            refreshKey={refreshKey}
            onRate={b => setRateBook(b)}
          />
    </div>
    
  );
};

function MyBookingsList({ workerId, refreshKey, onRate }) {
  const [bookings, setBookings] = useState(null);
  const [reviews, setReviews] = useState([]);

  // ✅ pagination
  const [page, setPage] = useState(1);
  const pageSize = 3;

  const load = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(`${API}/User/Bookings`,
        { headers: { Authorization: `Bearer ${token}` } });
      const items = (res.data.items ?? res.data ?? [])
        .filter(b => b.workerId === workerId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(items);
    } catch {
      setBookings([]);
    }
  }, [workerId]);
 useEffect(() => {
  const loadReviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/General/Reviews`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          workerId: workerId 
        }
      });

      setReviews(res.data.items ?? res.data ?? []);
    } catch (err) {
      console.error(
        "Error loading reviews:",
        err.response?.data || err.message || err
      );

      setReviews([]); 
    }
  };

  loadReviews();
}, [workerId]);

  useEffect(() => { load(); }, [load, refreshKey]);

  useEffect(() => {
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  if (!bookings) return (
    <div className="max-w-5xl mx-auto px-4 flex justify-center py-8">
      <Loader2 size={24} className="animate-spin text-yellow-500/50" />
    </div>
  );

  if (bookings.length === 0) return null;

  // ✅ pagination logic
  const start = (page - 1) * pageSize;
  const paginated = bookings.slice(start, start + pageSize);

  return (
    <div className="max-w-5xl mx-auto px-4 mb-6">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#001F3F] flex items-center gap-2">
            <div className="w-1.5 h-4 bg-yellow-400 rounded-full" />
            سجل حجوزاتي مع الفني
          </h3>
          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
            {bookings.length} حجز
          </span>
        </div>

        <div className="space-y-3">
          {paginated.map(b => {
            const isRated = reviews.some(r => r.bookingId === b.id);
            const s = STATUS_STYLE[b.status] ?? { cls: "bg-gray-100 text-gray-400", label: b.status };
            const date = b.bookingDate
              ? new Date(b.bookingDate).toLocaleDateString("ar-EG", { day: 'numeric', month: 'long' }) 
              : "—";
              
            return (
              <div key={b.id}
                   className="group relative flex items-center justify-between p-4 bg-[#F8FAFC] 
                              hover:bg-white border border-transparent hover:border-yellow-100 
                              rounded-2xl transition-all duration-300">
                
                <div className="flex items-center gap-4 min-w-0">
                  <div className="hidden sm:flex w-10 h-10 rounded-xl bg-white border border-gray-100 
                                  items-center justify-center text-[#001F3F] shadow-sm">
                    <Calendar size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 truncate mb-1">
                      {DAYS_AR[b.workingDay?.toLowerCase()] ?? b.workingDay}، {date}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded-md border border-gray-50">
                        <Clock size={10} className="text-yellow-500" />
                        {b.startTime?.slice(0,5)} – {b.endTime?.slice(0,5)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm ${s.cls}`}>
                    {s.label}
                  </span>

                  {b.status === "Completed" && (
  <button
    onClick={() => !isRated && onRate(b)}
    disabled={isRated}
    className={`flex items-center gap-2 text-[11px] font-semibold px-4 py-2.5 rounded-xl transition-all
      ${
        isRated
          ? "bg-yellow-500 text-white cursor-not-allowed"
          : "bg-yellow-400 text-[#001F3F] hover:bg-yellow-300"
      }`}
  >
    <Star size={12} className={isRated ? "" : "fill-[#001F3F]"} />
    {isRated ? "تم التقييم" : "تقييم"}
  </button>
)}
                </div>
              </div>
            );
          })}
        </div>
{/* ✅ pagination UI */}
{bookings.length > pageSize && (
  <div className="flex justify-center items-center gap-6 pt-6 border-t border-gray-50">
    {/* Previous Button (Points Right in RTL) */}
    <button
      onClick={() => setPage(p => Math.max(p - 1, 1))}
      disabled={page === 1}
      className="p-2 rounded-xl bg-gray-50 text-[#001F3F] disabled:opacity-20 hover:bg-yellow-50 transition-all"
    >
      <ChevronRight size={18} />
    </button>

    {/* Page Counter */}
    <span className="text-xs font-bold text-gray-400">
      صفحة {page} من {Math.ceil(bookings.length / pageSize)}
    </span>

    {/* Next Button (Points Left in RTL) */}
    <button
      onClick={() =>
        setPage(p => Math.min(p + 1, Math.ceil(bookings.length / pageSize)))
      }
      disabled={page === Math.ceil(bookings.length / pageSize)}
      className="p-2 rounded-xl bg-gray-50 text-[#001F3F] disabled:opacity-20 hover:bg-yellow-50 transition-all"
    >
      <ChevronLeft size={18} />
    </button>
  </div>
)}
      </div>
    </div>
  );
}
export default Booking;