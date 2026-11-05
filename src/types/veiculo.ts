export interface Multa {
  descricao: string
  data: string
  valor: number
  situacao: 'Em aberto' | 'Paga'
}

export interface Veiculo {
  placa: string
  marca: string
  modelo: string
  ano: number
  cor: string
  renavam: string
  chassi: string
  codigoFipe: string
  licenciamento: 'Em dia' | 'Atrasado'
  multas: Multa[]
}

export interface ConsultaHistorico {
  id: string
  placa: string
  veiculo: string
  data: string
  situacao: string
}
