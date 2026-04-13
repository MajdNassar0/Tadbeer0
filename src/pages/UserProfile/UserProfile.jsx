import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import { User, MapPin, ShieldCheck, Trash2, Loader2, Mail, Phone, Edit2 } from 'lucide-react';

const UserProfile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return; // لن ينفذ إلا إذا كان الـ id موجوداً

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`https://tadbeer0.runasp.net/api/Admin/Users/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user?.id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 relative">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
              <img 
                src={userData?.profileImage || `https://ui-avatars.com/api/?name=${userData?.firstName}+${userData?.lastName}&background=001e3c&color=fff`} 
                alt="Profile" className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-1 right-1 bg-orange-500 p-2 rounded-full text-white"><Edit2 size={16} /></button>
          </div>

          <div className="flex-1 text-center md:text-right">
            <h1 className="text-2xl font-bold text-gray-800">{userData?.firstName} {userData?.lastName}</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-2">
              <MapPin size={18} className="text-blue-500" />
              <span>{userData?.city || "الموقع غير محدد"}</span>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 p-3 rounded-2xl bg-orange-50 text-orange-600 font-bold">
                  <User size={20} /> المعلومات الشخصية
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-2xl text-gray-500 hover:bg-gray-50">
                  <ShieldCheck size={20} /> الأمان والحماية
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">تفاصيل الحساب</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-bold">الاسم الأول</p>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">{userData?.firstName}</div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-bold">البريد الإلكتروني</p>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">{userData?.email}</div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-bold">رقم الهاتف</p>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100" dir="ltr">{userData?.phoneNumber || "لا يوجد رقم"}</div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-400 font-bold">رتبة الحساب</p>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">{userData?.role}</div>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-3xl p-8 border border-red-100">
              <h3 className="text-red-600 font-bold mb-4 flex items-center gap-2"><Trash2 size={20}/> منطقة الخطر</h3>
              <div className="flex gap-4">
                <button className="flex-1 bg-white border border-red-200 text-red-600 py-3 rounded-2xl font-bold hover:bg-red-50 transition">تعطيل الحساب</button>
                <button className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-bold hover:bg-red-700 transition">حذف الحساب</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;