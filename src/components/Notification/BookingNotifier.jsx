import { useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";

const API = "https://tadbeer0.runasp.net/api";

const MONTH_NAMES_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
];

function BookingNotifier() {
  const { user } = useAuth();
  const intervalRef = useRef(null);

  useEffect(() => {
    // Stop if not logged in
    if (!user) return;

    // ✅ Only run for regular customers — workers & admins use different endpoints
    const role = (user.role ?? user.userType ?? "").toLowerCase();
    if (role === "worker" || role === "admin") return;

    const checkBookings = async () => {
      const token = localStorage.getItem("token");

      // Stop polling entirely if token is gone
      if (!token) {
        clearInterval(intervalRef.current);
        return;
      }

      try {
        const res = await axios.get(`${API}/User/Bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Normalize API response shape
        let bookings = [];
        if (Array.isArray(res.data)) {
          bookings = res.data;
        } else if (Array.isArray(res.data?.items)) {
          bookings = res.data.items;
        } else if (Array.isArray(res.data?.data?.items)) {
          bookings = res.data.data.items;
        }

        // ✅ Filter accepted/confirmed bookings
        const accepted = bookings.filter(b => {
          const status = b.status?.toLowerCase();
          return status === "confirmed" || status === "accepted";
        });

        if (accepted.length === 0) return;

        // ✅ Prevent duplicate notifications per user
        const storageKey = `notifiedBookings_${user.email}`;
        const alreadyNotified = JSON.parse(
          localStorage.getItem(storageKey) || "[]"
        );

        const newlyAccepted = accepted.filter(
          b => !alreadyNotified.includes(b.id)
        );

        if (newlyAccepted.length === 0) return;

        // ✅ Persist notified ids
        localStorage.setItem(
          storageKey,
          JSON.stringify([...alreadyNotified, ...newlyAccepted.map(b => b.id)])
        );

        // ✅ Show toast per new booking
        newlyAccepted.forEach((b) => {
          const date = b.bookingDate
            ? (() => {
                const d = new Date(b.bookingDate);
                return `${d.getDate()} ${MONTH_NAMES_AR[d.getMonth()]}`;
              })()
            : "—";

          const workerName =
            b.workerName || b.worker?.name || b.providerName || "الفني";

          const serviceName =
            b.serviceName || b.service?.name || "الخدمة";

          toast.success("تم قبول حجزك ✅", {
            description: `${workerName} وافق على حجز ${serviceName} بتاريخ ${date} من ${b.startTime?.slice(0, 5)} إلى ${b.endTime?.slice(0, 5)}`,
            duration: 4000,
          });
        });

      } catch (err) {
        const status = err.response?.status;

        // ✅ Stop polling on auth errors — no point retrying
        if (status === 401 || status === 403) {
          console.warn("BookingNotifier: stopping poll — auth error", status);
          clearInterval(intervalRef.current);
          return;
        }

        // Log other errors silently (network issues etc.)
        console.error("BookingNotifier error:", err.message);
      }
    };

    // Run immediately, then every 10 seconds
    checkBookings();
    intervalRef.current = setInterval(checkBookings, 10000);

    return () => clearInterval(intervalRef.current);
  }, [user]);

  return null;
}

export default BookingNotifier;
