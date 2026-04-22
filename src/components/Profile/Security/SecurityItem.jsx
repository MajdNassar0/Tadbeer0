import React from 'react';

const SecurityItem = ({ icon: Icon, title, desc, btnText, variant, onClick }) => {
  const isDanger = variant === 'danger';
  
  return (
    <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isDanger ? 'bg-red-50' : 'bg-blue-50'}`}>
          <Icon size={18} className={isDanger ? 'text-red-500' : 'text-[#001e3c]'} />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{title}</p>
          <p className="text-xs text-gray-400">{desc}</p>
        </div>
      </div>
      
      <button 
        onClick={onClick}
        className={`rounded-xl border px-4 py-1.5 text-xs font-semibold transition-all ${
          isDanger 
            ? 'border-red-100 text-red-500 hover:bg-red-50' 
            : 'border-orange-200 text-orange-500 hover:bg-orange-50'
        }`}
      >
        {btnText}
      </button>
    </div>
  );
};

export default SecurityItem;