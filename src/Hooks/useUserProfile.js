import { useState, useEffect, useCallback } from "react";
import apiClient from "../API/axiosConfig";

export const useUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // لحالة حفظ البيانات
  const [toggling, setToggling] = useState(false); // أضفنا هذه لحالة تعطيل الحساب

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
      const formData = new FormData();
      Object.keys(payload).forEach(key => formData.append(key, payload[key]));
      const res = await apiClient.put('/User/Profile/me', formData);
      setUser(res.data);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    } finally {
      setSaving(false);
    }
  }, []);
  
  const toggleStatus = useCallback(async () => {
    setToggling(true);
    try {
      // نرسل الطلب للرابط الذي حددتيه
      const res = await apiClient.patch('/User/Profile/me/status-toggle');
      // تحديث حالة المستخدم بالبيانات الجديدة القادمة من السيرفر
      setUser(res.data); 
      return { ok: true };
    } catch (err) {
      return { ok: false, error: "فشل تغيير حالة الحساب" };
    } finally {
      setToggling(false);
    }
  }, []);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  // تأكدي من إرجاع saving و toggling و toggleStatus
  return { user, loading, saving, toggling, fetchUser, updateUser, toggleStatus };
};