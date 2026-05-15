// src/Hooks/useWorkerProfile.js
import { useState, useEffect, useCallback } from "react";
import apiClient from "../API/axiosConfig";

/**
 * useWorkerProfile
 * ──────────────────────────────────────────────────────────────
 * workerId = null  →  Owner   → GET /Worker/Profile/me
 * workerId = "x"   →  Visitor → GET /Worker/Profile/x
 *
 * PUT /api/Worker/Profile/me  (multipart/form-data)
 * Fields (exact names from Scalar):
 *   DateOfBirth, ExperienceYears, FirstName, JobDescription,
 *   LastName, Latitude, Longitude, PhoneNumber, ProfileImage,
 *   SpecialtyIds[], WorkingHours[{ dayOfWeek, startTime, endTime }]
 */
export const useWorkerProfile = (workerId = null) => {
  const [worker,        setWorker]        = useState(null);
  const [workImages,    setWorkImages]    = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [toggling,      setToggling]      = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [error,         setError]         = useState(null);

  // ── GET ────────────────────────────────────────────────────
 // داخل src/Hooks/useWorkerProfile.js
const fetchWorker = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    // إذا لم يوجد ID أو إذا كان الـ ID يخص المستخدم المسجل حالياً
    const endpoint = workerId ?  `/General/Workers/${workerId}/profile`: "/Worker/Profile/me";
    const res = await apiClient.get(endpoint);
    setWorker(res.data);
  } catch (err) {
    setError(err.response?.data?.message || "فشل تحميل بيانات العامل");
  } finally {
    setLoading(false);
  }
}, [workerId]);
  // ── GET work-images ────────────────────────────────────────
const fetchWorkImages = useCallback(async () => {
  setImagesLoading(true);
  try {
    const endpoint = workerId
      ? `/General/Workers/${workerId}/profile`
      : "/Worker/Profile/me/work-images";
    const res = await apiClient.get(endpoint);
    setWorkImages(res.data || []);
  } catch (err) {
    console.error("فشل تحميل صور المعرض", err);
  } finally {
    setImagesLoading(false);
  }
}, [workerId]);

  // ── PUT /Worker/Profile/me ─────────────────────────────────
  // payload shape (all optional except FirstName + LastName):
  // {
  //   FirstName, LastName, PhoneNumber, JobDescription,
  //   ExperienceYears, DateOfBirth, Latitude, Longitude,
  //   SpecialtyIds: string[],
  //   WorkingHours: [{ dayOfWeek, startTime, endTime }],
  //   ProfileImage: File (optional)
  // }
  const updateWorker = useCallback(async (payload) => {
    setSaving(true);
    try {
      const fd = new FormData();

      // ── Scalar field names (exact) ──────────────────────
      if (payload.FirstName       !== undefined) fd.append("FirstName",       payload.FirstName);
      if (payload.LastName        !== undefined) fd.append("LastName",        payload.LastName);
      if (payload.PhoneNumber     !== undefined) fd.append("PhoneNumber",     payload.PhoneNumber);
      if (payload.JobDescription  !== undefined) fd.append("JobDescription",  payload.JobDescription);
      if (payload.ExperienceYears !== undefined) fd.append("ExperienceYears", payload.ExperienceYears);
      if (payload.DateOfBirth     !== undefined) fd.append("DateOfBirth",     payload.DateOfBirth);
      if (payload.Latitude        !== undefined) fd.append("Latitude",        payload.Latitude);
      if (payload.Longitude       !== undefined) fd.append("Longitude",       payload.Longitude);

      // ProfileImage (File object)
      if (payload.ProfileImage instanceof File) {
        fd.append("ProfileImage", payload.ProfileImage);
      }

      // SpecialtyIds → append each element separately
      if (Array.isArray(payload.SpecialtyIds)) {
        payload.SpecialtyIds.forEach(id => fd.append("SpecialtyIds", id));
      }

      
// سطر 58 تقريباً في useWorkerProfile.js 
if (Array.isArray(payload.WorkingHours)) {
  payload.WorkingHours.forEach((wh, i) => {
    // نستخدم wh.dayOfWeek (سمول) لتطابق ما يخرج من الـ Editor 
    fd.append(`WorkingHours[${i}].DayOfWeek`, wh.dayOfWeek || wh.DayOfWeek);
    fd.append(`WorkingHours[${i}].StartTime`, wh.startTime || wh.StartTime);
    fd.append(`WorkingHours[${i}].EndTime`,   wh.endTime   || wh.EndTime);
  });
}

      const res = await apiClient.put("/Worker/Profile/me", fd);
      setWorker(res.data);
      return { ok: true, worker: res.data };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || "فشل تحديث البيانات" };
    } finally {
      setSaving(false);
    }
  }, []);

  // ── PATCH status-toggle ────────────────────────────────────
