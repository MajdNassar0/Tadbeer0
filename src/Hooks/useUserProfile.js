import { useState, useEffect, useCallback } from "react";
import apiClient from "../API/axiosConfig"; // استدعاء الملف المركزي

export const useUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      // لا حاجة لكتابة الرابط كاملاً ولا التوكن هنا!
      const res = await apiClient.get('/User/Profile/me');
      setUser(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (payload) => {
    try {
      const formData = new FormData();
      Object.keys(payload).forEach(key => formData.append(key, payload[key]));

      // إرسال مباشر، الـ headers تضاف تلقائياً من الملف المركزي
      const res = await apiClient.put('/User/Profile/me', formData);
      setUser(res.data);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  return { user, loading, updateUser };
};