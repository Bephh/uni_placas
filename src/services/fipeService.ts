const BASE_URL = 'https://brasilapi.com.br/api/fipe/preco/v1'
const TENTATIVAS = 3
const TIMEOUT_MS = 10_000
const PREFIXO_CACHE = 'fipe:'

export interface PrecoFipe {
  valor: string
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
    // ignore
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
      if (signal?.aborted) throw erro
      ultimoErro = erro
    }
  }

  throw ultimoErro
}

export async function consultarPrecoFipe(
  codigoFipe: string,
  anoDesejado?: number,
  signal?: AbortSignal
): Promise<PrecoFipe | null> {
  const codigoLimpo = codigoFipe.replace(/\D/g, '')
  if (!codigoLimpo) return null

  const doCache = lerCache(codigoLimpo)
  const lista = doCache ?? await (async () => {
    const resposta = await buscarComRetry(`${BASE_URL}/${codigoLimpo}`, signal)
    if (!resposta.ok) return null
    const dados = (await resposta.json()) as PrecoFipe[]
    if (Array.isArray(dados) && dados.length > 0) {
      gravarCache(codigoLimpo, dados)
      return dados
    }
    return null
  })()

  if (!lista || lista.length === 0) return null

  if (anoDesejado) {
    const exato = lista.find((item) => item.anoModelo === anoDesejado)
    if (exato) return exato
  }

  return lista[0]
}
