import React from "react";
import { Wrench } from "lucide-react";
import Skeleton from "../../../components/UI/Skeleton";

const ServicesTab = ({ services = [], isOwner, loading }) => (
  <div>
    {loading ? (
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl"/>)}
      </div>
    ) : services.length === 0 ? (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Wrench size={28} className="text-gray-300"/>
        <p className="text-sm text-gray-400">لا توجد خدمات مضافة بعد</p>
      </div>
    ) : (
      <div className="flex flex-col gap-3">
        {services.map((s, i) => (
          <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <p className="text-sm font-bold text-gray-700">{s.name || s.title}</p>
            <p className="text-xs text-gray-400 mt-1">{s.description}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ServicesTab;