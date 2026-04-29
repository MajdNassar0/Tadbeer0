import Hero from "../../components/Hero/Hero";
import AboutSection from "../../components/AboutSection/AboutSection";
import ServicesSection from "../../components/ServicesSection/ServicesSection";
import How from "../../components/How/How"
import Contact from "../../components/Contact/Contact"
import Footer from "../../components/Footer/Footer";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";
import axios from "axios";

const Home = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const checkNotifications = async () => {
      try {
        const res = await axios.get("https://tadbeer0.runasp.net/api/User/Bookings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const items = res.data?.items ?? res.data ?? [];
        const myUserId = items[0]?.userId ?? null;
        if (!myUserId) return;

        const all = JSON.parse(localStorage.getItem("userNotifications") || "[]");
        const mine = all.filter(n => n.userId === myUserId && !n.read);
        if (mine.length === 0) return;

        setNotifications(mine);

        // mark as read in localStorage immediately
        const updated = all.map(n =>
          n.userId === myUserId ? { ...n, read: true } : n
        );
        localStorage.setItem("userNotifications", JSON.stringify(updated));

        // auto-dismiss all after 6 seconds
        setTimeout(() => setNotifications([]), 6000);
      } catch { }
    };

    checkNotifications();
  }, []);

  const dismiss = (bookingId) =>
    setNotifications(prev => prev.filter(n => n.bookingId !== bookingId));

  return (
    <>
      {/* ✅ Booking accepted notifications — top right */}
      <div className="fixed top-4 right-4 z-50 space-y-3 w-80" dir="rtl">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div key={n.bookingId}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              className="bg-white border border-green-100 rounded-2xl shadow-xl p-4 flex items-start gap-3"
            >
              <div className="bg-green-50 p-2 rounded-xl shrink-0">
                <CheckCircle size={20} className="text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800">تم قبول حجزك ✓</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                {n.date && (
                  <p className="text-[10px] text-gray-300 mt-1">
                    {new Date(n.date).toLocaleDateString("ar-EG", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </p>
                )}
              </div>
              <button onClick={() => dismiss(n.bookingId)}
                className="text-gray-300 hover:text-gray-500 shrink-0 mt-0.5">
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Hero />
      <AboutSection />
      <ServicesSection />
      <How />
      <Contact />
      <Footer />
    </>
  );
};

export default Home;