import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AdminPage from './pages/AdminPage.jsx'
import { PortfolioProvider } from './context/PortfolioContext'

function Root() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const isAdminRoute = currentPath.startsWith('/admin')

  return (
    <PortfolioProvider>
      {isAdminRoute ? <AdminPage /> : <App />}
    </PortfolioProvider>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
