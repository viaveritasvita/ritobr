/* ============================================================
   data.js — IDENTIDADE E CONTEÚDO DO EVENTO
   Rito Brasileiro · Sorriso – MT · 4 e 5 de setembro de 2026

   Este arquivo é a cópia EMBUTIDA da programação (reserva).
   Quando as URLs da planilha em SITE_CONFIG estiverem preenchidas,
   o site passa a ler a planilha do Google ao vivo e só usa este
   SCHEDULE se a planilha falhar. Ver COMO-EDITAR.md.

   ATENÇÃO: repositório público — nunca coloque aqui link de convite
   de WhatsApp, telefone pessoal ou senha.
   ============================================================ */

const SITE_CONFIG = {
  siteUrl: 'https://viaveritasvita.github.io/ritobr/',
  shortUrl: 'https://viaveritasvita.github.io/ritobr/', // trocar pelo encurtador do QR quando existir

  /* Planilha do Google publicada em CSV (uma URL por aba).
     Enquanto começar com COLE_, o site ignora e usa os dados embutidos. */
  sheetProgramacaoCsvUrl: 'COLE_AQUI_A_URL_CSV_DA_ABA_PROGRAMACAO',
  sheetAvisosCsvUrl: 'COLE_AQUI_A_URL_CSV_DA_ABA_AVISOS',

  /* Feed .ics ao vivo (Apps Script → Implantar → URL /exec).
     Vazio = assinatura do Google Agenda usa o assets/agenda-ritobr.ics estático. */
  icsFeedUrl: '',

  /* OneSignal (push) — opcional; vazio = botão "Receber avisos" fica oculto */
  oneSignalAppId: '',
};

const EVENT_INFO = {
  bodies: 'Supremo Conclave do Rito Brasileiro',
  city: 'Sorriso – MT',
  /* Sorriso (MT) não tem horário de verão: UTC-4 o ano inteiro */
  tz: 'America/Cuiaba',
  utcOffset: '-04:00',
  officialStart: '2026-09-04',
  openingISO: '2026-09-04T19:00:00-04:00',
  secretariatEmail: 'grandesecretaria@scrb33.org.br',
  /* Sem telefone de emergência neste evento (botão oculto no index.html) */
  emergencyTel: '',
  emergencyDisplay: '',
};

/* ---------- LOCAIS (chave = valor da coluna "local" na planilha) ----------
   coords = "lat,lng" copiado da URL do Google Maps (armadilha nº 1). */
const LOCATIONS = {
  acqua: {
    name: 'Recanto Acqua Park',
    detail: 'Salão de eventos · anexo ao Recanto da Viola',
    address: 'Estrada D, Lote 51, 5884 – Gleba Sorriso, Sorriso – MT, 78890-000',
    coords: '-12.5074521,-55.7257856',
  },
  viola: {
    name: 'Recanto da Viola',
    detail: 'Restaurante e área de lazer · mesmo complexo do Acqua Park',
    address: 'Estrada D, Lote 51 – Gleba Sorriso, Sorriso – MT, 78898-899',
    coords: '-12.5074521,-55.7257856',
  },
  templo: {
    name: 'Templo da ARLS Acácia de Sorriso nº 2442',
    detail: 'Sessões magnas de transmissão dos graus',
    address: 'Rua José Rocha dos Santos Filho, 191 – Centro, Sorriso – MT, 78890-000',
    coords: '-12.5709319,-55.7407904',
  },
  bluetree: {
    name: 'Hotel Blue Tree Towers Sorriso',
    detail: 'Sala de eventos',
    address: 'Avenida Blumenau Sul, 2235 – Bela Vista, Sorriso – MT, 78890-001',
    coords: '-12.549222,-55.728585',
  },
};

/* ---------- CORPOS / GRAUS (chave = valor da coluna "rito" na planilha) ----------
   Define a cor do cartão e o selo acima do título.
   "geral" (sem selo) e "log" (logística: refeições) são reservados pelo motor. */
const BODIES = {
  delegacia: { label: 'Delegacia Litúrgica', color: '#581828' },
  capitulo:  { label: 'Graus 4 ao 18 · Capítulo', color: '#8a6828' },
  altos:     { label: 'Graus 19 ao 33 · Conselho · Colégio · Concílio', color: '#1f3b5a' },
  cerimonia: { label: 'Altos Corpos · Cerimônia pública', color: '#2e5c47' },
  cunhadas:  { label: 'Cunhadas e sobrinhos', color: '#c4407a' },
  geral:     { label: '', color: '#7a6a5a' },
  log:       { label: '', color: '#9a8f82' },
};

/* ---------- PROGRAMAÇÃO ----------
   start/end em HH:MM (hora local). end vazio = horário aberto.
   kind: meal | coffee | social | transfer | hotel | pickup (ícone).
   restriction = tarja âmbar; note = observação neutra.
   Os textos ficam em {pt} porque o motor lê s.t.pt / s.note.pt. */
