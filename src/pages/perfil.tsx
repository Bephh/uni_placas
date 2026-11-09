import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { auth } from '../Firebase/firebase'
import { useAuth } from '../contexts/AuthContextMemoria'
import '../css/perfil.css'

export default function Perfil() {
  const { usuario, logout, login } = useAuth()
  const navigate = useNavigate()

  const [nome, setNome] = useState(usuario?.nome || '')
  const [salvandoNome, setSalvandoNome] = useState(false)
  const [msgNome, setMsgNome] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)

  const [enviandoReset, setEnviandoReset] = useState(false)
  const [msgSenha, setMsgSenha] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)

  async function handleSalvarNome(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) {
      setMsgNome({ tipo: 'erro', texto: 'Por favor, informe seu nome.' })
      return
    }

    setSalvandoNome(true)
    setMsgNome(null)

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: nome.trim() })
        login({
          nome: nome.trim(),
          email: usuario?.email || '',
        })
        setMsgNome({ tipo: 'sucesso', texto: 'Nome atualizado com sucesso!' })
      }
    } catch (err) {
      console.error('[perfil] erro ao atualizar nome:', err)
      setMsgNome({ tipo: 'erro', texto: 'Não foi possível atualizar o nome. Tente novamente.' })
    } finally {
      setSalvandoNome(false)
    }
  }

  async function handleEnviarResetSenha() {
    if (!usuario?.email) return

    setEnviandoReset(true)
    setMsgSenha(null)

    try {
      await sendPasswordResetEmail(auth, usuario.email)
      setMsgSenha({
        tipo: 'sucesso',
        texto: `E-mail de redefinição de senha enviado para ${usuario.email}. Verifique sua caixa de entrada.`,
      })
    } catch (err) {
      console.error('[perfil] erro ao enviar reset de senha:', err)
      setMsgSenha({
        tipo: 'erro',
        texto: 'Não foi possível enviar o e-mail de redefinição. Tente novamente mais tarde.',
      })
    } finally {
      setEnviandoReset(false)
    }
  }

  function handleSair() {
    logout()
    navigate('/')
  }

  const iniciais = (usuario?.nome || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')

  return (
    <>
      <Navbar />
      <main className="perfil-pagina">
        <header className="perfil-intro">
          <span className="perfil-etiqueta">Minha Conta</span>
          <h1>Configurações do Perfil</h1>
          <p className="perfil-subtitulo">
            Gerencie suas informações cadastrais, segurança da conta e preferências.
          </p>
        </header>

        <div className="perfil-grid">
          <section className="perfil-card">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Dados Pessoais
            </h2>

            <div className="perfil-usuario-topo">
              <div className="perfil-avatar">{iniciais || 'U'}</div>
              <div className="perfil-usuario-info">
                <h3>{usuario?.nome || 'Usuário'}</h3>
                <p>{usuario?.email || 'E-mail não informado'}</p>
              </div>
            </div>

            <form className="perfil-form" onSubmit={handleSalvarNome}>
              {msgNome && (
                <div className={`perfil-msg ${msgNome.tipo}`} role="status">
                  {msgNome.texto}
                </div>
              )}

              <div className="perfil-grupo">
                <label htmlFor="perfil-nome">Nome de exibição</label>
                <input
                  id="perfil-nome"
                  type="text"
                  className="perfil-input"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div className="perfil-grupo">
                <label htmlFor="perfil-email">E-mail cadastrado</label>
                <input
                  id="perfil-email"
                  type="email"
                  className="perfil-input"
                  value={usuario?.email || ''}
                  disabled
                />
                <p className="perfil-dica">O e-mail é vinculado à sua autenticação no Firebase.</p>
              </div>

              <button
                type="submit"
                className="btn-perfil"
                disabled={salvandoNome}
              >
                {salvandoNome ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </form>
          </section>

          <section className="perfil-card">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Segurança e Senha
            </h2>
            <p style={{ color: '#547374', fontSize: '14px', margin: '0 0 16px' }}>
              Deseja alterar sua senha de acesso? Enviaremos um link de redefinição seguro para o seu e-mail.
            </p>

            {msgSenha && (
              <div className={`perfil-msg ${msgSenha.tipo}`} role="status" style={{ marginBottom: '16px' }}>
                {msgSenha.texto}
              </div>
            )}

            <button
              type="button"
              className="btn-perfil btn-perfil-secundario"
              onClick={handleEnviarResetSenha}
              disabled={enviandoReset}
            >
              {enviandoReset ? 'Enviando e-mail...' : 'Enviar Link de Redefinição de Senha'}
            </button>
          </section>

          <section className="perfil-card">
            <h2>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Ações Rápidas
            </h2>
            <div className="perfil-acoes-box">
              <Link to="/historico" className="btn-perfil btn-perfil-secundario">
                Ver Histórico de Consultas
              </Link>
              <button type="button" className="btn-sair-perfil" onClick={handleSair}>
                Encerrar Sessão
              </button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
