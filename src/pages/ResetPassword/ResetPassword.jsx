import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock, KeyRound, CheckCircle2, Save, Mail, ArrowRight,
  Eye, EyeOff, AlertCircle, Info, X
} from "lucide-react";
import axios from "axios";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";

const API_BASE = "https://tadbeer0.runasp.net/api";

/* ─── Toast Types Styling ─── */
const TOAST_STYLES = {
  success: {
    bg: "bg-white",
    border: "border-emerald-500",
    text: "text-emerald-800",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    Icon: CheckCircle2,
    progress: "bg-emerald-500"
  },
  error: {
    bg: "bg-white",
    border: "border-red-500",
    text: "text-red-800",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    Icon: AlertCircle,
    progress: "bg-red-500"
  },
  info: {
    bg: "bg-[#001e3c]",
    border: "border-blue-400",
    text: "text-white",
    iconBg: "bg-white/10",
    iconColor: "text-blue-300",
    Icon: Info,
    progress: "bg-blue-400"
  },
};

/* ─── Toast Component ─── */
const Toast = ({ toast, onDismiss }) => {
  const style = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className={`group pointer-events-auto flex items-center gap-4 p-4 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] border-l-4 ${style.bg} ${style.border} ${style.text} min-w-[320px] max-w-[400px] overflow-hidden relative`}
    >
      <div className={`${style.iconBg} ${style.iconColor} p-2 rounded-lg shrink-0`}>
        <style.Icon size={22} />
      </div>
      
      <div className="flex-1">
        <p className="text-[13px] font-bold leading-tight">
          {toast.type === 'success' ? 'نجاح العملية' : toast.type === 'error' ? 'تنبيه خطأ' : 'ملاحظة'}
        </p>
        <p className="text-[12px] opacity-90 mt-1">{toast.message}</p>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded-md"
      >
        <X size={16} />
      </button>

      {/* Progress Bar */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: 5, ease: "linear" }}
        className={`absolute bottom-0 left-0 h-[3px] ${style.progress} opacity-30`}
      />
    </motion.div>
  );
};

/* ─── Main Component ─── */
const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "", token: "", newPassword: "", confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const emailFromQuery = searchParams.get("email") || "";
    const tokenFromQuery = searchParams.get("token") || searchParams.get("code") || "";
    const emailFromState = location.state?.email || "";
    const flashMessage = location.state?.flashMessage;

    setFormData((prev) => ({
      ...prev,
      email: emailFromState || emailFromQuery || prev.email,
      token: tokenFromQuery || prev.token,
    }));

    if (flashMessage) addToast(flashMessage, "info");
    else addToast("يرجى إدخال الكود المرسل لإكمال تعيين كلمة المرور", "info");
  }, [addToast, location.state, searchParams]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      addToast("كلمات المرور غير متطابقة", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.patch(`${API_BASE}/Identity/Auth/reset-password`, {
        email: formData.email.trim(),
        code: formData.token.trim(),
        newPassword: formData.newPassword,
        confirmNewPassword: formData.confirmPassword,
      });

      if (response.status === 200 || response.data?.isSuccess) {
        addToast("تم تحديث كلمة المرور بنجاح!", "success");
        setTimeout(() => navigate("/auth/login", { 
          state: { email: formData.email, flashMessage: "تم التحديث، يمكنك تسجيل الدخول الآن." } 
        }), 2000);
      }
    } catch (error) {
      const msg = error.response?.data?.message || "فشلت العملية، تأكد من صحة الكود";
      addToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-4 font-sans relative" dir="rtl">
      
      {/* ── Fixed Toast Container (Top Left or Right) ── */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </AnimatePresence>
      </div>

      {/* ── Back to Home ── */}
      <div className="absolute top-8 right-8">
        <Link to="/" className="flex items-center gap-2 text-[#001e3c] font-bold text-sm hover:translate-x-[-5px] transition-transform">
          <ArrowRight size={20} className="text-[#fbbc05]" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[460px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100"
      >
        {/* Header Section */}
        <div className="bg-[#001e3c] pt-12 pb-10 px-8 text-center text-white relative">
          <div className="inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mb-5">
            <Lock size={32} className="text-[#fbbc05]" />
          </div>
          <h1 className="text-2xl font-bold">تعيين كلمة المرور</h1>
          <p className="text-blue-100/70 text-sm mt-2 font-light">قم بتحديث بيانات الدخول الخاصة بحسابك</p>
        </div>

        {/* Form Section */}
        <div className="p-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Read-only Email */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-600 mr-1">البريد الإلكتروني</label>
              <div className="relative group">
                <input
                  name="email" type="email" readOnly value={formData.email}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3.5 px-4 pr-12 text-gray-500 cursor-not-allowed text-sm"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
              </div>
            </div>

            {/* Verification Code */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-600 mr-1">كود التحقق</label>
              <div className="relative group">
                <input
                  name="token" type="text" required value={formData.token} onChange={handleChange}
                  placeholder="أدخل الكود هنا"
                  className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3.5 px-4 pr-12 text-sm outline-none focus:border-[#001e3c] focus:bg-white transition-all"
                />
                <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#001e3c] transition-colors" size={18} />
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-600 mr-1">كلمة المرور الجديدة</label>
              <div className="relative group">
                <input
                  name="newPassword" type={showNewPassword ? "text" : "password"} required
                  value={formData.newPassword} onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3.5 px-12 pr-12 text-sm outline-none focus:border-[#001e3c] focus:bg-white transition-all"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#001e3c] transition-colors" size={18} />
                <button
                  type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#001e3c]"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-600 mr-1">تأكيد كلمة المرور</label>
              <div className="relative group">
                <input
                  name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required
                  value={formData.confirmPassword} onChange={handleChange}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-xl py-3.5 px-12 pr-12 text-sm outline-none focus:border-[#001e3c] focus:bg-white transition-all"
                />
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#001e3c] transition-colors" size={18} />
                <button
                  type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#001e3c]"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-[#fbbc05] hover:bg-[#eab308] text-[#001e3c] py-4 rounded-xl font-extrabold shadow-lg shadow-yellow-200 transition-all disabled:bg-gray-200 disabled:shadow-none disabled:text-gray-400 mt-4"
            >
              {loading ? "جاري التحديث..." : "تحديث كلمة المرور"}
            </motion.button>
          </form>

          <div className="mt-10 text-center">
            <Link to="/auth/login" className="text-sm font-medium text-gray-400 hover:text-[#001e3c] transition-colors">
              تذكرت كلمة المرور؟ <span className="text-[#001e3c] font-bold underline underline-offset-4">سجل دخولك</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;