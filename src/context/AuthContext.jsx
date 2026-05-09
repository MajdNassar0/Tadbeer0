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
      if (savedUser && savedUser !== "undefined") {
        const parsedUser = JSON.parse(savedUser);
        // إصلاح المعرف فوراً عند التحميل لضمان عدم ضياعه
        const validatedUser = {
          ...parsedUser,
          id: parsedUser.id || parsedUser.userId || parsedUser._id
        };
        setUser(validatedUser);
      }
    } catch (error) {
      console.error("خطأ في قراءة بيانات المستخدم", error);
    } finally {
      setLoading(false);
    }
  };
  initializeAuth();
}, []);

// في AuthContext.jsx قم بتعديل دالة login
const login = (userData, token) => {
  // إضافة فحص للتأكد من وجود المعرف وتوحيده
  const formattedUser = {
    ...userData,
    id: userData.id || userData.userId || userData._id // توحيد المسمى إلى id
  };
  
  localStorage.setItem("user", JSON.stringify(formattedUser));
  localStorage.setItem("token", token);
  setUser(formattedUser);
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
