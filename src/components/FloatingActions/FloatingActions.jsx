import React from "react";
import { Settings, Edit3, MessageCircle, CalendarCheck } from "lucide-react";

const FloatingActions = ({ isOwner, setActiveTab }) => (
  <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-3 border-t border-gray-100 bg-white/95 p-4 backdrop-blur-md sm:hidden">
    {isOwner ? (
      <>
        <button 
          onClick={() => setActiveTab("settings")}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50"
        >
          <Settings size={15}/>الإعدادات
        </button>
        <button 
          onClick={() => setActiveTab("settings")}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition"
          style={{ background: "linear-gradient(135deg,#ff9800,#f57c00)" }}
        >
          <Edit3 size={15}/>تعديل الملف
        </button>
      </>
    ) : (
      <>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600">
          <MessageCircle size={15}/>رسالة
        </button>
        <button 
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg"
          style={{ background: "linear-gradient(135deg,#ff9800,#f57c00)" }}
        >
          <CalendarCheck size={15}/>احجز الآن
        </button>
      </>
    )}
  </div>
);

export default FloatingActions;