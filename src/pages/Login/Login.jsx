import React from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => {
  // Animation Variants
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

  // Reusable transition classes for that "smooth time" effect
  const transitionClasses = "transition-all duration-500 ease-in-out";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4 font-sans" dir="rtl">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[450px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
      >
        {/* Navy Blue Header */}
        <div className="bg-[#001e3c] py-10 px-6 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-blue-500/10 blur-3xl rounded-full translate-y-[-50%]"></div>
          <h1 className="text-white text-2xl font-bold mb-2 relative z-10">مرحباً بك مجدداً</h1>
          <p className="text-yellow-500 text-sm relative z-10">سجل دخولك لإدارة خدمات منزلك</p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <form className="space-y-6">
            
            {/* Email Field Group */}
            <motion.div variants={itemVariants} className="group">
              {/* The Label: Now translates to Blue 900 on focus */}
              <label className={`block text-sm font-bold text-gray-500 mb-2 mr-1 group-focus-within:text-[#162c4d] ${transitionClasses}`}>
                البريد الإلكتروني أو اسم المستخدم
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="example@mail.com" 
                  className={`w-full bg-[#f8f9fa] border-2 border-transparent rounded-lg py-3 px-4 pr-12 text-right outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-50/50 ${transitionClasses}`}
                />
                <Mail 
                  className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#162c4d] ${transitionClasses}`} 
                  size={20} 
                />
              </div>
            </motion.div>

            {/* Password Field Group */}
            <motion.div variants={itemVariants} className="group">
              {/* The Label: Now translates to Blue 900 on focus */}
              <label className={`block text-sm font-bold text-gray-500 mb-2 mr-1 group-focus-within:text-[#162c4d] ${transitionClasses}`}>
                كلمة المرور
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  className={`w-full bg-[#f8f9fa] border-2 border-transparent rounded-lg py-3 px-4 pr-12 text-right outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-50/50 ${transitionClasses}`}
                />
                <Lock 
                  className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#162c4d] ${transitionClasses}`} 
                  size={20} 
                />
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div variants={itemVariants} className="flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#162c4d] focus:ring-blue-900 cursor-pointer" />
                <span className="text-gray-500 select-none">تذكرني</span>
              </div>
              <Link
  to="/forgotpassword"
  className="text-yellow-500 hover:text-yellow-500 font-bold transition-colors"
>
  نسيت كلمة المرور؟
</Link>
            </motion.div>

            {/* Login Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: "bg-yellow-500" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-yellow-500 hover:bg-yellow-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-yellow-200 transition-all flex items-center justify-center gap-2">
              تسجيل الدخول
            </motion.button>
          </form>

          {/* Separator */}
          <motion.div variants={itemVariants} className="relative my-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <span className="relative bg-white px-4 text-sm text-gray-400">أو</span>
          </motion.div>

          {/* Footer */}
          <motion.p variants={itemVariants} className="text-center text-sm text-gray-500">
            ليس لديك حساب؟{" "}
            <Link
    to="/signup"
    className="text-[#001e3c] font-bold cursor-pointer hover:underline transition-all"
  >
    إنشاء حساب جديد
  </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;