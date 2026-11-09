import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { listarConsultas, excluirConsulta, type Consulta } from '../services/historicoService'
import '../css/historico.css'

function Historico() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')

  useEffect(() => {
    let cancelado = false

    async function carregar() {
      try {
        const lista = await listarConsultas()
        if (!cancelado) setConsultas(lista)
      } catch (err) {
        console.error('[historico] erro ao carregar:', err)
        if (!cancelado) setErro('Não foi possível carregar seu histórico. Tente novamente mais tarde.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregar()
    return () => {
      cancelado = true
    }
  }, [])

  async function handleExcluir(id: string) {
    const confirmar = window.confirm('Deseja realmente remover esta consulta do seu histórico?')
    if (!confirmar) return

    try {
      await excluirConsulta(id)
      setConsultas((atual) => atual.filter((c) => c.id !== id))
    } catch (err) {
      console.error('[historico] erro ao excluir:', err)
      setErro('Não foi possível excluir a consulta. Tente novamente.')
    }
  }

  const consultasFiltradas = consultas.filter((c) => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return true
    return (
      c.placa.toLowerCase().includes(termo) ||
      c.veiculo.toLowerCase().includes(termo)
    )
  })

  return (
    <>
      <Navbar />
      <main className="historico-pagina">
        <header className="historico-intro">
          <span className="historico-etiqueta">Consultas Salvas</span>
          <div className="historico-titulo-box">
            <div>
              <h1>Meu Histórico</h1>
              <p className="historico-subtitulo">
                Acesse novamente ou gerencie as consultas de placas realizadas na sua conta.
              </p>
            </div>
            {!carregando && (
              <span className="historico-contador">
                {consultas.length} {consultas.length === 1 ? 'consulta salva' : 'consultas salvas'}
              </span>
            )}
          </div>

          {consultas.length > 0 && (
            <div className="historico-controles">
              <div className="historico-busca-wrapper">
                <span className="historico-busca-icone">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="historico-busca-input"
                  placeholder="Filtrar por placa ou modelo do veículo..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                />
              </div>
            </div>
          )}
        </header>

        {carregando && (
          <div className="historico-status" role="status">
            Carregando seu histórico de consultas...
          </div>
        )}

        {erro && (
          <div className="historico-status alerta" role="alert">
            {erro}
          </div>
        )}

        {!carregando && !erro && consultas.length === 0 && (
          <div className="historico-vazio">
            <div className="historico-vazio-icone">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h2>Nenhuma consulta registrada</h2>
            <p>
              Você ainda não realizou consultas de veículos. Faça sua primeira pesquisa na página inicial para acompanhar multas, FIPE e débitos.
            </p>
            <Link to="/" className="btn-fazer-consulta">
              Fazer Primeira Consulta
            </Link>
          </div>
        )}

        {!carregando && !erro && consultas.length > 0 && consultasFiltradas.length === 0 && (
          <div className="historico-vazio">
            <h2>Nenhum resultado para "{busca}"</h2>
            <p>Tente buscar por outra placa ou modelo de veículo.</p>
            <button
              type="button"
              className="btn-fazer-consulta"
              onClick={() => setBusca('')}
            >
              Limpar busca
            </button>
          </div>
        )}

        {!carregando && !erro && consultasFiltradas.length > 0 && (
          <ul className="historico-lista">
            {consultasFiltradas.map((c) => {
              const situacaoOk = c.situacao?.toLowerCase().includes('em dia')
              return (
                <li key={c.id} className="historico-card">
                  <div className="historico-card-info">
                    <div className="placa-badge" aria-label={`Placa ${c.placa}`}>
                      <div className="placa-faixa-azul">BRASIL</div>
                      <div className="placa-texto">{c.placa}</div>
                    </div>

                    <div className="historico-detalhes">
                      <h3>{c.veiculo}</h3>
                      <div className="historico-meta">
                        <span className="historico-data">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          Consultado em {new Date(c.data).toLocaleDateString('pt-BR')}
                        </span>

                        {c.situacao && (
                          <span className={`badge-situacao ${situacaoOk ? 'ok' : 'atrasado'}`}>
                            {c.situacao}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="historico-acoes">
                    <Link to={`/veiculo/${c.placa}`} className="btn-ver-consulta">
                      Ver Ficha
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                    <button
                      type="button"
                      className="btn-excluir-consulta"
                      onClick={() => handleExcluir(c.id)}
                      title="Excluir do histórico"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                      Excluir
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </main>
      <Footer />
    </>
  )
}

export default Historico
