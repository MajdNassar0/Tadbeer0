import React from "react";
import { ChevronRight, Star } from "lucide-react";
import { getFullImageUrl } from "../../../Utils/imageHelper";
import StarRating from "../../../components/UI/StarRating";
import Skeleton from "../../../components/UI/Skeleton";

const WorkerSidebar = ({ worker, isOwner, loading, activeTab, setActiveTab, tabs }) => {
  const fullName = worker ? `${worker.firstName || ""} ${worker.lastName || ""}`.trim() : "";
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || "W")}&background=ff9800&color=fff&size=200&bold=true`;

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-50 p-5 text-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2"><Skeleton className="h-14 w-14 rounded-full mx-auto"/><Skeleton className="h-4 w-28"/></div>
          ) : (
            <>
              <img src={getFullImageUrl(worker?.profileImage) || avatar} alt={fullName} className="mx-auto mb-2 h-14 w-14 rounded-full object-cover ring-2 ring-orange-200"/>
              <p className="text-sm font-bold text-gray-800">{fullName}</p>
              <div className="mt-2 flex justify-center"><StarRating rating={worker?.rating || 0} size={12}/></div>
            </>
          )}
        </div>
        <nav className="p-3">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition
                ${activeTab === tab.id ? "bg-[#001e3c] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}>
              <tab.icon size={16} className={activeTab === tab.id ? "text-orange-400" : ""}/>
              <span className="flex-1 text-right">{tab.label}</span>
              <ChevronRight size={14} className={activeTab === tab.id ? "rotate-180 text-orange-400" : "text-gray-300"}/>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default WorkerSidebar;