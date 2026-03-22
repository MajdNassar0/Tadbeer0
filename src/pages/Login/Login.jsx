import React from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // ✅ FIXED

const Login = () => {
  const navigate = useNavigate();

  // Animation variants
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

  const transitionClasses = "transition-all duration-500 ease-in-out";

  // Formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false
    },

    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = "مطلوب";
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) 
        errors.email = "بريد إلكتروني غير صالح";
      if (!values.password) errors.password = "مطلوب";
      return errors;
    },

    onSubmit: async (values, { setSubmitting }) => {
      console.log("📤 LOGIN VALUES:", values);

      try {
        const response = await axios.post(
          "https://tadbeer0.runasp.net/api/Identity/Auth/login",
          {
            email: values.email,
            password: values.password
          }
        );

        console.log("✅ RESPONSE:", response.data);

        // ✅ Success check
        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);

          const decoded = jwtDecode(response.data.token);
          console.log("🔓 DECODED:", decoded);

          navigate("/booking");
        } else {
          alert(response.data?.message || "فشل تسجيل الدخول");
        }

      } catch (error) {
        const backend = error.response?.data;

        console.log("❌ FULL ERROR:", backend);

        // 🔥 Handle both array & message
        if (Array.isArray(backend?.errors)) {
          alert(backend.errors.join("\n"));
        } else {
          alert(backend?.message || "خطأ في تسجيل الدخول");
        }
      } finally {
        setSubmitting(false);
      }
    },

    validateOnChange: true,
    validateOnBlur: true
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4 font-sans" dir="rtl">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[450px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="bg-[#001e3c] py-10 px-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-500/10 blur-3xl rounded-full translate-y-[-50%]"></div>
          <h1 className="text-white text-2xl font-bold mb-2 relative z-10">مرحباً بك مجدداً</h1>
          <p className="text-yellow-500 text-sm relative z-10">سجل دخولك لإدارة خدمات منزلك</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            
            {/* Email */}
            <motion.div variants={itemVariants} className="group">
              <label className={`block text-sm font-bold text-gray-500 mb-2 mr-1 ${transitionClasses}`}>
                البريد الإلكتروني أو اسم المستخدم
              </label>
              <div className="relative">
                <input 
                  type="text"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  placeholder="example@mail.com"
                  className={`w-full bg-[#f8f9fa] border-2 ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-transparent"} rounded-lg py-3 px-4 pr-12 text-right outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-50/50 ${transitionClasses}`}
                />
                <Mail 
                  className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 ${transitionClasses}`} 
                  size={20} 
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="group">
              <label className={`block text-sm font-bold text-gray-500 mb-2 mr-1 ${transitionClasses}`}>
                كلمة المرور
              </label>
              <div className="relative">
                <input 
                  type="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="••••••••"
                  className={`w-full bg-[#f8f9fa] border-2 ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-transparent"} rounded-lg py-3 px-4 pr-12 text-right outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-50/50 ${transitionClasses}`}
                />
                <Lock 
                  className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 ${transitionClasses}`} 
                  size={20} 
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
              )}
            </motion.div>

            {/* Remember + Forgot */}
            <motion.div variants={itemVariants} className="flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  name="remember"
                  onChange={formik.handleChange}
                  checked={formik.values.remember}
                  className="w-4 h-4 rounded border-gray-300 text-[#162c4d] focus:ring-blue-900 cursor-pointer" 
                />
                <span className="text-gray-500 select-none">تذكرني</span>
              </div>

              <Link to="/auth/forgotpassword" className="text-yellow-500 font-bold">
                نسيت كلمة المرور؟
              </Link>
            </motion.div>

            {/* Button */}
            <motion.button
              type="submit"
              disabled={formik.isSubmitting}
              variants={itemVariants}
              className="w-full bg-yellow-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-yellow-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {formik.isSubmitting ? "جاري الدخول..." : "تسجيل الدخول"}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.p variants={itemVariants} className="text-center text-sm text-gray-500 mt-8">
            ليس لديك حساب؟{" "}
            <Link to="/auth/signup" className="text-[#001e3c] font-bold">
              إنشاء حساب جديد
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;