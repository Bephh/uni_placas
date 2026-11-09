import { useState } from 'react';
import type { Multa } from '../types/veiculo';
import '../css/planosPagamento.css';

interface PlanosPagamentoProps {
  placa: string;
  multas: Multa[];
  licenciamento: 'Em dia' | 'Atrasado';
  onPagamentoConcluido?: () => void;
}

export default function PlanosPagamento({
  placa,
  multas,
  licenciamento,
  onPagamentoConcluido
}: PlanosPagamentoProps) {
  const [modalAberto, setModalAberto] = useState<'pix' | 'cartao' | 'boleto' | null>(null);
  const [parcelaSelecionada, setParcelaSelecionada] = useState<number>(12);
  const [copiado, setCopiado] = useState(false);
  const [pagoComSucesso, setPagoComSucesso] = useState(false);
  const [processando, setProcessando] = useState(false);

  const multasAbertas = multas.filter((m) => m.situacao === 'Em aberto');
  const valorMultas = multasAbertas.reduce((acc, m) => acc + m.valor, 0);
  const valorLicenciamento = licenciamento === 'Atrasado' ? 165.40 : 0;
  const totalDebitos = valorMultas + valorLicenciamento;

  const valorPix = totalDebitos * 0.95;

  const calcularOpcaoParcela = (numParcelas: number) => {
    if (numParcelas === 1) {
      return {
        parcelas: 1,
        valorParcela: totalDebitos,
        totalFinal: totalDebitos,
        semJuros: true,
      };
    }
    const taxaTotal = 1 + (numParcelas * 0.019);
    const totalComTaxa = totalDebitos * taxaTotal;
    const valorParcela = totalComTaxa / numParcelas;
    return {
      parcelas: numParcelas,
      valorParcela,
      totalFinal: totalComTaxa,
      semJuros: false,
    };
  };

  const opcoesParcelas = Array.from({ length: 12 }, (_, i) => calcularOpcaoParcela(i + 1));
  const opcaoAtual = opcoesParcelas[parcelaSelecionada - 1] || opcoesParcelas[11];

  const codigoPixCopiaCola = `00020126580014br.gov.bcb.pix0136uniplacas-${placa.toLowerCase()}-debitos520400005303986540${valorPix.toFixed(2)}5802BR5915UNIPLACAS LTDA6009SAO PAULO62070503***6304`;
  const linhaDigitavelBoleto = `34191.79001 01043.510047 91020.150008 5 ${Math.floor(totalDebitos * 100)}`;

  function handleCopiarPix() {
    navigator.clipboard.writeText(codigoPixCopiaCola).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    });
  }

  function handleConfirmarPagamento() {
    setProcessando(true);
    setTimeout(() => {
      setProcessando(false);
      setPagoComSucesso(true);
      if (onPagamentoConcluido) {
        onPagamentoConcluido();
      }
    }, 1200);
  }

  function fecharModal() {
    setModalAberto(null);
    setPagoComSucesso(false);
    setCopiado(false);
  }

  return (
    <section className="planos-section" aria-labelledby="planos-titulo">
      <div className="planos-header">
        <div className="planos-header-titulo">
          <h2 id="planos-titulo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="10" y1="10" x2="22" y2="10" />
            </svg>
            Planos de Regularização e Parcelamento
          </h2>
          <p>Facilite o pagamento de multas e licenciamento em até 12x no cartão ou com desconto no PIX.</p>
        </div>

        <div className={`total-dividas-badge ${totalDebitos === 0 ? 'sem-dividas' : ''}`}>
          <span className="total-dividas-label">
            {totalDebitos === 0 ? 'Situação' : 'Total de Débitos Pendentes'}
          </span>
          <span className="total-dividas-valor">
            {totalDebitos === 0 ? 'Sem Débitos' : `R$ ${totalDebitos.toFixed(2).replace('.', ',')}`}
          </span>
        </div>
      </div>

      {totalDebitos > 0 && (
        <div className="detalhes-debitos">
          <div className="detalhes-item">
            <span>Multas em aberto:</span>
            <strong>{multasAbertas.length} ({`R$ ${valorMultas.toFixed(2).replace('.', ',')}`})</strong>
          </div>
          {licenciamento === 'Atrasado' && (
            <div className="detalhes-item">
              <span>Licenciamento pendente:</span>
              <strong>{`R$ ${valorLicenciamento.toFixed(2).replace('.', ',')}`}</strong>
            </div>
          )}
          <div className="detalhes-item">
            <span>Veículo:</span>
            <strong>Placa {placa}</strong>
          </div>
        </div>
      )}

      {totalDebitos === 0 ? (
        <div className="info-content" style={{ padding: '20px 0' }}>
          <p style={{ color: '#176b5b', fontSize: '16px', fontWeight: 600 }}>
            Este veículo não possui multas em aberto nem pendências no licenciamento.
          </p>
          <p style={{ color: '#547374' }}>
            Não há débitos a serem quitados ou parcelados no momento.
          </p>
        </div>
      ) : (
        <>
          <div className="planos-grid">
            <div className="plano-card">
              <div className="plano-topo">
                <div className="plano-icone">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <h3>PIX à Vista</h3>
                <p>Baixa mais rápida e economia imediata</p>
              </div>

              <div className="plano-valores">
                <p className="plano-valor-principal">
                  R$ {valorPix.toFixed(2).replace('.', ',')}
                </p>
                <span className="plano-desconto-badge">5% de desconto</span>
                <p className="plano-valor-sub">
                  Economize R$ {(totalDebitos - valorPix).toFixed(2).replace('.', ',')}
                </p>
              </div>

              <button
                type="button"
                className="btn-plano btn-plano-secundario"
                onClick={() => setModalAberto('pix')}
              >
                Pagar com PIX
              </button>
            </div>

            <div className="plano-card destaque">
              <span className="plano-tag-destaque">Mais Escolhido</span>
              <div className="plano-topo">
                <div className="plano-icone">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                    <line x1="1" y1="10" x2="23" y2="10" />
                  </svg>
                </div>
                <h3>Cartão de Crédito</h3>
                <p>Parcele em até 12x e libere o veículo</p>
              </div>

              <div className="plano-valores">
                <p className="plano-valor-principal">
                  {opcaoAtual.parcelas}x de R$ {opcaoAtual.valorParcela.toFixed(2).replace('.', ',')}
                </p>
                <p className="plano-valor-sub">
                  Total parcelado: R$ {opcaoAtual.totalFinal.toFixed(2).replace('.', ',')}
                </p>

                <div className="parcelas-seletor">
                  <label htmlFor="num-parcelas">Simule as parcelas:</label>
                  <select
                    id="num-parcelas"
                    value={parcelaSelecionada}
                    onChange={(e) => setParcelaSelecionada(Number(e.target.value))}
                  >
                    {opcoesParcelas.map((opt) => (
                      <option key={opt.parcelas} value={opt.parcelas}>
                        {opt.parcelas}x de R$ {opt.valorParcela.toFixed(2).replace('.', ',')}
                        {opt.semJuros ? ' (sem juros)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                className="btn-plano"
                onClick={() => setModalAberto('cartao')}
              >
                Parcelar em {opcaoAtual.parcelas}x
              </button>
            </div>

            <div className="plano-card">
              <div className="plano-topo">
                <div className="plano-icone">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <h3>Boleto Bancário</h3>
                <p>Pagamento integral com vencimento em 3 dias</p>
              </div>

              <div className="plano-valores">
                <p className="plano-valor-principal">
                  R$ {totalDebitos.toFixed(2).replace('.', ',')}
                </p>
                <p className="plano-valor-sub">Sem taxa adicional</p>
              </div>

              <button
                type="button"
                className="btn-plano btn-plano-secundario"
                onClick={() => setModalAberto('boleto')}
              >
                Gerar Boleto
              </button>
            </div>
          </div>

          <div className="planos-vantagens">
            <div className="vantagens-lista">
              <div className="vantagem-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Pagamento Seguro</span>
              </div>
              <div className="vantagem-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>Baixa rápida junto aos órgãos de trânsito</span>
              </div>
              <div className="vantagem-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
                <span>Aceita até 2 cartões</span>
              </div>
            </div>
            <span>Certificado SSL 256-bit</span>
          </div>
        </>
      )}

      {modalAberto && (
        <div className="pagamento-modal-backdrop" onClick={fecharModal}>
          <div className="pagamento-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="modal-fechar" onClick={fecharModal} aria-label="Fechar">
              &times;
            </button>

            {pagoComSucesso ? (
              <div className="pagamento-sucesso">
                <div className="sucesso-icone">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3>Pagamento Confirmado!</h3>
                <p>
                  A solicitação de regularização dos débitos da placa <strong>{placa}</strong> foi processada com sucesso.
                </p>
                <button type="button" className="btn-plano" onClick={fecharModal}>
                  Concluir e Voltar
                </button>
              </div>
            ) : modalAberto === 'pix' ? (
              <div className="pix-container">
                <h3 className="modal-titulo">Pagamento via PIX com Desconto</h3>
                <p className="modal-subtitulo">
                  Valor com 5% OFF: <strong>R$ {valorPix.toFixed(2).replace('.', ',')}</strong>
                </p>

                <div className="pix-qr-box">
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

                <div className="pix-copia-cola-box">
                  <label htmlFor="pix-input">Código PIX Copia e Cola:</label>
                  <div className="pix-input-group">
                    <input
                      id="pix-input"
                      type="text"
                      readOnly
                      value={codigoPixCopiaCola}
                    />
                    <button
                      type="button"
                      className="btn-copiar"
                      onClick={handleCopiarPix}
                    >
                      {copiado ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-plano"
                  onClick={handleConfirmarPagamento}
                  disabled={processando}
                >
                  {processando ? 'Processando confirmação...' : 'Já fiz o pagamento'}
                </button>
              </div>
            ) : modalAberto === 'cartao' ? (
              <form
                className="cartao-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleConfirmarPagamento();
                }}
              >
                <h3 className="modal-titulo">Parcelamento no Cartão</h3>
                <p className="modal-subtitulo">
                  Plano: <strong>{opcaoAtual.parcelas}x de R$ {opcaoAtual.valorParcela.toFixed(2).replace('.', ',')}</strong> (Total: R$ {opcaoAtual.totalFinal.toFixed(2).replace('.', ',')})
                </p>

                <div className="form-grupo">
                  <label htmlFor="cartao-num">Número do Cartão:</label>
                  <input
                    id="cartao-num"
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    required
                  />
                </div>

                <div className="form-grupo">
                  <label htmlFor="cartao-nome">Nome impresso no Cartão:</label>
                  <input
                    id="cartao-nome"
                    type="text"
                    placeholder="Ex: JOAO DA SILVA"
                    required
                  />
                </div>

                <div className="form-linha-dupla">
                  <div className="form-grupo">
                    <label htmlFor="cartao-val">Validade:</label>
                    <input
                      id="cartao-val"
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="form-grupo">
                    <label htmlFor="cartao-cvv">CVV:</label>
                    <input
                      id="cartao-cvv"
                      type="text"
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn-plano"
                  disabled={processando}
                >
                  {processando ? 'Autorizando...' : `Confirmar Pagamento (${opcaoAtual.parcelas}x)`}
                </button>
              </form>
            ) : (
              <div className="pix-container">
                <h3 className="modal-titulo">Boleto Bancário</h3>
                <p className="modal-subtitulo">
                  Valor à vista: <strong>R$ {totalDebitos.toFixed(2).replace('.', ',')}</strong>
                </p>

                <div className="pix-copia-cola-box">
                  <label htmlFor="boleto-input">Linha digitável do Boleto:</label>
                  <div className="pix-input-group">
                    <input
                      id="boleto-input"
                      type="text"
                      readOnly
                      value={linhaDigitavelBoleto}
                    />
                    <button
                      type="button"
                      className="btn-copiar"
                      onClick={() => {
                        navigator.clipboard.writeText(linhaDigitavelBoleto);
                        setCopiado(true);
                        setTimeout(() => setCopiado(false), 3000);
                      }}
                    >
                      {copiado ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '12px', color: '#6d7d7d', margin: '8px 0' }}>
                  O boleto tem vencimento para 3 dias úteis. A baixa do débito ocorre em até 48h úteis após a compensação.
                </p>

                <button
                  type="button"
                  className="btn-plano"
                  onClick={handleConfirmarPagamento}
                  disabled={processando}
                >
                  {processando ? 'Gerando comprovante...' : 'Simular Baixa de Boleto'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
