import { get, ref, remove, set } from 'firebase/database'
import { auth, db } from '../Firebase/firebase'

export interface Consulta {
  id: string // igual à placa: há uma entrada por placa, atualizada a cada nova consulta
  placa: string
  veiculo: string
  data: string // ISO
  situacao: string
}

// O histórico fica em usuarios/{uid}/historico (cada usuário só enxerga o próprio — ver database.rules.json)
function caminhoHistorico(): string {
  const uid = auth.currentUser?.uid
  if (!uid) throw new Error('Usuário não autenticado.')
  return `usuarios/${uid}/historico`
}

export async function listarConsultas(): Promise<Consulta[]> {
  const snapshot = await get(ref(db, caminhoHistorico()))
  if (!snapshot.exists()) return []

  const dados = snapshot.val() as Record<string, Omit<Consulta, 'id'>>
  return Object.entries(dados)
    .map(([id, consulta]) => ({ id, ...consulta }))
    .sort((a, b) => b.data.localeCompare(a.data)) // mais recentes primeiro
}

export async function salvarConsulta(consulta: Omit<Consulta, 'id'>): Promise<void> {
  await set(ref(db, `${caminhoHistorico()}/${consulta.placa}`), consulta)
}

export async function excluirConsulta(id: string): Promise<void> {
  await remove(ref(db, `${caminhoHistorico()}/${id}`))
}
