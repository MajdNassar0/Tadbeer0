import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // 🔹 إضافة حالة تحميل
  const navigate = useNavigate();

  const getImageUrl = (url) => {
    if (!url) return null;
    const cleanUrl = url.replace(/^\/+/, "");
    if (cleanUrl.startsWith("uploads/")) return `https://tadbeer0.runasp.net/${cleanUrl}`;
    return `https://tadbeer0.runasp.net/uploads/${cleanUrl}`;
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/workers?specialtyId=${serviceId}`);
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get("https://tadbeer0.runasp.net/api/General/Specialties");
        setServices(res.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false); // 🔹 إنهاء التحميل
      }
    };
    fetchServices();
  }, []);

  return (
    <section className="bg-[#f8f6f3] py-24 px-4 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }} // 🔹 التغيير لـ animate لضمان الظهور
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-3"
          >
            خدماتنا <span className="text-yellow-500">المتميزة</span>
          </motion.h2>

          <p className="mt-6 text-gray-500 max-w-lg mx-auto text-sm">
            نقدم حلولاً احترافية متكاملة لمنزلك، بجودة عالية وأسعار تنافسية.
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-yellow-500"></div>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible" // 🔹 استبدال whileInView بـ animate
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {services.map((service) => (
              <motion.div
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white p-8 rounded-[1.8rem] border border-gray-100 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg cursor-pointer group"
              >
                {/* Image / Icon */}
                <div className="w-32 h-18 mb-5 flex items-center justify-center  rounded-xl overflow-hidden">
                  {service.iconUrl ? (
                    <img
                      src={getImageUrl(service.iconUrl)}
                      alt={service.name}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        e.target.src = "https://tadbeer0.runasp.net/uploads/specialty-icons/default.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f3eee3]" />
                  )}
                </div>

                <h3 className="font-bold text-[#002b5b] text-lg mb-2 group-hover:text-yellow-600 transition-colors">
                  {service.name}
                </h3>

                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                  {service.description || "لا يوجد وصف متوفر حالياً لهذه الخدمة."}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 p-6 md:p-8 rounded-3xl border border-gray-100 bg-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-600">
               <ArrowLeft size={30} className="rotate-180" />
            </div>
            <div className="text-right">
              <h3 className="text-lg md:text-xl font-bold text-gray-900">
                هل تحتاج لخدمة خاصة؟
              </h3>
              <p className="text-gray-500 text-sm">
                تواصل معنا وسنوفر لك الفني المناسب فوراً.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md transition-all"
            >
              اطلب الآن
              <ArrowLeft size={18} />
            </button>

            <button 
              onClick={() => navigate('/workers')}
              className="text-gray-600 hover:text-gray-900 font-medium px-4 transition"
            >
              مشاهدة الكل
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;