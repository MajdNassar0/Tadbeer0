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

  // ── GET work-images ────────────────────────────────────────
  const fetchWorkImages = useCallback(async () => {
    setImagesLoading(true);
    try {
      const res = await apiClient.get("/Worker/Profile/me/work-images");
      setWorkImages(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (err) {
      console.error("فشل تحميل صور الأعمال", err);
    } finally {
      setImagesLoading(false);
    }
  }, []);

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

      // WorkingHours → append as indexed fields (ASP.NET Core FormData convention)
      if (Array.isArray(payload.WorkingHours)) {
        payload.WorkingHours.forEach((wh, i) => {
          fd.append(`WorkingHours[${i}].dayOfWeek`, wh.dayOfWeek);
          fd.append(`WorkingHours[${i}].startTime`, wh.startTime);
          fd.append(`WorkingHours[${i}].endTime`,   wh.endTime);
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
      setWorker(res.data);
      return { ok: true, worker: res.data };
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
  const uploadWorkImage = useCallback(async (imageFile) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("MainImage", imageFile);
      const res = await apiClient.post("/Worker/Profile/me/work-images", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newImg = res.data;
      setWorkImages(prev => [...prev, newImg]);
      return { ok: true, image: newImg };
    } catch (err) {
      return { ok: false, error: err.response?.data?.message || "فشل رفع الصورة" };
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

  useEffect(() => { fetchWorker(); }, [fetchWorker]);
  useEffect(() => { if (!workerId) fetchWorkImages(); }, [workerId, fetchWorkImages]);

  return {
    worker, workImages, loading, saving, toggling, imagesLoading, error,
    fetchWorker, fetchWorkImages,
    updateWorker, toggleStatus,
    uploadProfileImage,
    uploadWorkImage, deleteWorkImage,
    uploadSubImage, deleteSubImage,
  };
};