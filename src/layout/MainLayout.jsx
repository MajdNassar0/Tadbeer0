import React from "react";
import Navbar from "../components/Navbar/Navbar";
import BottomNav from "../components/BottomNav/BottomNav";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="pb-20 lg:pb-0">
        <Outlet />
      </main>
      <BottomNav />
    </>
  );
}

export default MainLayout;
