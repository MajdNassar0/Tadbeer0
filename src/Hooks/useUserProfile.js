import { useState, useEffect, useCallback } from "react";
import apiClient from "../API/axiosConfig";

export const useUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); 
  const [toggling, setToggling] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const res = await apiClient.get('/User/Profile/me');
      setUser(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (payload) => {
    setSaving(true);
    try {
      let dataToSend;
      
      // إذا كان payload هو FormData (من رفع الصورة) نرسله كما هو
      if (payload instanceof FormData) {
        dataToSend = payload;
      } else {
        // إذا كان كائن عادي (من EditForm) نحوله لـ FormData وننسق الأسماء للسيرفر
        dataToSend = new FormData();
        dataToSend.append("FirstName", payload.firstName);
        dataToSend.append("LastName", payload.lastName);
        dataToSend.append("City", payload.city || "");
        dataToSend.append("PhoneNumber", payload.phoneNumber || "");
         if (payload.DateOfBirth) {
        dataToSend.append("DateOfBirth", payload.DateOfBirth);
      }
      }

      const res = await apiClient.put('/User/Profile/me', dataToSend);
      setUser(res.data);
      return { ok: true, user: res.data }; 
     
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || "فشل التحديث" };
    } finally {
      setSaving(false);
    }
  }, []);

  
  const toggleAccountStatus= useCallback(async () => {
    setToggling(true);
    try {
      const res = await apiClient.patch('/User/Profile/me/status-toggle');
      setUser(res.data); 
      return { ok: true };
    } catch (err) {
      return { ok: false, error: "فشل تغيير حالة الحساب" };
    } finally {
      setToggling(false);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  return { user, loading, saving, toggling, fetchUser, updateUser,toggleAccountStatus };
};