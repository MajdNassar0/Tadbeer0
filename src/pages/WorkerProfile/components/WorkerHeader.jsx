import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BadgeCheck, Camera, Loader2, Edit3, 
  ToggleRight, CalendarCheck, MessageCircle, Mail, MapPin 
} from "lucide-react";
import { getFullImageUrl } from "../../../Utils/imageHelper";
import Skeleton from "../../../components/UI/Skeleton";

// دالة لجلب ألوان حالة التوفر
const AVAILABILITY_MAP = {
  Available: { color: "#16a34a", bg: "#dcfce7", dot: "#22c55e", label: "متاح"  },
  Busy:      { color: "#dc2626", bg: "#fee2e2", dot: "#ef4444", label: "مشغول" },
  OnLeave:   { color: "#d97706", bg: "#fef3c7", dot: "#f59e0b", label: "إجازة" },
};

const WorkerHeader = ({
  worker, isOwner, loading, saving, toggling,
  onUploadImage, onToggleStatus, onEditClick,
}) => {
  const [hover, setHover] = useState(false);
  const ref = useRef(null);
  
  const avail = AVAILABILITY_MAP[worker?.status] || AVAILABILITY_MAP["Available"];
  const fullName = worker ? `${worker.firstName || ""} ${worker.lastName || ""}`.trim() : "";
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || "W")}&background=001e3c&color=ff9800&size=200&bold=true`;

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
      className="relative mb-6 overflow-hidden rounded-3xl shadow-2xl"
      style={{ background: "linear-gradient(135deg,#001e3c 0%,#003a6e 60%,#00285a 100%)" }}>
      
      {isOwner && (
        <input ref={ref} type="file" className="hidden" accept="image/*"
          onChange={e => e.target.files[0] && onUploadImage(e.target.files[0])}/>
      )}

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
          {/* الصورة الشخصية */}
          <div className={`relative shrink-0 ${isOwner && !loading ? "cursor-pointer" : ""}`}
            onClick={() => isOwner && !saving && !loading && ref.current?.click()}
            onMouseEnter={() => isOwner && !loading && setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <div className="h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-2xl ring-4 ring-orange-400/50 relative">
              {loading ? <Skeleton className="h-full w-full"/> : (
                <>
                  <img src={getFullImageUrl(worker?.profileImage) || avatar} alt={fullName}
                    className={`h-full w-full object-cover transition-all duration-300 ${saving ? "blur-sm opacity-50" : ""}`}
                    style={{ transform: hover && isOwner ? "scale(1.08)" : "scale(1)" }}
                  />
                  {saving && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-orange-400" size={24}/></div>}
                </>
              )}
            </div>
            {!loading && <span className="absolute -bottom-1 -left-1 h-5 w-5 rounded-full border-2 border-[#001e3c]" style={{ background: avail.dot }}/>}
          </div>

          {/* المعلومات */}
          <div className="flex-1 text-center sm:text-right text-white">
            {loading ? (
              <div className="flex flex-col gap-2 items-center sm:items-start"><Skeleton className="h-8 w-52"/><Skeleton className="h-5 w-32"/></div>
            ) : (
              <>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black">{fullName || "—"}</h1>
                  {worker?.isVerified && <BadgeCheck size={22} className="text-orange-400 shrink-0"/>}
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 flex-wrap">
                  <span className="rounded-full px-3 py-0.5 text-xs font-bold" style={{ background: avail.bg, color: avail.color }}>{avail.label}</span>
                  {isOwner && <span className="rounded-full px-3 py-0.5 text-xs font-bold bg-white/10 text-white">ملفك الشخصي</span>}
                </div>
              </>
            )}
          </div>

          {/* الأزرار */}
          {!loading && (
            <div className="flex flex-col gap-2.5 w-full sm:w-auto">
              {isOwner ? (
                <>
                  <button onClick={onEditClick} className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition shadow-lg">
                    <Edit3 size={15}/>تعديل الملف الشخصي
                  </button>
                  <button onClick={onToggleStatus} disabled={toggling} className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm hover:bg-white/20 transition">
                    {toggling ? <Loader2 size={15} className="animate-spin"/> : <ToggleRight size={15}/>} تغيير حالة التوفر
                  </button>
                </>
              ) : (
                <button className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-lg">
                  <CalendarCheck size={15}/>احجز الآن
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default WorkerHeader;