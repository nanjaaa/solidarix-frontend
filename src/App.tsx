import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HelpRequestPage from './pages/HelpRequestPage'
import FeedPage from './pages/FeedPage'
import MessagesPage from './pages/MessagesPage'
import { useAuth } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import { PrivateRoute } from './pages/PrivateRoute'

function App() {
  const { isAuthenticated, isAuthReady } = useAuth();

  // Attente que l'état d'auth soit chargé pour éviter le "flash"
  if (!isAuthReady) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <span className="text-gray-500 text-sm">Chargement...</span>
      </div>
    );
  }

  return (
    <Routes>
      
      {/* Redirection intelligente selon l'état de connexion */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/feed" replace /> : <Navigate to="/landing" replace />
        }
      />

      <Route path="/landing" element={<LandingPage />} />

      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/feed" replace /> : <LoginPage />}
      />

      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/feed" replace /> : <RegisterPage />}
      />

      {/* Routes protégées */}
      <Route path="/ask-help" element={<PrivateRoute><HelpRequestPage /></PrivateRoute>} />
      <Route path="/feed" element={<PrivateRoute><FeedPage /></PrivateRoute>} />
      <Route path="/discussions" element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
    </Routes>
  );
}

export default App;