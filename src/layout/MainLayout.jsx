import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import ScrollToTop from "../components/ScrollToTop/ScrollToTop"; 
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
   <>
   <ScrollToTop />
   <Navbar />
   <Outlet/>
   </>
  )
}

export default MainLayout
