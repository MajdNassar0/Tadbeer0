import React from "react";
import Navbar from "../components/Navbar/Navbar";
import BottomNav from "../components/BottomNav/BottomNav";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import BookingNotifier from "../components/Notification/BookingNotifier";
import { Toaster } from "sonner";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" richColors />
      <BookingNotifier />
      <Navbar />
      <main className="pb-20 lg:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}

export default MainLayout;
