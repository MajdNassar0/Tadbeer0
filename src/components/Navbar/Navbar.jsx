import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo - يمين */}
            <div className="flex items-center gap-2">
              <div className="bg-yellow-500 w-8 h-8 rounded-md flex items-center justify-center">
                <span className="text-black font-bold">T</span>
              </div>
              <span className="text-xl font-bold text-gray-900">تدبير</span>
            </div>

            {/* Desktop Links */}
            <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
              <li>
                <Link to="/" className="hover:text-yellow-500 cursor-pointer">
                  الرئيسية
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="hover:text-yellow-500 cursor-pointer"
                >
                  عن المنصة
                </Link>
              </li>

              <li>
                <Link
                  to="/services"
                  className="hover:text-yellow-500 cursor-pointer"
                >
                  الخدمات
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="hover:text-yellow-500 cursor-pointer"
                >
                  اتصل بنا
                </Link>
              </li>
            </ul>

            {/* Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <button className="text-gray-900 hover:bg-gray-200 hover:shadow-2xs transition-all  duration-800 px-4 py-2 rounded-md font-medium">
                <i className="fa-solid fa-arrow-right-to-bracket ml-1.5 " />
                تسجيل الدخول
              </button>

              <button className="bg-yellow-500 hover:bg-yellow-400 hover:shadow-black text-gray-700 px-4 py-2 rounded-md font-medium transition-all  duration-800">
                <i className="fa-solid fa-user-plus ml-1.5" />
                إنشاء حساب
              </button>
            </div>

            {/* Mobile Button */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden text-2xl text-gray-700"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden bg-white px-6 pb-4 space-y-3 shadow">
            <div className="border-b pb-0.5"><Link to="/" className="hover:text-yellow-500 cursor-pointer">
                  الرئيسية
                </Link></div>
            <div className="border-b pb-2">عن المنصة</div>
            <div className="border-b pb-2">الخدمات</div>
            <div className="border-b pb-2">اتصل بنا</div>

            <button className="w-full text-right text-gray-700 pt-2">
              تسجيل الدخول
            </button>

            <button className="w-full bg-yellow-500 mt-2 py-2 rounded-md">
              إنشاء حساب
            </button>
          </div>
        )}
      </nav>
    </>
  );
}

export default Navbar;