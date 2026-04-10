import { createRoot } from 'react-dom/client'
import React from 'react'
import './index.css'
import App from './App.jsx'
// استيراد المزود الذي أنشأناه
import { AuthProvider } from './context/AuthContext.jsx' 

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* تغليف التطبيق بالكامل بالمزود */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)