import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Users as UsersIcon, Trash2, X } from "lucide-react";

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

const Users = () => {
  const navigate = useNavigate();
  const [users,    setUsers   ] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/auth/login"); return; }
      try {
        const res = await axios.get("https://tadbeer0.runasp.net/api/Admin/Users",
          { headers: { Authorization: `Bearer ${token}` } });
        const items = res.data.items ?? res.data ?? [];
        const onlyUsers = (Array.isArray(items) ? items : []).filter(u =>
          !u.role || u.role?.toLowerCase() === "user"
        );
        setUsers(onlyUsers);
      } catch (err) {
        setUsers([]);
        if (err.response?.status === 401) { localStorage.clear(); navigate("/auth/login"); }
      }
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
        `https://tadbeer0.runasp.net/api/Admin/Users/${toDelete.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(prev => prev.filter(u => u.id !== toDelete.id));
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
                {users.map((u, i) => {
                  const name = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || "—";
                  const statusKey = u.status?.toLowerCase() ?? "";
                  const statusCls = STATUS_COLORS[statusKey] ?? "bg-gray-50 text-gray-400";
                  return (
                    <tr key={u.id ?? i} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {u.profileImage && u.profileImage !== "string" ? (
                            <img src={u.profileImage} alt={name}
                                 className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-yellow-500 flex items-center justify-center
                                            text-[10px] font-medium text-[#0a1d37] flex-shrink-0">
                              {u.firstName?.[0] ?? "م"}
                            </div>
                          )}
                          <span className="font-medium text-gray-800">{name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-500">{u.email || "—"}</td>
                      <td className="py-4 px-4 text-gray-400">{u.primaryPhoneNumber || "—"}</td>
                      <td className="py-4 px-4 text-gray-400">{u.city || "—"}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusCls}`}>
                          {u.status || "—"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setToDelete({ id: u.id, name })}
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