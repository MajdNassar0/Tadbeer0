import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, RotateCcw, Send } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://tadbeer0.runasp.net/api";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const trimmed = email.trim();
      const response = await axios.post(
        `${API_BASE}/Identity/Auth/forgot-password`,
        { email: trimmed },
        { headers: { "Content-Type": "application/json" } }
      );
      const payload = response.data;
      if (payload && payload.isSuccess === false) {
        setErrorMsg(payload.message || payload.Message || "تعذّر إرسال الكود. حاول مرة أخرى");
        return;
      }
      const flashMessage =
        payload?.message ||
        payload?.Message ||
        "تم إرسال كود إعادة التعيين إلى بريدك الإلكتروني";
      const qs = new URLSearchParams({ email: trimmed }).toString();
      navigate(`/auth/ResetPassword?${qs}`, {
        replace: true,
        state: { email: trimmed, flashMessage },
      });
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "حدث خطأ. حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f2f5] p-4 font-sans" dir="rtl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-[#001e3c] py-10 px-6 text-center text-white relative">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 p-4 rounded-full border border-white/20">
              <RotateCcw size={32} className="text-white" />
            </div>
          </div>

          <h1 className="text-xl font-bold mb-2">استعادة كلمة المرور</h1>
          <p className="text-gray-300 text-xs leading-relaxed max-w-[280px] mx-auto">
            أدخل بريدك الإلكتروني وسنرسل لك كود لإعادة تعيين كلمة المرور
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="group">
              <label className="block text-xs font-bold text-gray-700 mb-2 mr-1">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="example@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-lg py-3 px-4 pr-12 text-right outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all duration-500 ease-in-out"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-yellow-100 transition-all"
            >
              <Send size={18} className="rotate-180" />
              <span>{loading ? "جاري الإرسال..." : "إرسال كود إعادة التعيين"}</span>
            </motion.button>

            {errorMsg && <p className="text-red-500 text-sm mt-2">{errorMsg}</p>}
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-gray-400">
              تواجه مشكلة؟{" "}
              <span className="text-[#001e3c] font-bold cursor-pointer hover:underline">
                اتصل بالدعم الفني
              </span>
            </p>
          </div>
        </div>
      </motion.div>

      <p className="mt-8 text-gray-400 text-xs">
        © 2026 تدبير. جميع الحقوق محفوظة.
      </p>
    </div>
  );
};

export default ForgotPassword;