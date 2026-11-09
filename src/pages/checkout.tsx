import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/navbar'
import Footer from '../components/footer'
import '../css/checkout.css'

function Checkout() {
  const { placa } = useParams<{ placa?: string }>()
  const navigate = useNavigate()
  const [copiado, setCopiado] = useState(false)

  const codigoPix = `00020126580014br.gov.bcb.pix0136uniplacas-relatorio-${placa?.toLowerCase() || 'veiculo'}52040000530398654012.505802BR5915UNIPLACAS LTDA6009SAO PAULO62070503***6304`

  function handleCopiar() {
    navigator.clipboard.writeText(codigoPix).then(() => {
      setCopiado(true)
      setTimeout(() => setCopiado(false), 3000)
    })
  }

  return (
    <>
      <NavBar />
      <main className="checkout-pagina">
        <header className="checkout-intro">
          <span className="checkout-etiqueta">Relatório Premium</span>
          <h1>Relatório Completo do Veículo</h1>
          <p className="checkout-subtitulo">
            {placa ? `Placa: ${placa.toUpperCase()}` : 'Consulta Detalhada'}
          </p>
        </header>

        <div className="checkout-card">
          <div className="checkout-preco-box">
            <p className="checkout-preco-label">Valor do relatório completo</p>
            <p className="checkout-preco-valor">R$ 12,50</p>
          </div>

          <div className="checkout-qr-container">
            <div className="checkout-qr-box">
              <svg width="180" height="180" viewBox="0 0 200 200" fill="none">
                <rect width="200" height="200" fill="white" />
                <rect x="20" y="20" width="50" height="50" fill="#005152" rx="6" />
                <rect x="30" y="30" width="30" height="30" fill="white" rx="4" />
                <rect x="38" y="38" width="14" height="14" fill="#005152" />
                <rect x="130" y="20" width="50" height="50" fill="#005152" rx="6" />
                <rect x="140" y="30" width="30" height="30" fill="white" rx="4" />
                <rect x="148" y="38" width="14" height="14" fill="#005152" />
                <rect x="20" y="130" width="50" height="50" fill="#005152" rx="6" />
                <rect x="30" y="140" width="30" height="30" fill="white" rx="4" />
                <rect x="38" y="148" width="14" height="14" fill="#005152" />
                <rect x="85" y="25" width="25" height="10" fill="#106263" />
                <rect x="85" y="45" width="15" height="25" fill="#106263" />
                <rect x="105" y="45" width="15" height="15" fill="#106263" />
                <rect x="25" y="85" width="20" height="15" fill="#106263" />
                <rect x="55" y="85" width="25" height="20" fill="#106263" />
                <rect x="90" y="85" width="20" height="20" fill="#106263" />
                <rect x="120" y="85" width="25" height="15" fill="#106263" />
                <rect x="155" y="85" width="20" height="25" fill="#106263" />
                <rect x="85" y="120" width="30" height="15" fill="#106263" />
                <rect x="125" y="110" width="20" height="30" fill="#106263" />
                <rect x="155" y="125" width="25" height="25" fill="#106263" />
                <rect x="85" y="150" width="25" height="25" fill="#106263" />
                <rect x="125" y="155" width="50" height="20" fill="#106263" />
              </svg>
            </div>
            <p className="checkout-qr-instrucao">
              Abra o app do seu banco e escaneie o QR Code acima
            </p>
          </div>

          <div className="checkout-copia-box">
            <label htmlFor="pix-input-checkout">Ou copie o código PIX:</label>
            <div className="checkout-input-grupo">
              <input
                id="pix-input-checkout"
                type="text"
                readOnly
                value={codigoPix}
              />
              <button
                type="button"
                className="btn-copiar-pix"
                onClick={handleCopiar}
              >
                {copiado ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          <div className="checkout-botoes">
            <button
              type="button"
              className="btn-checkout-principal"
              onClick={() => navigate(placa ? `/veiculo/${placa}` : '/')}
            >
              Já está pago - Acessar Relatório
            </button>
            <button
              type="button"
              className="btn-checkout-voltar"
              onClick={() => navigate(-1)}
            >
              Voltar
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Checkout
