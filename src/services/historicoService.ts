import { get, ref, remove, set } from 'firebase/database'
import { auth, db } from '../Firebase/firebase'

export interface Consulta {
  id: string
  placa: string
  veiculo: string
  data: string
  situacao: string
}

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
    .sort((a, b) => b.data.localeCompare(a.data))
}

export async function salvarConsulta(consulta: Omit<Consulta, 'id'>): Promise<void> {
  await set(ref(db, `${caminhoHistorico()}/${consulta.placa}`), consulta)
}

export async function excluirConsulta(id: string): Promise<void> {
  await remove(ref(db, `${caminhoHistorico()}/${id}`))
}
