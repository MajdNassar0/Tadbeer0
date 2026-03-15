import React from "react";
import { motion } from "framer-motion"; // Install this: npm install framer-motion
import { User, Mail, Phone, Lock, ShieldCheck, ArrowRight } from "lucide-react";

const Signup = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans" dir="rtl">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
      >
        
        {/* Decorative Header */}
        <div className="bg-[#101f49] p-8 text-center relative overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-blue-900 rounded-full opacity-20 blur-2xl"></div>
          <motion.h1 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-2xl font-bold text-white relative z-10"
          >
            ابدأ رحلتك معنا
          </motion.h1>
          <p className="text-blue-200 text-sm mt-2 relative z-10">
            انضم إلى <span className="text-yellow-500 font-semibold">تدبير</span> لخدمات منزلية احترافية
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <form className="space-y-5">
            
            {/* Name Input */}
            <motion.div variants={itemVariants} className="relative group">
              <User className="absolute right-3 top-3.5 text-gray-400 group-focus-within:text-[#162c4d] transition-colors" size={20}/>
              <input
                type="text"
                placeholder="الاسم الكامل"
                className="w-full border-2 border-gray-100 rounded-xl py-3 pr-11 pl-4 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-50 transition-all bg-gray-50/50"
              />
            </motion.div>

            {/* Email Input */}
            <motion.div variants={itemVariants} className="relative group">
              <Mail className="absolute right-3 top-3.5 text-gray-400 group-focus-within:text-[#162c4d] transition-colors" size={20}/>
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="w-full border-2 border-gray-100 rounded-xl py-3 pr-11 pl-4 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-50 transition-all bg-gray-50/50"
              />
            </motion.div>

           {/* Phone Input */}
<motion.div variants={itemVariants} className="relative group w-full">
  {/* The Icon: Positioned absolutely to the right */}
  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
    <Phone 
      className="text-gray-400 group-focus-within:text-[#162c4d] transition-colors" 
      size={20}
    />
  </div>

  {/* The Input: Padding-right (pr-11) makes room for the icon */}
  <input
    type="tel"
    dir="rtl"
    placeholder="رقم الجوال"
    className="w-full border-2 border-gray-100 rounded-xl py-3 pr-11 pl-4 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-50 transition-all bg-gray-50/50 placeholder:text-gray-400 text-right"
  />
</motion.div>

            {/* Passwords Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="relative group">
                <Lock className="absolute right-3 top-3.5 text-gray-400 group-focus-within:text-[#162c4d] transition-colors" size={20}/>
                <input
                  type="password"
                  placeholder="كلمة المرور"
                  className="w-full border-2 border-gray-100 rounded-xl py-3 pr-11 pl-4 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-50 transition-all bg-gray-50/50"
                />
              </motion.div>
              <motion.div variants={itemVariants} className="relative group">
                <ShieldCheck className="absolute right-3 top-3.5 text-gray-400 group-focus-within:text-[#162c4d] transition-colors" size={20}/>
                <input
                  type="password"
                  placeholder="تأكيد الكلمة"
                  className="w-full border-2 border-gray-100 rounded-xl py-3 pr-11 pl-4 focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-50 transition-all bg-gray-50/50"
                />
              </motion.div>
            </div>

            {/* Privacy Checkbox */}
            <motion.div variants={itemVariants} className="flex items-center gap-2 px-1">
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded text-[#162c4d] focus:ring-blue-500 border-gray-300 cursor-pointer" 
              />
              <label className="text-sm text-gray-900">
                أوافق على <span className="text-[#162c4d] font-semibold hover:underline cursor-pointer">الشروط وسياسة الخصوصية</span>
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-yellow-500 hover:bg-yellow-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-yellow-200 transition-all flex items-center justify-center gap-2"
            >
              إنشاء الحساب
              <ArrowRight size={20} className="rotate-180" />
            </motion.button>

          </form>

          {/* Footer link */}
          <motion.p 
            variants={itemVariants}
            className="text-center text-sm text-gray-500 mt-8"
          >
            لديك حساب بالفعل؟{" "}
            <span className="text-blue-800 font-bold cursor-pointer hover:underline transition-all">سجل دخولك الآن</span>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;