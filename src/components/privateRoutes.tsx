import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContextMemoria'

function PrivateRoute() {
  const { isAuthenticated, carregando } = useAuth()
  const location = useLocation()

  if (carregando) return <p role="status">Carregando...</p>

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />
}

export default PrivateRoute
