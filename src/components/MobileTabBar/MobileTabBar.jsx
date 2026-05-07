import React from "react";

const MobileTabBar = ({ activeTab, setActiveTab, isOwner, tabs }) => { 
  return (
    <div className="flex gap-1 mb-5 overflow-x-auto pb-1 lg:hidden">
      {tabs.map(tab => ( 
        <button 
          key={tab.id} 
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap transition
            ${activeTab === tab.id ? "bg-[#001e3c] text-white" : "bg-white border border-gray-100 text-gray-500"}`}
        >
          <tab.icon 
            size={13} 
            className={activeTab === tab.id ? "text-orange-400" : ""}
          /> 
          {tab.label} 
        </button>
      ))}
    </div>
  ); 
};

export default MobileTabBar;