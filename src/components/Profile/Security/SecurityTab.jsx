// src\components\Profile\Security\SecurityTab.jsx

import React, { useState } from 'react';
import { KeyRound, Smartphone, Ban, Trash2 } from 'lucide-react';
import SecurityItem from './SecurityItem';
import PasswordModal from './modals/PasswordModal';
import DeleteAccountModal from './modals/DeleteAccountModal';
import DeactivateModal from './modals/DeactivateModal';
import { useToast } from '../../../pages/UserProfile/UserProfile';
import { useUserProfile } from '../../../Hooks/useUserProfile';
import { useAuth } from '../../../context/AuthContext'; // 1. استيراد الـ Auth Hook

const SecurityTab = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [deactivateLoading, setDeactivateLoading] = useState(false);
  const toast = useToast();
  
  const { user, updateUser } = useAuth(); // 2. الحصول على المستخدم ودالة التحديث
  const { toggleStatus } = useUserProfile();

  const handleDeactivateConfirm = async () => {
    setDeactivateLoading(true);
    const res = await toggleStatus(); 
    setDeactivateLoading(false);

    if (res.ok) {
  updateUser(res.data); // 👈 خذ البيانات من السيرفر مباشرة
  toast("تم تحديث حالة الحساب ✓");
} else {
      toast(res.error || "فشل في تغيير الحالة", "error");
    }
  };

  // 4. لجعل الزر يتغير نصّه بناءً على الحالة (اختياري لكنه احترافي)
  const isInactive = user?.status === "Inactive";

  const securityData = [
    { id: 'pwd', icon: KeyRound, title: "تغيير كلمة المرور", desc: "تحديث كلمة المرور لحماية حسابك", btn: "تغيير" },
    { id: '2fa', icon: Smartphone, title: "التحقق بخطوتين", desc: "أضف طبقة حماية إضافية", btn: "تفعيل" },
    { 
      id: 'deactivate', 
      icon: Ban, 
      title: isInactive ? "تفعيل الحساب" : "تعطيل الحساب مؤقتاً", 
      desc: isInactive ? "يمكنك إعادة تنشيط حسابك الآن" : "يمكنك استعادة حسابك في أي وقت", 
      btn: isInactive ? "تفعيل" : "تعطيل", 
      variant: isInactive ? 'success' : 'danger' 
    },
    { id: 'delete', icon: Trash2, title: "حذف الحساب نهائياً", desc: "سيتم مسح كافة بياناتك نهائياً", btn: "حذف", variant: 'danger' },
  ];

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
        onConfirm={handleDeactivateConfirm}
        loading={deactivateLoading}
        // مرر حالة الحساب الحالية للمودال ليتغير النص بداخله أيضاً
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