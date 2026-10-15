import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from '../Firebase/firebase'
import '../css/home.css'
import Footer from '../components/footer'
import fundo from '../Visual/video/fundo.mp4'

function Home() {
  // undefined = ainda verificando; null = deslogado; User = logado
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => onAuthStateChanged(auth, setUser), [])

  return (
    <main className="home-page">
      <header className="home-header">
        <a className="home-brand" href="/">
          <img
            className="cadastro-logo"
            src="src/visual/logo.jpeg"
            alt="Logo UniPlacas"
          />
        </a>

        <nav className="home-nav" aria-label="Navegação principal">
          <a href="#sobre">Sobre</a>
          <a href="#contato">Contato</a>
          {user === null && (
            <>
              <a href="/login">Login</a>
              <a href="/cadastro">Cadastro</a>
            </>
          )}
          {user && (
            <>
              <span className="home-user">{user.displayName || user.email}</span>
              <button type="button" className="home-logout" onClick={() => signOut(auth)}>
                Sair
              </button>
            </>
          )}
        </nav>
      </header>

      <section className="home-content" aria-labelledby="home-title">
        <p className="home-eyebrow">SERVIÇOS DE UTILIDADE PÚBLICA</p>
        <h1 id="home-title">
          Consulte e monitore placas de veículos em segundos
        </h1>

        <form
          className="home-search"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="sr-only" htmlFor="placa">
            Digite a placa do veículo
          </label>
          <input
            id="placa"
            name="placa"
            type="text"
            placeholder="Digite a placa do veículo"
          />
          <button type="submit">Consultar</button>
        </form>
      </section>
      
      <video className="home-video" autoPlay loop muted playsInline>
        <source src={fundo} type="video/mp4" />
        Seu navegador não suporta vídeos em HTML5.
      </video>

      <section className="home-services" aria-labelledby="services-title">
        <h1 id="services-title">Nossos serviços</h1>

        <article className="service-card">
          <img src="src/visual/consulta_rapida_corrigido.png" alt="Consulta Rápida" />
          <h2 className="consulta-rapida">Consulta Rápida</h2>
          <p className="consulta-rapida-text">
            Obtenha dados estruturados de qualquer veículo diretamente das bases
            de dados brasileiras atualizadas.
          </p>
        </article>

        <article className="service-card">
          <img src="src/visual/historico_completo_corrigido.png" alt="Histórico Completo" />
          <h2 className="historico-completo">Histórico Completo</h2>
          <p className="historico-completo-text">
            Monitore o histórico completo de qualquer veículo.
          </p>
        </article>

        <article className="service-card">
          <img src="src/visual/armazenamento_seguro_corrigido.png" alt="Armazenamento Seguro" />
          <h2 className="storage-seguro">Armazenamento Seguro</h2>
          <p className="storage-seguro-text">
            Guarde as placas consultadas e crie um portfólio digital blindado
            de histórico veicular.
          </p>
        </article>
      </section>

    <Footer />
    
    </main>
  )
}

export default Home