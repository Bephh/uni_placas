import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref, set, serverTimestamp } from 'firebase/database'
import { FirebaseError } from 'firebase/app'
import { auth, db } from '../Firebase/firebase'
import { useAuth } from '../contexts/AuthContextMemoria'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import '../css/cadastro.css'

function mensagemDeErro(error: unknown): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Este e-mail já está cadastrado.'
      case 'auth/invalid-email':
        return 'E-mail inválido.'
      case 'auth/weak-password':
        return 'A senha precisa ter pelo menos 6 caracteres.'
      case 'auth/operation-not-allowed':
        return 'Cadastro por e-mail/senha não está habilitado no Firebase.'
      case 'auth/network-request-failed':
        return 'Falha de conexão. Verifique sua internet e tente novamente.'
    }
  }
  return 'Não foi possível concluir o cadastro. Tente novamente.'
}

function Cadastro() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (enviando) return

    setErro('')
    setEnviando(true)

    try {
      const credencial = await createUserWithEmailAndPassword(auth, email.trim(), senha)
      const user = credencial.user

      await updateProfile(user, { displayName: nome.trim() })

      try {
        await set(ref(db, `usuarios/${user.uid}/dados`), {
          nome: nome.trim(),
          cpf: cpf.trim(),
          email: email.trim(),
          telefone: telefone.trim(),
          criadoEm: serverTimestamp(),
        })
      } catch (dbError) {
        console.warn('[cadastro] aviso: falha ao gravar dados complementares:', dbError)
      }

      login({ nome: nome.trim(), email: email.trim() })
      navigate('/', { replace: true })
    } catch (error) {
      console.error('[cadastro] erro:', error)
      setErro(mensagemDeErro(error))
      setEnviando(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="cadastro-page">
        <section className="cadastro-content">
          <h1>Criar conta</h1>
          <p className="cadastro-intro">Crie uma nova conta de usuário para gerenciar suas consultas.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="nome">Nome completo</label>
            <input id="nome" name="nome" type="text" required value={nome} onChange={(e) => setNome(e.target.value)} />

            <label htmlFor="cpf">CPF</label>
            <input id="cpf" name="cpf" type="text" inputMode="numeric" required value={cpf} onChange={(e) => setCpf(e.target.value)} />

            <label htmlFor="senha">Senha</label>
            <input id="senha" name="senha" type="password" required minLength={6} autoComplete="new-password" value={senha} onChange={(e) => setSenha(e.target.value)} />

            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label htmlFor="telefone">Número de telefone</label>
            <input id="telefone" name="tel_num" type="tel" required value={telefone} onChange={(e) => setTelefone(e.target.value)} />

            {erro && <p className="cadastro-erro" role="alert">{erro}</p>}

            <button type="submit" disabled={enviando}>
              {enviando ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Cadastro
