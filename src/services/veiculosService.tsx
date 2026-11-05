import type { Multa, Veiculo } from '../types/veiculo';

type ModeloBase = {
  marca: string;
  modelo: string;
  codigoFipe: string;
  anos: number[];
};

const modelos: ModeloBase[] = [
  // Fiat
  { marca: 'Fiat', modelo: 'Argo Drive 1.0', codigoFipe: '001469-9', anos: [2018, 2023] },
  { marca: 'Fiat', modelo: 'Mobi Like 1.0 Fire', codigoFipe: '001461-3', anos: [2017, 2024] },
  { marca: 'Fiat', modelo: 'Mobi Trekking 1.0', codigoFipe: '001511-3', anos: [2021, 2024] },
  { marca: 'Fiat', modelo: 'Strada Freedom 1.3 CS', codigoFipe: '001504-0', anos: [2021, 2024] },
  { marca: 'Fiat', modelo: 'Strada Volcano 1.3 CD', codigoFipe: '001507-5', anos: [2021, 2024] },
  { marca: 'Fiat', modelo: 'Toro Volcano 2.0 Diesel 4x4', codigoFipe: '001466-4', anos: [2017, 2024] },
  { marca: 'Fiat', modelo: 'Toro Freedom 1.8 Flex', codigoFipe: '001465-6', anos: [2017, 2021] },
  { marca: 'Fiat', modelo: 'Pulse Audace 1.0 Turbo', codigoFipe: '001525-3', anos: [2022, 2024] },
  { marca: 'Fiat', modelo: 'Pulse Impetus 1.0 Turbo', codigoFipe: '001526-1', anos: [2022, 2024] },
  { marca: 'Fiat', modelo: 'Fastback Audace 1.0 Turbo', codigoFipe: '001538-5', anos: [2023, 2024] },
  { marca: 'Fiat', modelo: 'Fastback Limited Edition 1.3 Turbo', codigoFipe: '001540-7', anos: [2023, 2024] },
  { marca: 'Fiat', modelo: 'Uno Way 1.0', codigoFipe: '001267-0', anos: [2010, 2021] },
  { marca: 'Fiat', modelo: 'Palio Fire 1.0', codigoFipe: '001263-7', anos: [2001, 2017] },
  { marca: 'Fiat', modelo: 'Cronos Drive 1.3', codigoFipe: '001483-4', anos: [2018, 2024] },

  // Volkswagen
  { marca: 'Volkswagen', modelo: 'Polo Track 1.0 Flex', codigoFipe: '005527-1', anos: [2023, 2024] },
  { marca: 'Volkswagen', modelo: 'Gol 1.0 Flex', codigoFipe: '005471-2', anos: [2013, 2023] },
  { marca: 'Volkswagen', modelo: 'Nivus Highline 1.0 TSI', codigoFipe: '005505-0', anos: [2021, 2024] },
  { marca: 'Volkswagen', modelo: 'Nivus Comfortline 1.0 TSI', codigoFipe: '005504-2', anos: [2021, 2024] },
  { marca: 'Volkswagen', modelo: 'T-Cross Highline 1.4 TSI', codigoFipe: '005494-1', anos: [2020, 2024] },
  { marca: 'Volkswagen', modelo: 'T-Cross Comfortline 1.0 TSI', codigoFipe: '005493-3', anos: [2020, 2024] },
  { marca: 'Volkswagen', modelo: 'Taos Highline 1.4 TSI', codigoFipe: '005511-5', anos: [2022, 2024] },
  { marca: 'Volkswagen', modelo: 'Virtus Highline 1.0 TSI', codigoFipe: '005479-8', anos: [2018, 2024] },
  { marca: 'Volkswagen', modelo: 'Jetta GLI 2.0 TSI', codigoFipe: '005489-5', anos: [2019, 2024] },
  { marca: 'Volkswagen', modelo: 'Saveiro Cross 1.6 MSI', codigoFipe: '005367-8', anos: [2015, 2024] },
  { marca: 'Volkswagen', modelo: 'Amarok Highline 2.0 TDI', codigoFipe: '005315-5', anos: [2011, 2020] },
  { marca: 'Volkswagen', modelo: 'Amarok V6 Extreme', codigoFipe: '005481-0', anos: [2018, 2024] },
  { marca: 'Volkswagen', modelo: 'Fox Connect 1.6', codigoFipe: '005483-6', anos: [2018, 2022] },
  { marca: 'Volkswagen', modelo: 'Up! move 1.0 TSI', codigoFipe: '005456-9', anos: [2016, 2021] },

  // Chevrolet
  { marca: 'Chevrolet', modelo: 'Onix 1.0 Turbo', codigoFipe: '004506-3', anos: [2020, 2024] },
  { marca: 'Chevrolet', modelo: 'Onix Plus 1.0 Turbo LTZ', codigoFipe: '004509-8', anos: [2020, 2024] },
  { marca: 'Chevrolet', modelo: 'Onix Plus 1.0 Turbo Premier', codigoFipe: '004510-1', anos: [2020, 2024] },
  { marca: 'Chevrolet', modelo: 'Tracker 1.0 Turbo LTZ', codigoFipe: '004515-2', anos: [2021, 2024] },
  { marca: 'Chevrolet', modelo: 'Tracker 1.2 Turbo Premier', codigoFipe: '004517-9', anos: [2021, 2024] },
  { marca: 'Chevrolet', modelo: 'Spin Activ 1.8 7L', codigoFipe: '004457-1', anos: [2015, 2024] },
  { marca: 'Chevrolet', modelo: 'Cruze LTZ 1.4 Turbo', codigoFipe: '004473-3', anos: [2017, 2024] },
  { marca: 'Chevrolet', modelo: 'Cruze Sport6 RS 1.4 Turbo', codigoFipe: '004523-3', anos: [2022, 2024] },
  { marca: 'Chevrolet', modelo: 'S10 High Country 2.8 Diesel 4x4', codigoFipe: '004463-6', anos: [2016, 2024] },
  { marca: 'Chevrolet', modelo: 'S10 LTZ 2.8 Diesel 4x4', codigoFipe: '004419-9', anos: [2013, 2024] },
  { marca: 'Chevrolet', modelo: 'Montana Premier 1.2 Turbo', codigoFipe: '004533-0', anos: [2023, 2024] },
  { marca: 'Chevrolet', modelo: 'Equinox Premier 1.5 Turbo', codigoFipe: '004505-5', anos: [2020, 2024] },
  { marca: 'Chevrolet', modelo: 'Celta LT 1.0', codigoFipe: '004383-4', anos: [2012, 2016] },
  { marca: 'Chevrolet', modelo: 'Prisma LT 1.4', codigoFipe: '004423-7', anos: [2013, 2019] },

  // Hyundai
  { marca: 'Hyundai', modelo: 'HB20 Sense 1.0', codigoFipe: '015175-0', anos: [2020, 2024] },
  { marca: 'Hyundai', modelo: 'HB20 Platinum Plus 1.0 TGDI', codigoFipe: '015181-4', anos: [2023, 2024] },
  { marca: 'Hyundai', modelo: 'HB20S Comfort 1.0 TGDI', codigoFipe: '015185-7', anos: [2023, 2024] },
  { marca: 'Hyundai', modelo: 'Creta Action 1.6', codigoFipe: '015170-9', anos: [2020, 2024] },
  { marca: 'Hyundai', modelo: 'Creta Platinum 1.0 TGDI', codigoFipe: '015190-3', anos: [2022, 2024] },
  { marca: 'Hyundai', modelo: 'Creta Ultimate 2.0', codigoFipe: '015192-0', anos: [2022, 2024] },
  { marca: 'Hyundai', modelo: 'Tucson GLS 1.6 Turbo', codigoFipe: '015132-6', anos: [2017, 2022] },
  { marca: 'Hyundai', modelo: 'Santa Fe 3.5 V6 4x4', codigoFipe: '015124-5', anos: [2011, 2020] },

  // Toyota
  { marca: 'Toyota', modelo: 'Corolla XEI 2.0 Flex', codigoFipe: '002111-3', anos: [2010, 2024] },
  { marca: 'Toyota', modelo: 'Corolla Altis Hybrid 1.8', codigoFipe: '002187-3', anos: [2020, 2024] },
  { marca: 'Toyota', modelo: 'Corolla Cross XRE 2.0', codigoFipe: '002196-2', anos: [2022, 2024] },
  { marca: 'Toyota', modelo: 'Corolla Cross XRV Hybrid 1.8', codigoFipe: '002197-0', anos: [2022, 2024] },
  { marca: 'Toyota', modelo: 'Yaris Hatch XS 1.5', codigoFipe: '002175-0', anos: [2019, 2024] },
  { marca: 'Toyota', modelo: 'Yaris Sedan XLS 1.5', codigoFipe: '002178-4', anos: [2019, 2024] },
  { marca: 'Toyota', modelo: 'Hilux SRV 2.8 Diesel 4x4', codigoFipe: '002157-1', anos: [2016, 2024] },
  { marca: 'Toyota', modelo: 'Hilux SRX 2.8 Diesel 4x4', codigoFipe: '002158-0', anos: [2016, 2024] },
  { marca: 'Toyota', modelo: 'SW4 SRX 2.8 Diesel 4x4 7L', codigoFipe: '002161-0', anos: [2016, 2024] },
  { marca: 'Toyota', modelo: 'Etios Hatch XLS 1.5', codigoFipe: '002127-0', anos: [2013, 2021] },

  // Honda
  { marca: 'Honda', modelo: 'HR-V EXL 1.5', codigoFipe: '014106-1', anos: [2023, 2024] },
  { marca: 'Honda', modelo: 'HR-V Touring 1.5 Turbo', codigoFipe: '014108-8', anos: [2023, 2024] },
  { marca: 'Honda', modelo: 'Civic EXL 2.0', codigoFipe: '014088-0', anos: [2017, 2021] },
  { marca: 'Honda', modelo: 'Civic Touring 1.5 Turbo', codigoFipe: '014089-8', anos: [2017, 2021] },
  { marca: 'Honda', modelo: 'City Sedan EXL 1.5', codigoFipe: '014095-2', anos: [2015, 2024] },
  { marca: 'Honda', modelo: 'City Hatchback Touring 1.5', codigoFipe: '014104-5', anos: [2022, 2024] },
  { marca: 'Honda', modelo: 'Fit EXL 1.5', codigoFipe: '014080-4', anos: [2015, 2021] },
  { marca: 'Honda', modelo: 'CR-V Touring 1.5 Turbo 4x4', codigoFipe: '014092-8', anos: [2018, 2022] },

  // Jeep
  { marca: 'Jeep', modelo: 'Renegade Sport 1.3 Turbo', codigoFipe: '017081-9', anos: [2022, 2024] },
  { marca: 'Jeep', modelo: 'Renegade Longitude 1.3 Turbo', codigoFipe: '017082-7', anos: [2022, 2024] },
  { marca: 'Jeep', modelo: 'Compass Longitude 1.3 Turbo', codigoFipe: '017075-4', anos: [2022, 2024] },
  { marca: 'Jeep', modelo: 'Compass Limited 2.0 Diesel 4x4', codigoFipe: '017042-8', anos: [2017, 2024] },
  { marca: 'Jeep', modelo: 'Commander Limited 1.3 Turbo', codigoFipe: '017078-9', anos: [2022, 2024] },
  { marca: 'Jeep', modelo: 'Commander Overland 2.0 Diesel 4x4', codigoFipe: '017080-0', anos: [2022, 2024] },

  // Renault
  { marca: 'Renault', modelo: 'Kwid Zen 1.0', codigoFipe: '025272-6', anos: [2018, 2024] },
  { marca: 'Renault', modelo: 'Kwid Outsider 1.0', codigoFipe: '025287-4', anos: [2020, 2024] },
  { marca: 'Renault', modelo: 'Sandero Stepway 1.6', codigoFipe: '025217-3', anos: [2015, 2023] },
  { marca: 'Renault', modelo: 'Logan Zen 1.0', codigoFipe: '025285-8', anos: [2020, 2024] },
  { marca: 'Renault', modelo: 'Duster Iconic 1.3 Turbo', codigoFipe: '025301-3', anos: [2022, 2024] },
  { marca: 'Renault', modelo: 'Captur Iconic 1.3 Turbo', codigoFipe: '025298-0', anos: [2022, 2024] },
  { marca: 'Renault', modelo: 'Oroch Outsider 1.3 Turbo', codigoFipe: '025304-8', anos: [2023, 2024] },

  // Nissan
  { marca: 'Nissan', modelo: 'Kicks Advance 1.6', codigoFipe: '023168-0', anos: [2022, 2024] },
  { marca: 'Nissan', modelo: 'Kicks Exclusive 1.6', codigoFipe: '023169-9', anos: [2022, 2024] },
  { marca: 'Nissan', modelo: 'Versa Advance 1.6', codigoFipe: '023165-6', anos: [2021, 2024] },
  { marca: 'Nissan', modelo: 'Frontier Attack 2.3 Diesel 4x4', codigoFipe: '023157-5', anos: [2019, 2024] },
  { marca: 'Nissan', modelo: 'Frontier PRO-4X 2.3 Diesel 4x4', codigoFipe: '023173-7', anos: [2023, 2024] },

  // Ford
  { marca: 'Ford', modelo: 'Ka SE 1.0', codigoFipe: '003417-7', anos: [2015, 2021] },
  { marca: 'Ford', modelo: 'Ka Sedan SE 1.5', codigoFipe: '003423-1', anos: [2015, 2021] },
  { marca: 'Ford', modelo: 'EcoSport Titanium 1.5', codigoFipe: '003444-4', anos: [2018, 2021] },
  { marca: 'Ford', modelo: 'Ranger XLT 3.2 Diesel 4x4', codigoFipe: '003362-6', anos: [2013, 2023] },
  { marca: 'Ford', modelo: 'Ranger Limited 3.0 V6 Diesel 4x4', codigoFipe: '003487-8', anos: [2024, 2024] },
  { marca: 'Ford', modelo: 'Maverick Lariat 2.0 Turbo 4x4', codigoFipe: '003478-9', anos: [2022, 2024] },
  { marca: 'Ford', modelo: 'Territory Titanium 1.5 Turbo', codigoFipe: '003468-1', anos: [2021, 2024] },
  { marca: 'Ford', modelo: 'Bronco Sport Wildtrak 2.0', codigoFipe: '003470-3', anos: [2021, 2024] },

  // Peugeot
  { marca: 'Peugeot', modelo: '208 Active 1.6', codigoFipe: '024227-5', anos: [2021, 2024] },
  { marca: 'Peugeot', modelo: '208 Griffe 1.6', codigoFipe: '024229-1', anos: [2021, 2024] },
  { marca: 'Peugeot', modelo: '208 Style 1.0', codigoFipe: '024240-2', anos: [2023, 2024] },
  { marca: 'Peugeot', modelo: '2008 Griffe 1.6 THP', codigoFipe: '024209-7', anos: [2016, 2024] },

  // Citroën
  { marca: 'Citroën', modelo: 'C3 Feel 1.0', codigoFipe: '011210-0', anos: [2023, 2024] },
  { marca: 'Citroën', modelo: 'C4 Cactus Shine 1.6 THP', codigoFipe: '011195-2', anos: [2019, 2024] },
  { marca: 'Citroën', modelo: 'C3 Aircross Shine 1.0 Turbo', codigoFipe: '011218-5', anos: [2024, 2024] },

  // Caoa Chery
  { marca: 'Caoa Chery', modelo: 'Tiggo 5x Pro 1.5 Turbo', codigoFipe: '073024-5', anos: [2022, 2024] },
  { marca: 'Caoa Chery', modelo: 'Tiggo 7 Pro 1.6 Turbo', codigoFipe: '073025-3', anos: [2022, 2024] },
  { marca: 'Caoa Chery', modelo: 'Tiggo 8 1.6 Turbo', codigoFipe: '073021-0', anos: [2021, 2024] },

  // Mitsubishi
  { marca: 'Mitsubishi', modelo: 'L200 Triton Sport HPE-S 2.4 Diesel', codigoFipe: '022168-5', anos: [2021, 2024] },
  { marca: 'Mitsubishi', modelo: 'Eclipse Cross HPE-S 1.5 Turbo', codigoFipe: '022159-6', anos: [2019, 2024] },
  { marca: 'Mitsubishi', modelo: 'Pajero Sport HPE 2.4 Diesel', codigoFipe: '022162-6', anos: [2020, 2024] }
];

