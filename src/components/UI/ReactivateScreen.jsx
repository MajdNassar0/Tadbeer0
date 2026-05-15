// src/components/UI/ReactivateScreen.jsx

import React from 'react';
import { Ban, Loader2, LogOut } from 'lucide-react';

const ReactivateScreen = ({ onReactivate, loading, onLogout }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-white flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-50 text-orange-500 shadow-inner animate-bounce">
        <Ban size={40} />
      </div>
      
      <h2 className="text-2xl font-black text-gray-800 mb-2">حسابك معطل حالياً</h2>
      <p className="max-w-xs text-sm font-bold text-gray-400 leading-relaxed mb-8">
        لقد قمت بتعطيل حسابك مؤقتاً. لن تظهر في نتائج البحث ولن تتمكن من استقبال طلبات جديدة حتى تعيد التفعيل.
      </p>

      <div className="flex flex-col w-full max-w-xs gap-3">
        <button
          onClick={onReactivate}
          disabled={loading}
          className="w-full py-4 bg-[#001e3c] text-white rounded-2xl font-black shadow-xl hover:bg-[#002d5a] transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : "إعادة تفعيل الحساب الآن"}
        </button>
        
        <button
          onClick={onLogout}
          className="w-full py-3 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
        >
          <LogOut size={16} /> تسجيل الخروج
        </button>
      </div>
    </div>
  );
};

export default ReactivateScreen;