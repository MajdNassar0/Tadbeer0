import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { z } from "zod";

const Signup = () => {
  const navigate = useNavigate();

  // ✅ Zod Schema
  const signupSchema = z
    .object({
      name: z.string().min(3, "مطلوب"),
      email: z.string().min(1, "مطلوب").email("بريد غير صالح"),
      phone: z.string().min(1, "مطلوب"),
      password: z.string().min(1, "مطلوب"),
      confirmPassword: z.string().min(1, "مطلوب"),
      agree: z.boolean().refine((val) => val === true, {
        message: "يجب الموافقة",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "كلمة المرور غير متطابقة",
      path: ["confirmPassword"],
    });

  // ✅ Convert Zod → Formik errors
  const validate = (values) => {
    const result = signupSchema.safeParse(values);

    if (result.success) return {};

    const errors = {};
    result.error.issues.forEach((e) => {
      errors[e.path[0]] = e.message;
    });

    return errors;
  };

  // Animation
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  // ✅ Formik
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
    validate,
    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: async (values, { setSubmitting }) => {
      // 🔥 FIX: format phone
      const formattedPhone =
        values.phone.startsWith("+970")
          ? values.phone
          : "+970" + values.phone.replace(/^0/, "");

      const payload = {
        fullName: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        phoneNumber: formattedPhone,
      };

      console.log("📤 PAYLOAD:", payload);

      try {
        const response = await axios.post(
          "https://tadbeer0.runasp.net/api/Identity/Auth/register",
          payload
        );

        console.log("✅ RESPONSE:", response.data);

        // ✅ Success check
        if (response.data?.isSuccess && response.data?.token) {
          localStorage.setItem("token", response.data.token);

          const decoded = jwtDecode(response.data.token);
          console.log("Decoded:", decoded);

          navigate("/");
        } else {
          alert(response.data?.message || "فشل التسجيل");
        }
      } catch (error) {
        const backend = error.response?.data;

        console.log("❌ FULL ERROR:", backend);

        // 🔥 FIX: handle array errors
        if (Array.isArray(backend?.errors)) {
          alert(backend.errors.join("\n"));
        } else {
          alert(backend?.message || "حدث خطأ أثناء التسجيل");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans"
      dir="rtl"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="bg-[#101f49] p-8 text-center relative">
          <motion.h1 className="text-2xl font-bold text-white">
            ابدأ رحلتك معنا
          </motion.h1>
          <p className="text-blue-200 text-sm mt-2">
            انضم إلى <span className="text-yellow-500 font-semibold">تدبير</span>
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            
            {/* Name */}
            <motion.div variants={itemVariants} className="relative">
              <User className="absolute right-3 top-3.5 text-gray-400" />
              <input
                type="text"
                name="name"
                {...formik.getFieldProps("name")}
                placeholder="الاسم الكامل"
                className="w-full border-2 border-gray-100 rounded-xl py-3 pr-11 pl-4 bg-gray-50/50"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs">{formik.errors.name}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants} className="relative">
              <Mail className="absolute right-3 top-3.5 text-gray-400" />
              <input
                type="email"
                name="email"
                {...formik.getFieldProps("email")}
                placeholder="البريد الإلكتروني"
                className="w-full border-2 border-gray-100 rounded-xl py-3 pr-11 pl-4 bg-gray-50/50"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs">{formik.errors.email}</p>
              )}
            </motion.div>

            {/* Phone */}
            <motion.div variants={itemVariants} className="relative">
              <Phone className="absolute right-3 top-3.5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                {...formik.getFieldProps("phone")}
                placeholder="رقم الجوال"
                className="w-full border-2 border-gray-100 rounded-xl py-3 pr-11 pl-4 bg-gray-50/50"
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-xs">{formik.errors.phone}</p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants} className="relative">
              <Lock className="absolute right-3 top-3.5 text-gray-400" />
              <input
                type="password"
                name="password"
                {...formik.getFieldProps("password")}
                placeholder="كلمة المرور"
                className="w-full border-2 border-gray-100 rounded-xl py-3 pr-11 pl-4 bg-gray-50/50"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs">{formik.errors.password}</p>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div variants={itemVariants} className="relative">
              <ShieldCheck className="absolute right-3 top-3.5 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                {...formik.getFieldProps("confirmPassword")}
                placeholder="تأكيد الكلمة"
                className="w-full border-2 border-gray-100 rounded-xl py-3 pr-11 pl-4 bg-gray-50/50"
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {formik.errors.confirmPassword}
                  </p>
                )}
            </motion.div>

            {/* Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="agree"
                checked={formik.values.agree}
                onChange={formik.handleChange}
              />
              <label className="text-sm">
                أوافق على الشروط وسياسة الخصوصية
              </label>
            </div>
            {formik.touched.agree && formik.errors.agree && (
              <p className="text-red-500 text-xs">{formik.errors.agree}</p>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-yellow-500 text-white py-4 rounded-xl disabled:opacity-50"
            >
              {formik.isSubmitting ? "جاري التسجيل..." : "إنشاء الحساب"}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            لديك حساب بالفعل؟{" "}
            <Link to="/auth/login" className="text-[#001e3c] font-bold">
              سجل دخولك الآن
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;