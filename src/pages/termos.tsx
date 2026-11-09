import Navbar from '../components/navbar'
import Footer from '../components/footer'
import '../css/termosPriv.css'

function Termos() {
  return (
    <>
      <Navbar />
      <main className="termos-container">
        <h1>Termos de Uso e Política de Privacidade</h1>
        <section>
          <h2>1. Sobre a UniPlacas</h2>
          <p>
            A UniPlacas é uma plataforma desenvolvida para facilitar o acesso
            a informações veiculares, oferecendo consultas de placas,
            histórico de veículos e orientações sobre multas e débitos.
          </p>
          <p>
            Este site é um projeto acadêmico com finalidade educacional
            e demonstrativa.
          </p>
        </section>

        <section>
          <h2>2. Termos de Uso</h2>
          <p>
            Ao utilizar a UniPlacas, o usuário concorda em fazer uso
            responsável das funcionalidades disponibilizadas pela plataforma.
          </p>
          <p>
            O serviço destina-se a fins informativos, auxiliando na verificação
            da regularidade de veículos automotores.
          </p>
        </section>

        <section>
          <h2>3. Coleta e Uso de Dados</h2>
          <p>
            Para utilização de recursos personalizados, como o histórico de
            consultas, o usuário realiza cadastro informando nome, e-mail,
            CPF e telefone.
          </p>
          <p>
            Os dados coletados são utilizados exclusivamente para autenticação,
            identificação da conta e armazenamento do histórico pessoal de
            consultas do próprio usuário.
          </p>
        </section>

        <section>
          <h2>4. Privacidade e Segurança</h2>
          <p>
            A UniPlacas adota medidas técnicas e administrativas para proteger
            os dados pessoais cadastrados contra acessos não autorizados e
            situações acidentais ou ilícitas.
          </p>
          <p>
            Não compartilhamos, vendemos ou transferimos informações cadastrais
            ou histórico de consultas a terceiros para fins comerciais.
          </p>
        </section>

        <section>
          <h2>5. Direitos do Usuário</h2>
          <p>
            O usuário tem o direito de solicitar a exclusão de seu histórico
            de consultas ou encerramento de sua conta a qualquer momento por meio
            da própria plataforma.
          </p>
        </section>

        <section>
          <h2>6. Disposições Finais</h2>
          <p>
            A UniPlacas é um projeto acadêmico e não possui vínculo oficial
            com órgãos governamentais de trânsito.
          </p>
          <p>
            Suas funcionalidades são demonstrativas e podem sofrer
            alterações durante o desenvolvimento do projeto.
          </p>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default Termos
