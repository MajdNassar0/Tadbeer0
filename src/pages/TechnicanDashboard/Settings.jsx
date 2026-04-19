import React from "react";
import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => (
  <div className="flex flex-col items-center justify-center py-32 gap-3">
    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
      <SettingsIcon size={24} className="text-gray-300" />
    </div>
    <p className="text-sm text-gray-400 font-medium">الإعدادات — قريباً</p>
    <p className="text-xs text-gray-300">هذه الصفحة قيد التطوير</p>
  </div>
);

export default Settings;