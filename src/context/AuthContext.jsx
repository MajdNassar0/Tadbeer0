import React, { createContext, useState, useEffect, useContext } from "react";

// 1. إنشاء السياق (Context) الذي سيحمل بيانات المستخدم
const AuthContext = createContext();

// 2. إنشاء المزود (Provider) الذي سيحيط بالتطبيق
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // عند تحميل التطبيق لأول مرة، نفحص إذا كان المستخدم مسجلاً مسبقاً في المتصفح
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("خطأ في قراءة بيانات المستخدم من localStorage", error);
      }
    }
    setLoading(false);
  }, []);

  // دالة تسجيل الدخول: تُستدعى من صفحة Login عند نجاح العملية
  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData); // تحديث الحالة فوراً ليشعر بها الناف بار وبقية المكونات
  };

  // دالة تسجيل الخروج: تمسح البيانات وتصفر الحالة
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {/* لا نعرض التطبيق حتى ينتهي الفحص الأولي لـ localStorage لضمان عدم حدوث وميض (Flicker) */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook: لتبسيط عملية استدعاء البيانات في أي مكان (مثل الناف بار)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};