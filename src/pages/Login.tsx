import '../css/Login.css'
import { useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'

import Navbar from '../components/navbar'
import { auth } from '../Firebase/firebase'
import { useAuth } from '../contexts/AuthContextMemoria'

function mensagemDeErro(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'E-mail ou senha incorretos.'
      case 'auth/invalid-email':
        return 'E-mail inválido.'
      case 'auth/user-disabled':
        return 'Esta conta foi desativada.'
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Aguarde um pouco e tente novamente.'
      case 'auth/operation-not-allowed':
        return 'Login por e-mail/senha não está habilitado no Firebase.'
      case 'auth/network-request-failed':
        return 'Falha de conexão. Verifique sua internet e tente novamente.'
    }
  }
  return 'Não foi possível entrar. Tente novamente.'
}

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const destino = location.state?.from?.pathname ?? '/'

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleEntrar() {
    if (enviando) return

    if (!email || !senha) {
      setErro('Preencha e-mail e senha.')
      return
    }

    setErro('')
    setEnviando(true)
    try {
      const { user } = await signInWithEmailAndPassword(auth, email.trim(), senha)

      // Atualiza o contexto já aqui para a rota protegida não nos mandar de volta ao /login
      // antes do listener do Firebase responder.
      login({
        nome: user.displayName?.trim() || email.split('@')[0],
        email: user.email ?? email.trim(),
      })
      navigate(destino, { replace: true })
    } catch (error) {
      console.error('[login] erro:', error)
      setErro(mensagemDeErro(error))
      setEnviando(false)
    }
  }

  function handleEnter(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') handleEntrar()
  }

  return (
    <>
      <Navbar />
      <section id="login">
        <p className="login-tagline">
          Consulte e monitore<br />
          placas de veículos em<br />
          segundos.
        </p>

        <h1>Acesse sua conta</h1>
        <p>Insira seus dados para prosseguir com a consulta</p>

        <label className="login-label" htmlFor="email">E-mail cadastrado</label>
        <input
          className="login-input"
          id="email"
          type="text"
          placeholder="E-mail"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleEnter}
        />

        <label className="login-label" htmlFor="senha">Sua senha de acesso</label>
        <input
          className="login-input"
          id="senha"
          type="password"
          placeholder="Sua senha de acesso"
          autoComplete="current-password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          onKeyDown={handleEnter}
        />

        {erro && <p role="alert">{erro}</p>}

        <button type="button" className="btnLogin" onClick={handleEntrar} disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar no sistema'}
        </button>

        <p>Não tem uma conta?</p>
        <Link to="/cadastro">Clique aqui</Link>
      </section>
    </>
  )
}
