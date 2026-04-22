// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const savedUser = localStorage.getItem("user");
        // تأكد أن البيانات ليست فارغة أو "undefined" كنص
        if (savedUser && savedUser !== "undefined") {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("خطأ في قراءة بيانات المستخدم من localStorage", error);
        localStorage.removeItem("user"); // تنظيف البيانات التالفة
      } finally {
        setLoading(false); // نضمن أنها ستصبح false في كل الحالات
      }
    };

    initializeAuth();
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };
  const updateUser = (updatedData) => {
    setUser((prevUser) => {
      const newUser = { ...prevUser, ...updatedData };
      // تحديث localStorage لضمان بقاء الصورة عند عمل Refresh
      localStorage.setItem("user", JSON.stringify(newUser));
      return newUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading ,updateUser}}>
      {/* بدلاً من {!loading && children} 
          يفضل عرض المكونات دائماً أو إظهار Loader محدد يختفي فوراً
      */}
      {loading ? (
        <div className="flex h-screen items-center justify-center">
           {/* يمكنك وضع Spinner برتقالي هنا ليتناسب مع هوية تدبير */}
           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
