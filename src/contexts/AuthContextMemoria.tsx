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
  // true enquanto o Firebase restaura a sessão (evita mandar para /login por engano ao recarregar a página)
  carregando: boolean
  // Define o usuário exibido (ex.: logo após login ou cadastro, sem esperar o listener do Firebase)
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
    // A fonte da verdade agora é o Firebase Auth; descarta o usuário que a versão antiga guardava aqui.
    localStorage.removeItem('usuario')

    // Mantém o estado sincronizado com a sessão real: persiste ao recarregar e some ao deslogar.
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
