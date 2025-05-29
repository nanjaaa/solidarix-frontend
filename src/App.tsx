import './App.css'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HelpRequestPage from './pages/HelpRequestPage'

function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} /> 
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/ask-help" element={<HelpRequestPage />} />
    </Routes>
  )
}

export default App
