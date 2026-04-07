import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
  MapPin, Star, Briefcase, Clock, Calendar, 
  Share2, ShieldCheck, Wrench, Settings, Zap,
  Circle , Award, MessageCircle, Phone
} from 'lucide-react';
import { motion } from 'framer-motion';

const NAVY = "#001F3F";
const ORANGE = "#F7A823";
const API_BASE = "https://tadbeer0.runasp.net/api";
const IMAGE_BASE = "https://tadbeer0.runasp.net/";

const WorkerProfile = () => {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkerData = async () => {
      try {
        const res = await axios.get(`${API_BASE}/General/Workers/${id}`);
        const data = res.data?.data || res.data;
        setWorker(data);
      } catch (err) {
        console.error("Error fetching worker:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkerData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="relative">
           <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#F7A823]"></div>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-[#001F3F] rounded-full animate-pulse"></div>
           </div>
        </div>
      </div>
    );
  }

  if (!worker) return <div className="text-center py-20 font-bold text-red-500">العامل غير موجود</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20 font-sans" dir="rtl">
      {/* Hero Section with Background Pattern */}
      <div className="relative bg-[#001F3F] h-48 md:h-64 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
       
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Right Column: Main Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-gray-50"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Profile Image with Ring */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#F7A823] rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
                  <img 
                    src={worker.profileImage ? `${IMAGE_BASE}${worker.profileImage}` : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"} 
                    className="w-44 h-44 rounded-3xl border-8 border-white shadow-sm object-cover relative z-10"
                    alt={worker.firstName}
                  />
                  <div className="absolute -bottom-2 -right-2 bg-green-600 text-white  rounded-full border-white z-20">
                    <Circle />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-right space-y-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                      <h1 className="text-4xl font-black text-[#001F3F]">
                        {worker.firstName} {worker.lastName}
                      </h1>
                      <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-sm font-black border border-amber-100">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        {worker.avgRating?.toFixed(1) || "5.0"}
                      </div>
                    </div>
                    <p className="text-[#F7A823] font-bold text-lg flex items-center justify-center md:justify-start gap-2">
                       <Award size={20} />
                       {worker.specialtyNames?.[0] || "فني معتمد"}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-6 py-4 border-y border-gray-50">
                    <div className="flex items-center gap-2 text-slate-600">
                       <div className="bg-slate-100 p-2 rounded-lg"><Briefcase size={18} /></div>
                       <span className="font-bold">+{worker.experienceYears || 0} سنوات</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                       <div className="bg-slate-100 p-2 rounded-lg"><MapPin size={18} /></div>
                       <span className="font-bold">{worker.city || "نابلس"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                       <div className="bg-slate-100 p-2 rounded-lg"><Clock size={18} /></div>
                       <span className="font-bold">متاح الآن</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                    <button className="flex-1 md:flex-none bg-[#F7A823] hover:bg-[#e59a1d] text-white px-12 py-4 rounded-2xl font-black shadow-lg shadow-orange-200 transition-all active:scale-95">
                      احجز الموعد الآن
                    </button>
                    <button className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-100 transition-colors">
                      <Share2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* About & Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.section 
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm md:col-span-2"
              >
                <h2 className="text-xl font-black mb-4 text-[#001F3F] flex items-center gap-2">
                   <div className="w-2 h-8 bg-[#F7A823] rounded-full"></div>
                   نبذة تعريفية
                </h2>
                <p className="text-slate-500 leading-loose text-lg">
                  {worker.bio || `فني محترف بخبرة واسعة في ${worker.specialtyNames?.[0] || 'المجال التخصصي'}. ألتزم بتقديم حلول مبتكرة وعملية مع ضمان الجودة العالية في كافة التفاصيل التقنية والفنية.`}
                </p>
              </motion.section>

              {[
                { title: "أدوات حديثة", icon: <Wrench />, color: "bg-blue-500", text: "نستخدم أحدث التقنيات لضمان دقة التنفيذ" },
                { title: "ضمان العمل", icon: <ShieldCheck />, color: "bg-green-500", text: "نقدم ضمان حقيقي على كافة الخدمات" }
              ].map((item, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-50 shadow-sm flex items-start gap-4">
                  <div className={`${item.color} p-3 rounded-2xl text-white shadow-lg`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-[#001F3F]">{item.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Left Column: Sidebar Details */}
          <div className="space-y-6">
            {/* Quick Contact Card */}
            <div className="bg-white rounded-[2rem] p-8 text-[#001F3F]  relative overflow-hidden group shadow-2xl shadow-blue-900/20">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
               <h3 className="text-xl font-bold mb-6 relative z-10">تواصل مباشر</h3>
               <div className="space-y-4 relative z-10">
                  <button className="w-full hover:bg-amber-200 border-amber-300 bg-white/10 hover:bg-white/20 py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors border border-white/10">
                    <Phone size={20} className="text-[#F7A823] " />
                    <span className="font-bold">اتصال هاتفي</span>
                  </button>
                  <button className="w-full bg-[#25D366] hover:bg-[#20bd5a] py-4 rounded-2xl flex items-center justify-center gap-3 transition-colors shadow-lg">
                    <MessageCircle size={20} />
                    <span className="font-bold">واتساب</span>
                  </button>
               </div>
            </div>

            {/* Availability Card */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 px-8 py-6 border-b border-gray-50">
                <h3 className="font-black flex items-center gap-3 text-[#001F3F]">
                  <Calendar className="w-5 h-5 text-[#F7A823]" /> 
                  أوقات العمل
                </h3>
              </div>
              <div className="p-8">
                <div className="space-y-5">
                  {["السبت - الخميس"].map((day) => (
                    <div key={day} className="flex justify-between items-center group">
                      <span className="text-slate-600 font-bold">{day}</span>
                      <div className="h-px flex-1 mx-4 bg-slate-100"></div>
                      <span className="bg-green-50 text-green-600 px-3 py-1 rounded-lg text-xs font-black">08:00 - 17:00</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center opacity-50">
                    <span className="text-slate-400 font-bold">الجمعة</span>
                    <div className="h-px flex-1 mx-4 bg-slate-100"></div>
                    <span className="text-red-400 text-xs font-black">عطلة</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Tag */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-center text-white relative overflow-hidden">
               <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/world-map.png')] bg-center bg-no-repeat"></div>
               <MapPin className="mx-auto mb-3 text-[#F7A823]" size={32} />
               <p className="font-black text-lg">منطقة الخدمة</p>
               <p className="text-slate-400 text-sm mt-1">يغطي كافة مناطق مدينة {worker.city || "نابلس"}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;