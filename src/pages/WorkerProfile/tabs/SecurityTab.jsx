// src/pages/WorkerProfile/tabs/SecurityTab.jsx (أو المسار المعتمد عندك للعامل)

import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Ban, Trash2 } from 'lucide-react';
import SecurityItem from '../../../components/Profile/Security/SecurityItem';
import PasswordModal from '../../../components/Profile/Security/modals/PasswordModal';
import DeleteAccountModal from '../../../components/Profile/Security/modals/DeleteAccountModal';
import DeactivateModal from '../../../components/Profile/Security/modals/DeactivateModal';

const SecurityTab = ({ worker, onToggleStatus, toast, toggling }) => {
  const [activeModal, setActiveModal] = useState(null);

  // فحص حالة العامل بناءً على البيانات القادمة من السيرفر [cite: 165]
  const isInactive = worker?.status === "Inactive";

  const securityData = [
    { id: 'pwd', icon: KeyRound, title: "تغيير كلمة المرور", desc: "تحديث كلمة المرور لحماية حسابك", btn: "تغيير" },
    { id: 'verify', icon: ShieldCheck, title: "توثيق الهوية", desc: "ارفع هويتك للحصول على شارة موثوق", btn: "توثيق" },
    { 
      id: 'deactivate', 
      icon: Ban, 
      title: isInactive ? "تفعيل الحساب" : "تعطيل الحساب مؤقتاً", 
      desc: isInactive ? "يمكنك إعادة تنشيط حسابك الآن" : "يمكنك إخفاء بروفايلك عن العملاء مؤقتاً", 
      btn: isInactive ? "تفعيل" : "تعطيل", 
      variant: isInactive ? 'success' : 'danger' 
    },
    { id: 'delete', icon: Trash2, title: "حذف الحساب نهائياً", desc: "سيتم مسح كافة بياناتك نهائياً", btn: "حذف", variant: 'danger' },
  ];

  const handleDeactivate = async () => {
    const res = await onToggleStatus(); // استدعاء الدالة التي تستخدم طلب الـ PATCH للعامل
    if (res.ok) {
      toast("تم تحديث حالة الحساب بنجاح ✓");
      setActiveModal(null);
    } else {
      toast(res.error, "error");
    }
  };

  return (
    <div className="space-y-4">
      {securityData.map((item) => (
        <SecurityItem 
          key={item.id}
          {...item}
          btnText={item.btn}
          onClick={() => setActiveModal(item.id)}
        />
      ))}

      <PasswordModal 
        isOpen={activeModal === 'pwd'} 
        onClose={() => setActiveModal(null)} 
        toast={toast} 
      />
      
      <DeactivateModal 
        isOpen={activeModal === 'deactivate'} 
        onClose={() => setActiveModal(null)} 
        onConfirm={handleDeactivate}
        loading={toggling}
        isInactive={isInactive} 
      />

      <DeleteAccountModal 
        isOpen={activeModal === 'delete'} 
        onClose={() => setActiveModal(null)} 
      />
    </div>
  );
};

export default SecurityTab;