const SCHEDULE = [
  {
    date: '2026-09-04',
    weekday: 'fri',
    official: true,
    sessions: [
      {
        id: 'd4-1', start: '19:00', end: null, loc: 'viola', body: 'geral', kind: 'social',
        t: { pt: 'Chegada e recepção' },
        note: { pt: 'Irmãos, cunhadas e sobrinhos podem chegar a partir das 19h. Cada irmão recebe uma comanda individual; cada participante paga o próprio consumo. Traje: informal.' },
      },
      {
        id: 'd4-2', start: '20:00', end: '22:00', loc: 'acqua', body: 'delegacia',
        t: { pt: 'Reunião Administrativa dos Fundadores' },
        note: { pt: 'Oriente de Sorriso. Pauta: eleição da Diretoria, assinatura da ata de fundação, deliberações administrativas e demais assuntos.' },
      },
      {
        id: 'd4-3', start: '20:00', end: '22:00', loc: 'viola', body: 'cunhadas', kind: 'social',
        t: { pt: 'Recepção das cunhadas e sobrinhos' },
        note: { pt: 'Enquanto os irmãos estiverem em reunião: petiscos, bebidas e confraternização, brinquedos infláveis e cuidadoras para as crianças.' },
      },
      {
        id: 'd4-4', start: '22:00', end: null, loc: 'viola', body: 'log', kind: 'meal',
        t: { pt: 'Jantar por adesão' },
        note: { pt: 'R$ 50 por adulto.' },
      },
    ],
  },
  {
    date: '2026-09-05',
    weekday: 'sat',
    official: true,
    sessions: [
      {
        id: 'd5-1', start: '06:30', end: '07:30', loc: 'templo', body: 'geral',
        t: { pt: 'Credenciamento e chegada ao Templo' },
        note: { pt: 'Traje maçônico, gravata bordô. Avental de Mestre ou de Mestre Instalado, conforme orientação individual.' },
      },
      {
        id: 'd5-2', start: '07:30', end: '12:30', loc: 'templo', body: 'capitulo',
        t: { pt: 'Sessão Magna de Transmissão · Graus 4 ao 18' },
        restriction: { pt: 'Início pontual às 7h30 — irmão que chegar atrasado ficará de fora. Participação obrigatória dos 102 irmãos, inclusive os já reconhecidos nos Graus 19 a 33.' },
      },
      {
        id: 'd5-3', start: '12:30', end: '13:30', loc: 'templo', body: 'log', kind: 'meal',
        t: { pt: 'Almoço dos irmãos dos Graus 19 ao 33' },
        note: { pt: 'R$ 50. Servido no próprio Templo, pelo intervalo de apenas uma hora.' },
      },
      {
        id: 'd5-4', start: '12:30', end: null, loc: 'viola', body: 'capitulo', kind: 'meal',
        t: { pt: 'Liberação dos irmãos dos Graus 4 ao 18 · tarde livre' },
        note: { pt: 'Almoço com cunhadas e sobrinhos onde preferirem. O Recanto da Viola disponibiliza almoço para quem desejar (R$ 50).' },
      },
      {
        id: 'd5-5', start: '13:30', end: '19:30', loc: 'templo', body: 'altos',
        t: { pt: 'Sessão Magna de Transmissão · Graus 19 ao 33' },
        note: { pt: 'Liberação conforme o grau atingido: quem recebe até o Grau 30 é liberado após a sua transmissão; quem recebe o Grau 33 permanece até cerca de 19h30. Irmãos já reconhecidos no Grau 33 permanecem durante toda a sessão.' },
      },
      {
        id: 'd5-6', start: '18:00', end: '19:30', loc: 'bluetree', body: 'cunhadas', kind: 'coffee',
        t: { pt: 'Chá das Cunhadas · palestra “Saúde da Mulher”' },
        note: { pt: 'Palestra com médica e professora da UFMT. Espaço Kids com cuidadoras durante a palestra. Ao final, seguir para o Recanto Acqua Park.' },
      },
      {
        id: 'd5-7', start: '19:45', end: null, loc: 'acqua', body: 'cunhadas', kind: 'social',
        t: { pt: 'Recepção das cunhadas e sobrinhos' },
        note: { pt: 'Espaço Kids, brinquedos infláveis e cuidadoras.' },
      },
      {
        id: 'd5-8', start: '20:00', end: '22:00', loc: 'acqua', body: 'cerimonia',
        t: { pt: 'Cerimônia Pública de Fundação dos Altos Corpos da Região Centro-Norte' },
        note: { pt: 'Posse dos Presidentes dos Altos Corpos · reimplantação da 2ª Delegacia Litúrgica de Mato Grosso (Sinop) · homenagens a dignidades e autoridades. Trajes — irmãos: maçônico, paramentados, com a comenda do último grau recebido; cunhadas: social.' },
      },
      {
        id: 'd5-9', start: '22:00', end: null, loc: 'acqua', body: 'log', kind: 'meal',
        t: { pt: 'Jantar de encerramento por adesão' },
        note: { pt: 'R$ 150 com open bar · R$ 120 sem open bar · infantil (10 a 15 anos) R$ 100.' },
      },
    ],
  },
];
