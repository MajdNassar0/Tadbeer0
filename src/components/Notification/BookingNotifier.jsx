import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, CalendarCheck, Clock, User } from "lucide-react";

const API = "https://tadbeer0.runasp.net/api";

const MONTH_NAMES_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

// ── Single Toast Card ─────────────────────────────────────────
function BookingToast({ id, workerName, serviceName, date, startTime, endTime, onDismiss }) {
  // Auto-dismiss after 6s
  useEffect(() => {
    const t = setTimeout(() => onDismiss(id), 6000);
    return () => clearTimeout(t);
  }, [id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.92 }}
      animate={{ opacity: 1, x: 0,  scale: 1     }}
      exit={{    opacity: 0, x: 80, scale: 0.88, transition: { duration: 0.25 } }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      dir="rtl"
      style={{ fontFamily: "'Tajawal', sans-serif" }}
      className="relative w-80 overflow-hidden rounded-2xl shadow-2xl"
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#001628]" />
      <div className="absolute inset-0 opacity-30"
        style={{
          background: "radial-gradient(ellipse at 10% 0%, #f7a82344 0%, transparent 60%), radial-gradient(ellipse at 90% 100%, #00408044 0%, transparent 60%)",
        }}
      />
      {/* Animated shimmer line on top */}
      <motion.div
        className="absolute top-0 left-0 h-[2px] bg-gradient-to-l from-transparent via-[#F7A823] to-transparent"
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 6, ease: "linear" }}
      />

      {/* Content */}
      <div className="relative p-4 pr-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            {/* Icon badge */}
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-[#F7A823]/15 flex items-center justify-center">
                <CalendarCheck size={18} className="text-[#F7A823]" />
              </div>
              {/* Green dot */}
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-[#001628]" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-[#F7A823] tracking-wide uppercase">
                تم قبول حجزك
              </p>
              <p className="text-[10px] text-white/40 mt-0.5">إشعار جديد</p>
            </div>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => onDismiss(id)}
            className="text-white/30 hover:text-white/70 transition-colors mt-0.5 flex-shrink-0"
          >
            <X size={14} />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/5 mb-3" />

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User size={12} className="text-white/40 flex-shrink-0" />
            <p className="text-xs text-white/90 font-semibold">
              {workerName}
              <span className="text-white/40 font-normal"> وافق على طلبك</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-green-400 flex-shrink-0" />
            <p className="text-xs text-white/80">
              خدمة: <span className="text-white font-bold">{serviceName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={12} className="text-white/40 flex-shrink-0" />
            <p className="text-xs text-white/60">
              {date}
              {startTime && endTime && (
                <span className="text-white/40"> · {startTime} — {endTime}</span>
              )}
            </p>
          </div>
        </div>

        {/* Bottom progress pill */}
        <div className="mt-4 h-1 w-full rounded-full bg-white/5 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-l from-[#F7A823] to-[#ffca5a]"
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 6, ease: "linear" }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ── Toast Container (bottom-left corner) ─────────────────────
function ToastContainer({ toasts, onDismiss }) {
  return createPortal(
    <div
      className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3 items-end"
      style={{ pointerEvents: "none" }}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: "auto" }}>
            <BookingToast {...t} onDismiss={onDismiss} />
          </div>
        ))}
      </AnimatePresence>
    </div>,
    document.body
  );
}

// ── Main Component ────────────────────────────────────────────
function BookingNotifier() {
  const { user } = useAuth();
  const intervalRef = useRef(null);
  const [toasts, setToasts] = useState([]);

  const dismiss = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const pushToast = (data) => {
    const id = `${data.bookingId}_${Date.now()}`;
    setToasts((prev) => [...prev.slice(-3), { id, ...data }]); // max 4 stacked
  };

  useEffect(() => {
    if (!user) return;
    const role = (user.role ?? user.userType ?? "").toLowerCase();
    if (role === "worker" || role === "admin") return;

    const checkBookings = async () => {
      const token = localStorage.getItem("token");
      if (!token) { clearInterval(intervalRef.current); return; }

      try {
        const res = await axios.get(`${API}/User/Bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let bookings = [];
        if (Array.isArray(res.data))               bookings = res.data;
        else if (Array.isArray(res.data?.items))   bookings = res.data.items;
        else if (Array.isArray(res.data?.data?.items)) bookings = res.data.data.items;

        const accepted = bookings.filter((b) => {
          const s = b.status?.toLowerCase();
          return s === "confirmed" || s === "accepted";
        });

        if (accepted.length === 0) return;

        const storageKey = `notifiedBookings_${user.email}`;
        const alreadyNotified = JSON.parse(localStorage.getItem(storageKey) || "[]");
        const newlyAccepted = accepted.filter((b) => !alreadyNotified.includes(b.id));
        if (newlyAccepted.length === 0) return;

        localStorage.setItem(
          storageKey,
          JSON.stringify([...alreadyNotified, ...newlyAccepted.map((b) => b.id)])
        );

        newlyAccepted.forEach((b) => {
          const d = b.bookingDate ? new Date(b.bookingDate) : null;
          const date = d ? `${d.getDate()} ${MONTH_NAMES_AR[d.getMonth()]}` : "—";

          pushToast({
            bookingId: b.id,
            workerName:  b.workerName  || b.worker?.name  || b.providerName || "الفني",
            serviceName: b.serviceName || b.service?.name || "الخدمة",
            date,
            startTime: b.startTime?.slice(0, 5) || null,
            endTime:   b.endTime?.slice(0, 5)   || null,
          });
        });
      } catch (err) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          clearInterval(intervalRef.current);
          return;
        }
        console.error("BookingNotifier error:", err.message);
      }
    };

    checkBookings();
    intervalRef.current = setInterval(checkBookings, 10000);
    return () => clearInterval(intervalRef.current);
  }, [user]);

  return (
    <>
      {/* Google font for Arabic */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');`}</style>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
}

export default BookingNotifier;
