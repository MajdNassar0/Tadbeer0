import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Hero from './component/Hero/Hero.jsx'
import Contact from './component/Contact/Contact.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Hero/>
    <Contact/>
  </StrictMode>,
)
