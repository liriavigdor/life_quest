import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// הבטחת חיבור קבוע של מפתח Gemini AI בכל הפעלת דפדפן
try {
  const envKey = import.meta.env?.VITE_GEMINI_API_KEY;
  if (envKey && typeof window !== 'undefined' && window.localStorage) {
    window.localStorage.setItem('lifequest_gemini_api_key', envKey.trim());
  }
} catch (_) {}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