const cores = ['Branco', 'Preto', 'Prata', 'Cinza', 'Vermelho', 'Azul'];
const descricoesMultas = [
  'Transitar em velocidade superior à máxima permitida em até 20%',
  'Avançar o sinal vermelho do semáforo',
  'Estacionar em local proibido',
  'Dirigir manuseando telefone celular',
  'Transitar em faixa exclusiva de ônibus',
  'Deixar de usar o cinto de segurança',
  'Conduzir o veículo com validade de CNH vencida'
];

export async function consultarVeiculo(placa: string): Promise<Veiculo | null> {
  // Padronizar placa (maiúsculas e sem hifens)
  const placaLimpa = placa.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

  // Validar formato (Padrão Antigo: ABC1234, Padrão Mercosul: ABC1D23)
  const regexPlaca = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/;
  if (!regexPlaca.test(placaLimpa)) {
    return null;
  }

  // Simular delay de resposta do servidor
  await new Promise(resolve => setTimeout(resolve, 800));

  // Gerar um número pseudoaleatório "amarrado" à placa
  // Isso garante que a mesma placa sempre retorne o mesmo veículo na nossa simulação
  let seed = 0;
  for (let i = 0; i < placaLimpa.length; i++) {
    seed += placaLimpa.charCodeAt(i) * (i + 1);
  }

  // Pegar os dados baseados na seed
  const modeloSelecionado = modelos[seed % modelos.length];
  const corSelecionada = cores[seed % cores.length];

  // Calcular um ano dentro da janela de fabricação daquele modelo
  const anoMin = modeloSelecionado.anos[0];
  const anoMax = modeloSelecionado.anos[1];
  const ano = anoMin + (seed % (anoMax - anoMin + 1));

  // Gerar números fictícios de Chassi e Renavam consistentes com a placa
  const chassi = '9BW' + (seed * 2).toString(16).toUpperCase().padStart(4, '0') + 'XX' + (seed * 123).toString().padStart(8, '0');
  const renavam = (seed * 98765).toString().padStart(11, '0');

  // Alguns veículos estarão com documento atrasado para testes (1 a cada 4)
  const licenciamento = seed % 4 === 0 ? 'Atrasado' : 'Em dia';

  // Gerar multas aleatórias (de 0 a 3 multas)
  const qtdMultas = seed % 4;
  const multas: Multa[] = [];

  for (let i = 0; i < qtdMultas; i++) {
    const indexMulta = (seed + i) % descricoesMultas.length;
    multas.push({
      descricao: descricoesMultas[indexMulta],
      data: new Date(2023, (seed % 12), (seed % 28) + 1).toISOString(),
      valor: 130.16 * ((seed % 3) + 1), // Valores variados
      situacao: i % 2 === 0 ? 'Em aberto' : 'Paga'
    });
  }

  return {
    placa: placaLimpa,
    marca: modeloSelecionado.marca,
    modelo: modeloSelecionado.modelo,
    ano: ano,
    cor: corSelecionada,
    chassi: chassi,
    renavam: renavam,
    codigoFipe: modeloSelecionado.codigoFipe,
    licenciamento: licenciamento,
    multas: multas
  };
}