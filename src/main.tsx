import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import RootLayout from './components/layout/RootLayout.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { initializeAuthHeader } from './services/authService.ts'
import { Toaster } from 'react-hot-toast'

initializeAuthHeader(); // Important : avant tout

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <RootLayout>
          <App />
          <Toaster position="top-right" reverseOrder={false} />
        </RootLayout>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
