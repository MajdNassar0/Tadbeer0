import { useNavigate } from "react-router-dom";

export default function FloatingRobot() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/search")}
      title="اسألني — ابحث عن فني"
      className="
        fixed z-50
        bottom-20 right-4
        md:bottom-20 md:right-6
        w-12 h-12
        sm:w-14 sm:h-14
        md:w-16 md:h-16
        rounded-full
        bg-[#001F3F]
        shadow-xl shadow-[#001F3F]/40
        flex items-center justify-center
        hover:scale-110 hover:shadow-2xl hover:shadow-[#001F3F]/50
        active:scale-95
        transition-all duration-300
        group
      "
    >
      {/* Pulse ring */}
      <span className="
        absolute inset-0 rounded-full
        bg-[#F7A823]/20
        animate-ping
        group-hover:animate-none
      " />

      {/* Robot SVG */}
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 relative z-10"
      >
        <line x1="32" y1="6" x2="32" y2="13" stroke="#F7A823" strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx="32" cy="4.5" r="2.5" fill="#F7A823"/>
        <rect x="16" y="13" width="32" height="22" rx="7" fill="#F7A823"/>
        <circle cx="24" cy="23" r="4" fill="#001F3F"/>
        <circle cx="40" cy="23" r="4" fill="#001F3F"/>
        <circle cx="25.5" cy="21.5" r="1.2" fill="white"/>
        <circle cx="41.5" cy="21.5" r="1.2" fill="white"/>
        <rect x="23" y="30" width="18" height="3" rx="1.5" fill="#001F3F" opacity="0.6"/>
        <rect x="11" y="19" width="5" height="10" rx="2.5" fill="#F7A823"/>
        <rect x="48" y="19" width="5" height="10" rx="2.5" fill="#F7A823"/>
        <rect x="18" y="37" width="28" height="18" rx="5" fill="white" opacity="0.15"/>
        <rect x="18" y="37" width="28" height="18" rx="5" stroke="#F7A823" strokeWidth="1.5"/>
        <rect x="24" y="41" width="7" height="5" rx="1.5" fill="#F7A823" opacity="0.8"/>
        <rect x="33" y="41" width="7" height="5" rx="1.5" fill="#F7A823" opacity="0.5"/>
        <rect x="22" y="55" width="8" height="6" rx="3" fill="#F7A823"/>
        <rect x="34" y="55" width="8" height="6" rx="3" fill="#F7A823"/>
      </svg>

      {/* Tooltip — hidden on mobile, visible on hover for md+ */}
      <span className="
        hidden md:block
        absolute right-full mr-3
        bg-[#001F3F] text-white
        text-[11px] font-bold
        px-3 py-1.5 rounded-xl
        whitespace-nowrap
        opacity-0 scale-90 origin-right
        group-hover:opacity-100 group-hover:scale-100
        transition-all duration-200
        shadow-lg
        pointer-events-none
      ">
        ابحث عن فني 🔍
      </span>
    </button>
  );
}
