import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import Footer from "../components/Footer/Footer";
import ScrollToTop from "../components/ScrollToTop/ScrollToTop"; 
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
   <>
   <ScrollToTop />
   <Navbar />
   <Outlet/>
   <Footer />
   </>
  )
}

export default MainLayout
