import React from "react";
import { AlertCircle } from "lucide-react";

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center gap-4 py-20 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
      <AlertCircle size={32} className="text-red-400"/>
    </div>
    <p className="text-lg font-bold text-gray-700">{message || "حدث خطأ ما"}</p>
    <button 
      onClick={onRetry}
      className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-600 transition"
    >
      إعادة المحاولة
    </button>
  </div>
);

export default ErrorState;