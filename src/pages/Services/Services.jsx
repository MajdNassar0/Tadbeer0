// src/pages/Services/Services.jsx

import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Your services array
const services = [
  {
    title: "الأجهزة المنزلية",
    slug: "appliances",
    desc: "صيانة وإصلاح كافة الأجهزة",
    image: new URL("../../assets/img/services/اجهزة منزلية.webp", import.meta.url).href,
  },
  {
    title: "خدمات التنظيف",
    slug: "cleaning",
    desc: "تنظيف شامل وعميق للمنازل",
    image: new URL("../../assets/img/services/تنظيف منزل.webp", import.meta.url).href,
  },
  {
    title: "أعمال الكهرباء",
    slug: "electricity",
    desc: "فحص وتمديد وصيانة آمنة",
    image: new URL("../../assets/img/services/اعمال كهرباء.webp", import.meta.url).href,
  },
  {
    title: "السباكة",
    slug: "plumbing",
    desc: "حلول سريعة لكافة التسريبات",
    image: new URL("../../assets/img/services/سباكة.webp", import.meta.url).href,
  },
  {
    title: "تنسيق الحدائق",
    slug: "gardening",
    desc: "تصميم وصيانة المسطحات الخضراء",
    image: new URL("../../assets/img/services/حدائق.webp", import.meta.url).href,
  },
  {
    title: "أعمال النجارة",
    slug: "carpentry",
    desc: "صيانة وتفصيل الأثاث الخشبي",
    image: new URL("../../assets/img/services/اعمال نجارة.webp", import.meta.url).href,
  },
  {
    title: "مكافحة الحشرات",
    slug: "pest_control",
    desc: "رش مبيدات آمنة وفعالة",
    image: new URL("../../assets/img/services/التعقيم.webp", import.meta.url).href,
  },
  {
    title: "دهانات وتشطيبات",
    slug: "painting",
    desc: "ديكورات داخلية وخارجية",
    image: new URL("../../assets/img/services/الدهانات و التشطيب.webp", import.meta.url).href,
  },
  {
    title: "كاميرات المراقبة",
    slug: "cameras",
    desc: "تركيب وبرمجة أنظمة الأمان",
    image: new URL("../../assets/img/services/كمرات مراقبة.png", import.meta.url).href,
  },
  {
    title: "خزانات المياه",
    slug: "water_tanks",
    desc: "تعقيم وعزل خزانات المياه",
    image: new URL("../../assets/img/services/العوازل.webp", import.meta.url).href,
  },
  {
    title: "أعمال الألمنيوم",
    slug: "aluminum",
    desc: "تركيب وصيانة النوافذ والأبواب",
    image: new URL("../../assets/img/services/اعمال المنيوم.webp", import.meta.url).href,
  },
  {
    title: "أرضيات وحوائط",
    slug: "flooring",
    desc: "تركيب وتشطيب احترافي للأرضيات والجدران",
    image: new URL("../../assets/img/services/ارضيات و حوائط.webp", import.meta.url).href,
  },
  {
    title: "أعمال الحدادة",
    slug: "blacksmith",
    desc: "تصنيع وتركيب أعمال الحديد بمواصفات دقيقة",
    image: new URL("../../assets/img/services/اعمال حدادة.webp", import.meta.url).href,
  },
  {
    title: "البوابات الكهربائية",
    slug: "gates",
    desc: "تركيب وصيانة البوابات الأوتوماتيكية",
    image: new URL("../../assets/img/services/البوابات الكهربائيه.webp", import.meta.url).href,
  },
  {
    title: "الطاقة الشمسية",
    slug: "solar",
    desc: "حلول تركيب وصيانة أنظمة الطاقة الشمسية",
    image: new URL("../../assets/img/services/الطاقة الشمسية.webp", import.meta.url).href,
  },
  {
    title: "المصاعد",
    slug: "elevators",
    desc: "خدمات تركيب وصيانة المصاعد المنزلية والتجارية",
    image: new URL("../../assets/img/services/المصاعد.webp", import.meta.url).href,
  },
  {
    title: "خدمة حرفي",
    slug: "handyman",
    desc: "توفير فني متعدد المهارات للصيانة المنزلية",
    image: new URL("../../assets/img/services/حرفي.webp", import.meta.url).href,
  },
  {
    title: "فني ستالايت",
    slug: "satellite",
    desc: "تركيب وضبط وصيانة أنظمة الستالايت",
    image: new URL("../../assets/img/services/فني ستالايت.webp", import.meta.url).href,
  },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <section dir="rtl" className="bg-[#f8f6f3] py-24 px-4 font-sans">
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
          {services.map((service) => (
            <motion.div
              key={service.slug}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              whileHover={{ y: -6 }}
              onClick={() => navigate(`/services/${service.slug}`)}
              className="bg-white p-8 rounded-[1.8rem] border border-gray-100 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg cursor-pointer"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-20 h-12 md:w-24 md:h-14 object-cover rounded-xl mb-5"
                loading="lazy"
              />
              <h3 className="font-bold text-[#002b5b] text-lg mb-2">{service.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Services;