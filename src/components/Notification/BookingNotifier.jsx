import { useEffect } from "react";
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

  useEffect(() => {
    if (!user) return;

    const checkBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get(`${API}/User/Bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ normalize API response
        let bookings = [];
        if (Array.isArray(res.data)) {
          bookings = res.data;
        } else if (Array.isArray(res.data?.items)) {
          bookings = res.data.items;
        } else if (Array.isArray(res.data?.data?.items)) {
          bookings = res.data.data.items;
        }

        // ✅ filter accepted bookings
        const accepted = bookings.filter(b => {
          const status = b.status?.toLowerCase();
          return status === "confirmed" || status === "accepted";
        });

        if (accepted.length === 0) return;

        // ✅ prevent duplicate notifications
        const storageKey = `notifiedBookings_${user.email}`;
        const alreadyNotified = JSON.parse(
          localStorage.getItem(storageKey) || "[]"
        );

        const newlyAccepted = accepted.filter(
          b => !alreadyNotified.includes(b.id)
        );

        if (newlyAccepted.length === 0) return;

        // ✅ update storage
        const updated = [
          ...alreadyNotified,
          ...newlyAccepted.map(b => b.id),
        ];
        localStorage.setItem(storageKey, JSON.stringify(updated));

        // ✅ show notification(s)
       newlyAccepted.forEach((b) => {
  const date = b.bookingDate
    ? (() => {
        const d = new Date(b.bookingDate);
        return `${d.getDate()} ${MONTH_NAMES_AR[d.getMonth()]}`;
      })()
    : "—";

  const workerName =
    b.workerName ||
    b.worker?.name ||
    b.providerName ||
    "الفني";

  const serviceName =
    b.serviceName ||
    b.service?.name ||
    "الخدمة";

  toast.success("تم قبول حجزك ✅", {
    description: `${workerName} وافق على حجز ${serviceName} بتاريخ ${date} من ${b.startTime?.slice(0, 5)} إلى ${b.endTime?.slice(0, 5)}`,
    duration: 4000,
  });
});

      } catch (err) {
        console.error("❌ Notification error:", err);
      }
    };

    // ✅ run immediately
    checkBookings();

    // 🔁 repeat every 10 seconds
    const interval = setInterval(checkBookings, 10000);

    return () => clearInterval(interval);

  }, [user]);

  return null;
}

export default BookingNotifier;