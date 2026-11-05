// Integração com a BrasilAPI (gratuita): preço de veículos pela tabela FIPE.
// Documentação: https://brasilapi.com.br/docs#tag/FIPE
const BASE_URL = 'https://brasilapi.com.br/api/fipe/preco/v1'
const TENTATIVAS = 3
const TIMEOUT_MS = 10_000
const PREFIXO_CACHE = 'fipe:'

export interface PrecoFipe {
  valor: string // ex.: "R$ 113.958,00"
  marca: string
  modelo: string
  anoModelo: number
  combustivel: string
  codigoFipe: string
  mesReferencia: string
  tipoVeiculo: number
  siglaCombustivel: string
  dataConsulta: string
}

// Cache da sessão: a mesma consulta não bate de novo na BrasilAPI (que fica instável com frequência).
function lerCache(codigoFipe: string): PrecoFipe[] | null {
  try {
    const salvo = sessionStorage.getItem(PREFIXO_CACHE + codigoFipe)
    return salvo ? (JSON.parse(salvo) as PrecoFipe[]) : null
  } catch {
    return null
  }
}

function gravarCache(codigoFipe: string, lista: PrecoFipe[]) {
  try {
    sessionStorage.setItem(PREFIXO_CACHE + codigoFipe, JSON.stringify(lista))
  } catch {
    // storage cheio ou indisponível: segue sem cache
  }
}

function esperar(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason)
      return
    }
    const onAbort = () => {
      clearTimeout(timer)
      reject(signal?.reason)
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    signal?.addEventListener('abort', onAbort, { once: true })
  })
}

// Tenta de novo (500ms, 1s...) quando a API devolve 5xx/429 ou quando há timeout/falha de rede.
// 404 e outros 4xx são respostas definitivas e não são repetidos.
async function buscarComRetry(url: string, signal?: AbortSignal): Promise<Response> {
  let ultimoErro: unknown = new Error('Falha ao consultar a BrasilAPI')

  for (let tentativa = 0; tentativa < TENTATIVAS; tentativa++) {
    if (tentativa > 0) await esperar(500 * 2 ** (tentativa - 1), signal)

    const timeout = AbortSignal.timeout(TIMEOUT_MS)
    const sinal = signal ? AbortSignal.any([signal, timeout]) : timeout

    try {
      const resposta = await fetch(url, { signal: sinal })
      if (resposta.ok || resposta.status === 404) return resposta

      ultimoErro = new Error(`BrasilAPI respondeu com status ${resposta.status}`)
      if (resposta.status < 500 && resposta.status !== 429) break
    } catch (erro) {
      if (signal?.aborted) throw erro // cancelado por quem chamou: não insiste
      ultimoErro = erro
    }
  }

  throw ultimoErro
}

/**
 * Consulta o preço FIPE de um veículo pelo código FIPE (ex.: "002111-3").
 * A API devolve uma lista (um item por ano-modelo/combustível); aqui
 * retornamos o item do ano pedido, ou null se não existir.
 */
export async function consultarPrecoFipe(
  codigoFipe: string,
  anoModelo: number,
  signal?: AbortSignal,
): Promise<PrecoFipe | null> {
  let lista = lerCache(codigoFipe)

  if (!lista) {
    const resposta = await buscarComRetry(`${BASE_URL}/${encodeURIComponent(codigoFipe)}`, signal)
    if (resposta.status === 404) return null

    lista = (await resposta.json()) as PrecoFipe[]
    gravarCache(codigoFipe, lista)
  }

  return lista.find((item) => item.anoModelo === anoModelo) ?? null
}
