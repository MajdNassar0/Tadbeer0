import React from "react";
import { motion } from "framer-motion";
import {
  Home,
  Sparkles,
  Zap,
  Wrench,
  TreeDeciduous,
  Hammer,
  Bug,
  Paintbrush,
  Camera,           // fixed
  Droplet,
  Tractor,
  Columns,
  ArrowLeft,
} from "lucide-react";

const services = [
  { title: "الأجهزة المنزلية", desc: "صيانة وإصلاح كافة الأجهزة", icon: Home },
  { title: "خدمات التنظيف", desc: "تنظيف شامل وعميق للمنازل", icon: Sparkles },
  { title: "أعمال الكهرباء", desc: "فحص وتمديد وصيانة آمنة", icon: Zap },
  { title: "سباكة", desc: "حلول سريعة لكافة التسريبات", icon: Wrench },
  { title: "تنسيق الحدائق", desc: "تصميم وصيانة المسطحات الخضراء", icon: TreeDeciduous },
  { title: "أعمال النجارة", desc: "صيانة وتفصيل الأثاث الخشبي", icon: Hammer },
  { title: "مكافحة الحشرات", desc: "رش مبيدات آمنة وفعالة", icon: Bug },
  { title: "دهانات وتشطيبات", desc: "ديكورات داخلية وخارجية", icon: Paintbrush },
  { title: "كاميرات المراقبة", desc: "تركيب وبرمجة أنظمة الأمان", icon: Camera },
  { title: "خزانات المياه", desc: "تعقيم وعزل خزانات المياه", icon: Droplet },
  { title: "أعمال الزراعة", desc: "عناية دورية بالتربة والأشجار", icon: Tractor },
  { title: "أعمال الألمنيوم", desc: "تركيب وصيانة النوافذ والأبواب", icon: Columns },
];

const ServicesSection = () => {
  return (
    <section className="bg-white py-24 px-4 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-3"
          >
            خدماتنا <span className="text-yellow-500">المتميزة</span>
          </motion.h2>

          <p className="mt-6 text-gray-500 max-w-lg mx-auto text-sm">
            نقدم حلولاً احترافية متكاملة لمنزلك، بجودة عالية وأسعار تنافسية.
          </p>
        </div>

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -6 }}
                className="bg-white p-8 rounded-[1.8rem] border border-gray-100 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-[#f9f4e8] rounded-full flex items-center justify-center mb-5">
                  <Icon className="text-[#c5a059]" size={24} />
                </div>

                {/* Title */}
                <h3 className="font-bold text-[#002b5b] text-lg mb-2">{service.title}</h3>

                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 p-6 md:p-8 rounded-3xl border border-gray-100 bg-[#f8f6f3] flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Left Side */}
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=150&h=150&fit=crop"
              alt="Worker"
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-2xl grayscale hover:grayscale-0 transition"
            />

            <div className="text-right">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                هل تحتاج لخدمة خاصة؟
              </h3>
              <p className="text-gray-500 text-sm">
                تواصل معنا وسنوفر لك الفني المناسب فوراً.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md"
            >
              اطلب الآن
              <ArrowLeft size={18} />
            </motion.button>

            <button className="text-gray-600 hover:text-gray-900 font-medium px-4 transition">
              مشاهدة الكل
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;