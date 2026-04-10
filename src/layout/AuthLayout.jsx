import React from 'react'
import { Outlet } from 'react-router-dom'
import ScrollToTop from "../components/ScrollToTop/ScrollToTop"; 

function AuthLayout() {
  return (
    <>
    <ScrollToTop />
    <Outlet/>

    </>
  )
}

export default AuthLayout
