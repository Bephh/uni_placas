import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { listarConsultas, excluirConsulta, type Consulta } from '../services/historicoService'

function Historico() {
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

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
    try {
      await excluirConsulta(id)
      setConsultas((atual) => atual.filter((c) => c.id !== id))
    } catch (err) {
      console.error('[historico] erro ao excluir:', err)
      setErro('Não foi possível excluir a consulta. Tente novamente.')
    }
  }

  return (
    <>
      <Navbar />
      <main>
        <h1>Meu histórico</h1>

        {carregando && <p role="status">Carregando histórico...</p>}
        {erro && <p role="alert">{erro}</p>}
        {!carregando && !erro && consultas.length === 0 && <p>Nenhuma consulta ainda.</p>}

        <ul>
          {consultas.map((c) => (
            <li key={c.id}>
              {c.placa} - {c.veiculo} ({new Date(c.data).toLocaleDateString('pt-BR')})
              <Link to={`/veiculo/${c.placa}`}>Ver</Link>
              <button type="button" onClick={() => handleExcluir(c.id)}>Excluir</button>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  )
}

export default Historico
