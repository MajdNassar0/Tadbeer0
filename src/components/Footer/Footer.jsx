import React from "react";
import { motion } from "framer-motion";
import logoImg from "../../assets/img/tadbeerLogo/logo.5.png";
import { Mail, Phone, Facebook, Instagram, Send, ChevronLeft } from "lucide-react";

function Footer() {
  const fadeInUp = {
    initial: { opacity: 0, y: 15 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <footer dir="rtl" className="bg-[#101929] text-white pt-12 pb-6 px-6 md:px-16 border-t-2 border-[#d19f48]/20">
      <div className="max-w-7xl mx-auto">
        
        {/* Newsletter Section - Compact & On-Brand */}
        <motion.div 
          {...fadeInUp}
          className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-10 mb-10 border-b border-white/5"
        >
          <div className="text-center lg:text-right">
            <h2 className="text-xl md:text-2xl font-bold text-[#ffc258] mb-1">
              اشترك في نشرتنا الإخبارية
            </h2>
            <p className="text-gray-400 text-sm">كن أول من يحصل على العروض والخصومات الحصرية.</p>
          </div>

          <div className="flex w-full max-w-md bg-[#162c4d] p-1.5 rounded-xl border border-[#d19f48]/30 shadow-inner">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="bg-transparent flex-1 px-4 py-2 text-sm outline-none placeholder:text-gray-500"
            />
            <button className="bg-[#d19f48] hover:bg-[#ffc258] text-black font-bold px-6 py-2 rounded-lg transition-all duration-300 flex items-center gap-2">
              <span className="hidden sm:inline">اشترك</span>
              <Send size={16} className="rotate-180" />
            </button>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
          
          {/* Brand Info */}
          <motion.div {...fadeInUp} className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logoImg} alt="Tadbeer" className="w-10 h-10 object-contain shadow-lg  shadow-[#d19f48]/10" />
              <span className="text-2xl font-bold text-[#ffc258]">تدبير</span>
            </div>
            <p className="text-gray-300 leading-relaxed max-w-xs">
              منصتك الموثوقة لخدمات الصيانة المنزلية في فلسطين. جودة واحترافية بلمسة زر.
            </p>
            <div className="flex gap-3 pt-2">
              {[Facebook, Instagram, Phone].map((Icon, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.1, backgroundColor: "#d19f48", color: "#101929" }}
                  href="#"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-[#162c4d] text-[#ffc258] transition-colors border border-[#d19f48]/20"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Groups */}
          {[
            { title: "الشركة", links: ["عن تدبير", "الوظائف", "شركاء النجاح"] },
            { title: "الخدمات", links: ["السباكة والكهرباء", "التنظيف العميق", "صيانة التكييف"] },
            { title: "الدعم", links: ["مركز المساعدة", "اتصل بنا", "سياسة الخصوصية"] }
          ].map((section, idx) => (
            <motion.div {...fadeInUp} transition={{ delay: idx * 0.1 }} key={idx}>
              <h3 className="text-white font-bold mb-5 text-lg flex items-center gap-2">
                <span className="w-1 h-5 bg-[#d19f48] rounded-full"></span>
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <a href="#" className="text-gray-400 hover:text-[#ffc258] flex items-center gap-1 group transition-all">
                      <ChevronLeft size={14} className="group-hover:translate-x-[-2px] transition-transform text-[#d19f48]" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Minimal Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] text-gray-500">
          <p>© 2026 تدبير فلسطين – جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#ffc258] cursor-pointer">الشروط</span>
            <span className="hover:text-[#ffc258] cursor-pointer">ملفات الارتباط</span>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#162c4d] rounded-full border border-white/5">
              <span className="w-1.5 h-1.5 bg-[#ffc258] rounded-full animate-pulse"></span>
              العربية (فلسطين)
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;