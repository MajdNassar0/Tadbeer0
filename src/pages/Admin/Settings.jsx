import React, { useState } from "react";
import axios from "axios";
import { KeyRound, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";

const API_BASE = "https://tadbeer0.runasp.net/api";

const Settings = () => {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError]   = useState("");

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(""); setSuccess("");
  };

  const toggleShow = (field) => setShow(prev => ({ ...prev, [field]: !prev[field] }));

  const handleSubmit = async () => {
    setError(""); setSuccess("");

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError("يرجى تعبئة جميع الحقول"); return;
    }
    if (form.newPassword.length < 6) {
      setError("كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل"); return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("كلمة المرور الجديدة وتأكيدها غير متطابقتين"); return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API_BASE}/Identity/Auth/change-password`,
        {
          currentPassword: form.currentPassword,
          newPassword:     form.newPassword,
          confirmNewPassword: form.confirmPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // API returns { isSuccess, errors } even on success
      setSuccess("تم تغيير كلمة المرور بنجاح ✓");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      const data = err.response?.data;
      const msg = data?.errors?.[0]
        || data?.message
        || data?.title
        || "فشل تغيير كلمة المرور، تحقق من كلمة المرور الحالية";
      setError(typeof msg === "string" ? msg : "فشل تغيير كلمة المرور");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "currentPassword", label: "كلمة المرور الحالية", showKey: "current" },
    { name: "newPassword",     label: "كلمة المرور الجديدة", showKey: "new"     },
    { name: "confirmPassword", label: "تأكيد كلمة المرور",   showKey: "confirm" },
  ];

  return (
    <div dir="rtl" className="max-w-md space-y-5">

      {/* Header */}
      <div className="pb-3 border-b border-gray-100">
        <h2 className="text-base font-medium text-gray-700 flex items-center gap-2">
          <ShieldCheck size={17} className="text-[#F7A823]" />
          إعدادات الحساب
        </h2>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
        <div className="flex items-center gap-3 pb-4 border-b border-gray-50">
          <div className="w-10 h-10 rounded-xl bg-[#001F3F]/5 flex items-center justify-center">
            <KeyRound size={18} className="text-[#001F3F]/40" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">تغيير كلمة المرور</p>
            <p className="text-xs text-gray-400">يُنصح بتحديثها بشكل دوري</p>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {fields.map(({ name, label, showKey }) => (
            <div key={name} className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600">{label}</label>
              <div className="relative">
                <input
                  type={show[showKey] ? "text" : "password"}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  style={{ WebkitTextSecurity: show[showKey] ? "none" : undefined }}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 pl-10 text-sm
                             text-gray-800 placeholder-gray-300 outline-none
                             focus:border-[#F7A823] focus:ring-2 focus:ring-[#F7A823]/10
                             transition-all [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => toggleShow(showKey)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors outline-none"
                >
                  {show[showKey] ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Error / Success */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs px-4 py-3 rounded-xl">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-100 text-green-600 text-xs px-4 py-3 rounded-xl">
            {success}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#001F3F] hover:bg-[#002d5a] disabled:opacity-60 text-white
                     py-3 rounded-xl text-sm font-semibold transition-colors flex items-center
                     justify-center gap-2 shadow-md shadow-blue-900/10"
        >
          {loading
            ? <><Loader2 size={15} className="animate-spin" /> جارٍ الحفظ...</>
            : <><KeyRound size={15} className="text-[#F7A823]" /> حفظ كلمة المرور</>
          }
        </button>
      </div>
    </div>
  );
};

export default Settings;
