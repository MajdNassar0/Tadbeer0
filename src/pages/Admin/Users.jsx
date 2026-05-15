import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Users as UsersIcon, Trash2, X } from "lucide-react";

const API_BASE = "https://tadbeer0.runasp.net/api";

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-7 h-7 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ConfirmModal({ name, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-80 shadow-xl border border-gray-100" dir="rtl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-800">تأكيد الحذف</h3>
          <button onClick={onCancel} className="text-gray-300 hover:text-gray-500">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-1">هل أنت متأكد من حذف المستخدم؟</p>
        <p className="text-sm font-medium text-gray-800 mb-6">{name}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium
                       py-2.5 rounded-xl transition-all disabled:opacity-60"
          >
            {loading ? "جارٍ الحذف..." : "نعم، احذف"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs
                       font-medium py-2.5 rounded-xl transition-all"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

const STATUS_COLORS = {
  active:   "bg-green-50 text-green-700",
  inactive: "bg-gray-50  text-gray-500",
  banned:   "bg-red-50   text-red-600",
};

const STATUS_LABEL = {
  active:   "نشط",
  inactive: "غير نشط",
  banned:   "محظور",
};

const Users = () => {
  const navigate = useNavigate();
  const [users,    setUsers   ] = useState(null);
  const [profiles, setProfiles] = useState({});   // id → full profile
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/auth/login"); return; }
      const headers = { Authorization: `Bearer ${token}` };

      // Step 1 — fetch user list
      let list = [];
      try {
        const res = await axios.get(`${API_BASE}/Admin/Users`, { headers });
        const items = res.data?.items ?? res.data ?? [];
        list = (Array.isArray(items) ? items : []).filter(u =>
          !u.role || u.role?.toLowerCase() === "user"
        );
        setUsers(list);
      } catch (err) {
        setUsers([]);
        if (err.response?.status === 401) { localStorage.clear(); navigate("/auth/login"); }
        return;
      }

      // Step 2 — enrich each user with full profile to get phoneNumber + city
      const enrichAll = async () => {
        const enriched = {};
        await Promise.allSettled(
          list.map(async (u) => {
            if (!u.id) return;
            try {
              const r = await axios.get(`${API_BASE}/Admin/Users/${u.id}`, { headers });
              enriched[u.id] = r.data?.data ?? r.data ?? {};
            } catch {
              // silently skip — row shows base data
            }
          })
        );
        setProfiles(enriched);
      };

      enrichAll();
    };

    load();
  }, [navigate]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE}/Admin/Users/${toDelete.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(prev => prev.filter(u => u.id !== toDelete.id));
      setProfiles(prev => { const n = { ...prev }; delete n[toDelete.id]; return n; });
      setToDelete(null);
    } catch {
      setErrorMsg("فشل الحذف، يرجى المحاولة مجدداً");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {toDelete && (
        <ConfirmModal
          name={toDelete.name}
          onConfirm={handleDelete}
          onCancel={() => { setToDelete(null); setErrorMsg(""); }}
          loading={deleting}
        />
      )}

      <div className="space-y-4">
        <div className="pb-3 border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-700">
            إدارة المستخدمين
            <span className="mr-2 text-xs font-normal text-gray-400">({users?.length ?? 0})</span>
          </h2>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-xl">
            {errorMsg}
          </div>
        )}

        {users === null ? <Spinner /> : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <UsersIcon size={20} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">لا يوجد مستخدمون حالياً</p>
            <p className="text-xs text-gray-300">سيظهرون هنا فور تسجيلهم</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] text-gray-400 border-b border-gray-100">
                  <th className="py-3 px-6 text-right font-medium">الاسم</th>
                  <th className="py-3 px-4 text-right font-medium">البريد</th>
                  <th className="py-3 px-4 text-right font-medium">رقم الهاتف</th>
                  <th className="py-3 px-4 text-right font-medium">المدينة</th>
                  <th className="py-3 px-4 text-center font-medium">الحالة</th>
                  <th className="py-3 px-6 text-center font-medium">حذف</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-gray-50">
                {users.map((base, i) => {
                  // Merge base list data with enriched full profile
                  const full = profiles[base.id] ?? {};
                  const u = { ...base, ...full };

                  const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "—";
                  const statusKey = u.status?.toLowerCase() ?? "";
                  const statusCls = STATUS_COLORS[statusKey] ?? "bg-gray-50 text-gray-400";
                  const isEnriched = !!profiles[base.id];

                  // UserProfile.jsx uses u.phoneNumber
                  const phone = u.phoneNumber || u.primaryPhoneNumber || u.phone || null;

                  const avatarSrc = u.profileImage && u.profileImage !== "string"
                    ? (u.profileImage.startsWith("http") ? u.profileImage : `https://tadbeer0.runasp.net/${u.profileImage}`)
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "م")}&background=001F3F&color=F7A823&size=200&bold=true`;

                  return (
                    <tr key={base.id ?? i} className="hover:bg-gray-50/60 transition-colors">

                      {/* Name + avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={avatarSrc}
                            alt={name}
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "م")}&background=001F3F&color=F7A823&size=200&bold=true`;
                            }}
                          />
                          <span className="font-medium text-gray-800">{name}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-gray-500">{u.email || "—"}</td>

                      {/* Phone — skeleton while enriching */}
                      <td className="py-4 px-4 text-gray-400">
                        {isEnriched
                          ? (phone || "—")
                          : <span className="inline-block w-20 h-3 bg-gray-100 rounded animate-pulse" />}
                      </td>

                      {/* City — skeleton while enriching */}
                      <td className="py-4 px-4 text-gray-400">
                        {isEnriched
                          ? (u.city || "—")
                          : <span className="inline-block w-14 h-3 bg-gray-100 rounded animate-pulse" />}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusCls}`}>
                          {STATUS_LABEL[statusKey] || u.status || "—"}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setToDelete({ id: base.id, name })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                     bg-red-50 text-red-500 hover:bg-red-100 transition-colors
                                     text-[10px] font-medium"
                        >
                          <Trash2 size={12} />
                          حذف
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Users;
