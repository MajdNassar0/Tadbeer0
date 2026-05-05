// src/Hooks/useWorkerProfile.js
import { useState, useEffect, useCallback } from "react";
import apiClient from "../API/axiosConfig";

/**
 * useWorkerProfile
 * ──────────────────────────────────────────────────────────────
 * workerId = null  →  Owner mode   → GET /Worker/Profile/me
 * workerId = "x"   →  Visitor mode → GET /Worker/Profile/x
 *
 * Endpoints (from Scalar docs):
 *  GET    /api/Worker/Profile/me
 *  PUT    /api/Worker/Profile/me
 *  POST   /api/Worker/Profile/me/work-images
 *  GET    /api/Worker/Profile/me/work-images
 *  POST   /api/Worker/Profile/me/work-images/{mainImageId}/sub-images
 *  GET    /api/Worker/Profile/me/work-images/{mainImageId}/sub-images
 *  DELETE /api/Worker/Profile/me/work-images/{mainImageId}
 *  DELETE /api/Worker/Profile/me/work-sub-images/{subImageId}
 *  PATCH  /api/Worker/Profile/me/status-toggle
 */
export const useWorkerProfile = (workerId = null) => {
  const [worker,        setWorker]        = useState(null);
  const [workImages,    setWorkImages]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [toggling,      setToggling]      = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [error,         setError]         = useState(null);

  // ── GET /Worker/Profile/me  OR  /Worker/Profile/:id ────────
  const fetchWorker = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = workerId
        ? `/Worker/Profile/${workerId}`
        : "/Worker/Profile/me";
      const res = await apiClient.get(endpoint);
      setWorker(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "فشل تحميل بيانات العامل");
    } finally {
      setLoading(false);
    }
  }, [workerId]);

  // ── GET /Worker/Profile/me/work-images ─────────────────────
  const fetchWorkImages = useCallback(async () => {
    setImagesLoading(true);
    try {
      const res = await apiClient.get("/Worker/Profile/me/work-images");
      // الـ API قد ترجع array مباشرة أو { data: [...] }
      setWorkImages(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error("فشل تحميل صور الأعمال", err);
    } finally {
      setImagesLoading(false);
    }
  }, []);

  // ── PUT /Worker/Profile/me ─────────────────────────────────
  // يقبل: FirstName, LastName, City, PhoneNumber, Bio,
  //        YearsOfExperience, DateOfBirth, ProfileImage (file)
 // src/Hooks/useWorkerProfile.js

const updateWorker = useCallback(async (payload) => {
  setSaving(true);
  try {
    let dataToSend = new FormData();

    // 1. الحقول النصية والأساسية (تأكد من مطابقة الأسماء للـ API)
    if (payload.firstName)   dataToSend.append("FirstName", payload.firstName);
    if (payload.lastName)    dataToSend.append("LastName", payload.lastName);
    if (payload.phoneNumber) dataToSend.append("PhoneNumber", payload.phoneNumber);
    if (payload.bio)         dataToSend.append("JobDescription", payload.bio); // الـ API يطلب JobDescription
    
    // 2. الحقول الرقمية (ExperienceYears)
    if (payload.yearsOfExperience !== undefined) {
      dataToSend.append("ExperienceYears", payload.yearsOfExperience);
    }

    // 3. التاريخ (DateOfBirth) - يجب أن يكون YYYY-MM-DD
    if (payload.DateOfBirth) {
      dataToSend.append("DateOfBirth", payload.DateOfBirth);
    }

    // 4. الصورة الشخصية (إذا تم تمرير ملف)
    if (payload.profileImageFile) {
      dataToSend.append("ProfileImage", payload.profileImageFile);
    }

    // 5. الإحداثيات (إذا كانت متوفرة في الفورم)
    if (payload.latitude)  dataToSend.append("Latitude", payload.latitude);
    if (payload.longitude) dataToSend.append("Longitude", payload.longitude);

    // 6. المصفوفات (SpecialtyIds) - ترسل بتكرار المفتاح
    if (payload.specialtyIds && Array.isArray(payload.specialtyIds)) {
      payload.specialtyIds.forEach(id => dataToSend.append("SpecialtyIds", id));
    }

    const res = await apiClient.put("/Worker/Profile/me", dataToSend, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    setWorker(res.data);
    return { ok: true, worker: res.data };
  } catch (err) {
    console.error("Update Error:", err.response?.data);
    return { ok: false, error: err.response?.data?.message || "فشل تحديث البيانات" };
  } finally {
    setSaving(false);
  }
}, []);

  // ── PATCH /Worker/Profile/me/status-toggle ─────────────────
  const toggleStatus = useCallback(async () => {
    setToggling(true);
    try {
      const res = await apiClient.patch("/Worker/Profile/me/status-toggle");
      setWorker(res.data);
      return { ok: true, worker: res.data };
    } catch (err) {
      return { ok: false, error: "فشل تغيير حالة التوفر" };
    } finally {
      setToggling(false);
    }
  }, []);

  // ── Upload profile picture via PUT /me ─────────────────────
  const uploadProfileImage = useCallback(async (file, currentWorker) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("FirstName",    currentWorker?.firstName    || "");
      formData.append("LastName",     currentWorker?.lastName     || "");
      formData.append("City",         currentWorker?.city         || "");
      formData.append("PhoneNumber",  currentWorker?.phoneNumber  || "");
      formData.append("Bio",          currentWorker?.bio          || "");
      formData.append("ProfileImage", file);
      const res = await apiClient.put("/Worker/Profile/me", formData);
      setWorker(res.data);
      return { ok: true, worker: res.data };
    } catch (err) {
      return { ok: false, error: "فشل رفع صورة الملف الشخصي" };
    } finally {
      setSaving(false);
    }
  }, []);

  // ── POST /Worker/Profile/me/work-images ───────────────────
  const uploadWorkImage = useCallback(async (imageFile) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("MainImage", imageFile);
      const res = await apiClient.post("/Worker/Profile/me/work-images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newImage = res.data;
      setWorkImages(prev => [...prev, newImage]);
      return { ok: true, image: newImage };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || "فشل رفع صورة العمل" };
    } finally {
      setSaving(false);
    }
  }, []);

  // ── DELETE /Worker/Profile/me/work-images/{mainImageId} ───
  const deleteWorkImage = useCallback(async (mainImageId) => {
    try {
      await apiClient.delete(`/Worker/Profile/me/work-images/${mainImageId}`);
      setWorkImages(prev => prev.filter(img => img.id !== mainImageId));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: "فشل حذف صورة العمل" };
    }
  }, []);

  // ── POST /Worker/Profile/me/work-images/{mainImageId}/sub-images
  const uploadSubImage = useCallback(async (mainImageId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("SubImage", imageFile);
      const res = await apiClient.post(
        `/Worker/Profile/me/work-images/${mainImageId}/sub-images`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return { ok: true, image: res.data };
    } catch (err) {
      return { ok: false, error: "فشل رفع الصورة الفرعية" };
    }
  }, []);

  // ── DELETE /Worker/Profile/me/work-sub-images/{subImageId}
  const deleteSubImage = useCallback(async (subImageId) => {
    try {
      await apiClient.delete(`/Worker/Profile/me/work-sub-images/${subImageId}`);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: "فشل حذف الصورة الفرعية" };
    }
  }, []);

  useEffect(() => {
    fetchWorker();
  }, [fetchWorker]);

  // جلب صور الأعمال فقط في Owner mode
  useEffect(() => {
    if (!workerId) fetchWorkImages();
  }, [workerId, fetchWorkImages]);

  return {
    worker, workImages, loading, saving, toggling, imagesLoading, error,
    fetchWorker, fetchWorkImages,
    updateWorker, toggleStatus,
    uploadProfileImage,
    uploadWorkImage, deleteWorkImage,
    uploadSubImage,  deleteSubImage,
  };
};