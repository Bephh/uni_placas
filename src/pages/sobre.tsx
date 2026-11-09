import Navbar from '../components/navbar'
import Footer from '../components/footer'
import '../css/sobre.css'

function Sobre() {
  return (
    <>
      <Navbar />
      <main className="sobre-pagina">
        <header className="sobre-introducao">
          <span className="sobre-etiqueta">
            Tecnologia e orientação veicular
          </span>

          <h1>Sobre a UniPlacas</h1>

          <p>Sua segurança no trânsito começa aqui.</p>
        </header>

        <section className="sobre-apresentacao">
          <h2>Quem somos</h2>

          <p>
            A UniPlacas é um projeto acadêmico idealizado como uma
            startup de impacto social, voltada à consulta de informações
            veiculares e à orientação sobre débitos.
          </p>

          <p>
            Nossa proposta é simplificar o entendimento de pendências
            administrativas e financeiras, reunindo informações em uma
            plataforma intuitiva e de fácil navegação.
          </p>
        </section>

        <section className="sobre-valores">
          <h2>Nossos pilares</h2>

          <div className="sobre-cards">
            <article className="sobre-card">
              <h3>Transparência</h3>
              <p>
                Informações claras e acessíveis sobre situação veicular,
                multas e licenciamento.
              </p>
            </article>

            <article className="sobre-card">
              <h3>Simplicidade</h3>
              <p>
                Uma interface direta que elimina burocracias e
                facilita a consulta rápida.
              </p>
            </article>

            <article className="sobre-card">
              <h3>Segurança</h3>
              <p>
                Armazenamento protegido de dados e foco na
                privacidade do usuário.
              </p>
            </article>
          </div>
        </section>

        <aside className="sobre-aviso">
          <h2>Projeto acadêmico e demonstrativo</h2>

          <p>
            As consultas de veículos e CPFs utilizam dados fictícios.
            As orientações e propostas de parcelamento são simulações,
            sem realização de negociações ou pagamentos reais.
            A plataforma não substitui consultas aos órgãos oficiais
            de trânsito.
          </p>
        </aside>
      </main>
      <Footer />
    </>
  )
}

export default Sobre
