import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '../Firebase/firebase'

interface Usuario {
  nome: string
  email: string
}

interface AuthContextData {
  usuario: Usuario | null
  isAuthenticated: boolean
  carregando: boolean
  login: (usuario: Usuario) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

function paraUsuario(user: User): Usuario {
  const email = user.email ?? ''
  return {
    nome: user.displayName?.trim() || email.split('@')[0] || 'Usuário',
    email,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    localStorage.removeItem('usuario')

    return onAuthStateChanged(auth, (user) => {
      setUsuario(user ? paraUsuario(user) : null)
      setCarregando(false)
    })
  }, [])

  function login(usuario: Usuario) {
    setUsuario(usuario)
  }

  function logout() {
    signOut(auth).catch(() => {})
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, isAuthenticated: !!usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
