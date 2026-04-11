import React from "react";
import { motion } from "framer-motion";
import { Mail, Lock, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  const formik = useFormik({
    initialValues: { email: "", password: "", remember: false },
    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = "البريد الإلكتروني مطلوب";
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) 
        errors.email = "بريد إلكتروني غير صالح";
      if (!values.password) errors.password = "كلمة المرور مطلوبة";
      return errors;
    },

    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await axios.post(
          "https://tadbeer0.runasp.net/api/Identity/Auth/login",
          { email: values.email, password: values.password }
        );

        if (!response.data.isSuccess) {
          toast.error(response.data.message || "حدث خطأ أثناء تسجيل الدخول");
          return;
        }

        const decoded = jwtDecode(response.data.token);
        const user = {
          name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "User",
          email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || values.email,
          role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "User",
        };

        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", response.data.token);

        toast.success("تم تسجيل الدخول بنجاح! مرحباً بك");

        setTimeout(() => {
          const role = user.role?.trim().toLowerCase();
          if (role === "admin" || role === "superadmin") navigate("/admin");
          else if (role === "worker") navigate("/technical");
          else navigate("/");
        }, 1000);

      } catch (error) {
        const backendMessage = error.response?.data?.message || "";
        const status = error.response?.status;

        // ✅ 1. Styled Email Confirmation Toast
        if (backendMessage.toLowerCase().includes("not confirmed")) {
          toast.warning("تنبيه: الحساب غير نشط", {
            description: "يرجى تأكيد بريدك الإلكتروني لتتمكن من الدخول.",
            duration: 6000,
            action: {
              label: "فتح البريد",
              onClick: () => window.open("https://mail.google.com", "_blank"),
            },
          });
        } 
        
        // ✅ 2. Specific Field-Level Errors (Email vs Password)
        else if (status === 401 || status === 400) {
          if (backendMessage.toLowerCase().includes("password")) {
            setFieldError("password", "كلمة المرور التي أدخلتها غير صحيحة");
            toast.error("خطأ في كلمة المرور");
          } 
          else if (backendMessage.toLowerCase().includes("email") || backendMessage.toLowerCase().includes("user")) {
            setFieldError("email", "هذا البريد الإلكتروني غير مسجل لدينا");
            toast.error("البريد الإلكتروني غير موجود");
          } 
          else {
            toast.error("خطأ في البيانات، يرجى التأكد من البريد وكلمة المرور");
          }
        } 
        
        // ✅ 3. Server/Network Error
        else {
          toast.error("تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4 font-sans" dir="rtl">
      {/* RichColors and Expand make the alerts look modern and stackable */}
      <Toaster position="top-center" richColors expand={true} />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[450px] bg-white rounded-[24px] shadow-2xl overflow-hidden border border-gray-100"
      >
        {/* Header Section */}
        <div className="bg-[#001e3c] py-10 px-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-500/10 blur-3xl rounded-full translate-y-[-50%]"></div>
          <h1 className="text-white text-2xl font-bold mb-2 relative z-10 tracking-tight">مرحباً بك مجدداً</h1>
          <p className="text-yellow-500 text-sm relative z-10 font-medium">سجل دخولك لإدارة خدمات منزلك</p>
        </div>

        <div className="p-8 lg:p-10">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            
            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-gray-700 mb-2 mr-1 text-right">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input 
                  type="text"
                  {...formik.getFieldProps("email")}
                  placeholder="example@mail.com"
                  className={`w-full bg-[#f8f9fa] border-2 rounded-xl py-3.5 pr-11 pl-4 text-right transition-all
                  ${formik.touched.email && formik.errors.email ? "border-red-500 bg-red-50/30" : "border-transparent focus:border-blue-900"}
                  focus:outline-none`}
                />
                <Mail className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${formik.touched.email && formik.errors.email ? "text-red-400" : "text-gray-400"}`} size={20} />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-[11px] mt-1.5 mr-1 text-right font-bold">{formik.errors.email}</p>
              )}
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-gray-700 mb-2 mr-1 text-right">
                كلمة المرور
              </label>
              <div className="relative">
                <input 
                  type="password"
                  {...formik.getFieldProps("password")}
                  placeholder="••••••••"
                  className={`w-full bg-[#f8f9fa] border-2 rounded-xl py-3.5 pr-11 pl-4 text-right transition-all
                  ${formik.touched.password && formik.errors.password ? "border-red-500 bg-red-50/30" : "border-transparent focus:border-blue-900"}
                  focus:outline-none`}
                />
                <Lock className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${formik.touched.password && formik.errors.password ? "text-red-400" : "text-gray-400"}`} size={20} />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-[11px] mt-1.5 mr-1 text-right font-bold">{formik.errors.password}</p>
              )}
            </motion.div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  name="remember"
                  onChange={formik.handleChange}
                  checked={formik.values.remember}
                  className="w-4 h-4 accent-[#001e3c] rounded cursor-pointer"
                />
                <span className="text-gray-600 font-medium">تذكرني</span>
              </div>
              <Link to="/auth/ForgotPassword" size={20} className="text-[#001e3c] font-black hover:text-blue-700 transition-colors">
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={formik.isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-yellow-500 hover:bg-yellow-400 py-4 rounded-xl font-black text-[#001e3c] shadow-xl shadow-yellow-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {formik.isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-3 border-[#001e3c] border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري التحقق...</span>
                </div>
              ) : "تسجيل الدخول"}
            </motion.button>

            {/* Signup Link Section */}
            <motion.div variants={itemVariants} className="text-center pt-6 border-t border-gray-100 mt-4">
               <p className="text-gray-400 text-sm font-medium">ليس لديك حساب حتى الآن؟</p>
               <Link 
                to="/auth/signup" 
                className="flex items-center justify-center gap-2 mt-3 text-[#001e3c] font-black hover:scale-105 transition-transform"
               >
                 <UserPlus size={18} className="text-yellow-600" />
                 <span className="border-b-2 border-yellow-500/30">إنشاء حساب جديد</span>
               </Link>
            </motion.div>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;