const toggleStatus = useCallback(async () => {
  setToggling(true);
  try {
    const res = await apiClient.patch("/Worker/Profile/me/status-toggle");
    
    // ✅ الحل: إذا السيرفر أعاد بيانات نستخدمها، وإلا نحدث الحالة محلياً
    if (res.data && Object.keys(res.data).length > 0) {
      setWorker(res.data);
      return { ok: true, worker: res.data };
    } else {
      // السيرفر أعاد No Body — نحدث الحالة محلياً
      setWorker(prev => ({
        ...prev,
        status: prev.status === "Active" ? "Inactive" : "Active"
      }));
      return { ok: true };
    }
  } catch (err) {
    return { ok: false, error: "فشل تغيير حالة التوفر" };
  } finally {
    setToggling(false);
  }
}, []);

  // ── Upload profile image via PUT ───────────────────────────
  const uploadProfileImage = useCallback(async (file, currentWorker) => {
    return updateWorker({
      FirstName:      currentWorker?.firstName      || "",
      LastName:       currentWorker?.lastName       || "",
      PhoneNumber:    currentWorker?.phoneNumber    || "",
      JobDescription: currentWorker?.jobDescription || "",
      ProfileImage:   file,
    });
  }, [updateWorker]);

  // ── POST work-images ───────────────────────────────────────
// البحث عن دالة uploadWorkImage وتحديثها
const uploadWorkImage = useCallback(async (imageFile, name = "", description = "") => {
  setSaving(true);
  try {
    const fd = new FormData();
    // التعديل حسب السكيما الجديدة: ImageFile بدلاً من MainImage
    fd.append("ImageFile", imageFile); 
    fd.append("Name", name); // كانت Title سابقاً
    fd.append("Description", description);

    const res = await apiClient.post("/Worker/Profile/me/work-images", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    
    const newImg = res.data;
    setWorkImages(prev => [...prev, newImg]);
    return { ok: true, image: newImg };
  } catch (err) {
    return { ok: false, error: err.response?.data?.message || "فشل رفع المشروع" };
  } finally {
    setSaving(false);
  }
}, []);

  // ── DELETE work-images/{mainImageId} ──────────────────────
  const deleteWorkImage = useCallback(async (mainImageId) => {
    try {
      await apiClient.delete(`/Worker/Profile/me/work-images/${mainImageId}`);
      setWorkImages(prev => prev.filter(img => img.id !== mainImageId));
      return { ok: true };
    } catch (err) {
      return { ok: false, error: "فشل حذف الصورة" };
    }
  }, []);

  // ── POST sub-images ────────────────────────────────────────
  const uploadSubImage = useCallback(async (mainImageId, imageFile) => {
    try {
      const fd = new FormData();
      fd.append("SubImage", imageFile);
      const res = await apiClient.post(
        `/Worker/Profile/me/work-images/${mainImageId}/sub-images`, fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return { ok: true, image: res.data };
    } catch (err) {
      return { ok: false, error: "فشل رفع الصورة الفرعية" };
    }
  }, []);

  // ── DELETE sub-images/{subImageId} ────────────────────────
  const deleteSubImage = useCallback(async (subImageId) => {
    try {
      await apiClient.delete(`/Worker/Profile/me/work-sub-images/${subImageId}`);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: "فشل حذف الصورة الفرعية" };
    }
  }, []);

// 1. إضافة موعد جديد (POST)
const addWorkingHour = useCallback(async (hourData) => {
  setSaving(true);
  try {
    const res = await apiClient.post("/Worker/WorkingHours", hourData);
    // تحديث الحالة المحلية فوراً ليظهر الموعد الجديد
    setWorker(prev => ({
      ...prev,
      workingHours: [...(prev.workingHours || []), res.data]
    }));
    return { ok: true, data: res.data };
  } catch (err) {
    return { ok: false, error: "فشل إضافة موعد العمل" };
  } finally {
    setSaving(false);
  }
}, []);

// 2. تحديث موعد موجود (PUT)
const updateWorkingHour = useCallback(async (id, hourData) => {
  setSaving(true);
  try {
    const res = await apiClient.put(`/Worker/WorkingHours/${id}`, hourData);
    setWorker(prev => ({
      ...prev,
      workingHours: prev.workingHours.map(h => h.id === id ? res.data : h)
    }));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: "فشل تحديث الموعد" };
  } finally {
    setSaving(false);
  }
}, []);

// 3. حذف موعد (DELETE)
const deleteWorkingHour = useCallback(async (id) => {
  try {
    await apiClient.delete(`/Worker/WorkingHours/${id}`);
    setWorker(prev => ({
      ...prev,
      workingHours: prev.workingHours.filter(h => h.id !== id)
    }));
    return { ok: true };
  } catch (err) {
    return { ok: false, error: "فشل حذف الموعد" };
  }
}, []);

  useEffect(() => { fetchWorker(); }, [fetchWorker]);
  useEffect(() => { fetchWorkImages(); }, [fetchWorkImages]);


  return {
    worker, workImages, loading, saving, toggling, imagesLoading, error,
    fetchWorker, fetchWorkImages,
    updateWorker, toggleStatus,
    uploadProfileImage, setWorker,
    uploadWorkImage, deleteWorkImage,
    uploadSubImage, deleteSubImage,
    addWorkingHour, updateWorkingHour, deleteWorkingHour
  };
};