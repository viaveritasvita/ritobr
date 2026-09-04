/* ============================================================================
   AppsScript-agenda-ics.gs   (v2 — robusto + modo de teste)
   Gera um .ics AO VIVO a partir da aba de programação da planilha do Google,
   para a ASSINATURA no Google Agenda refletir a planilha automaticamente.

   COMO ATUALIZAR (primeira instalação neste projeto: pule para o passo 1 de LANCAMENTO.md):
   1) Abra a planilha → Extensões → Apps Script.
   2) Apague TODO o código e cole este arquivo inteiro. Salve (disquete).
   3) Implantar → Gerenciar implantações → clique no LÁPIS (editar) da
      implantação existente → Versão: "Nova versão" → Implantar.
      (Isso mantém a MESMA URL /exec que já está no site.)
   4) Teste: abra no navegador a sua URL /exec com  ?debug=1  no final, ex.:
      .../exec?debug=1
      Deve mostrar: nome da aba, colunas, e "Eventos válidos: 13".
      Se mostrar 13, remova o ?debug e a assinatura já vai popular.

   Deixe as colunas data/inicio/fim como TEXTO SIMPLES na planilha
   (Formatar → Número → Texto simples) — é o mais seguro.
   ============================================================================ */

var LOCS = {
  acqua:    'Recanto Acqua Park, Estrada D, Lote 51, 5884 – Gleba Sorriso, Sorriso – MT, 78890-000',
  viola:    'Recanto da Viola, Estrada D, Lote 51 – Gleba Sorriso, Sorriso – MT, 78898-899',
  templo:   'Templo da ARLS Acácia de Sorriso nº 2442, Rua José Rocha dos Santos Filho, 191 – Centro, Sorriso – MT, 78890-000',
  bluetree: 'Hotel Blue Tree Towers Sorriso, Avenida Blumenau Sul, 2235 – Bela Vista, Sorriso – MT, 78890-001'
};

var TZ = 'America/Cuiaba'; // Sorriso – MT (UTC-4, sem horário de verão). A planilha deve estar neste fuso.

function doGet(e) {
  var debug = e && e.parameter && e.parameter.debug;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  TZ = ss.getSpreadsheetTimeZone() || TZ;

  var sh = findSheet_(ss);
  if (!sh) return txt_('ERRO: nenhuma aba encontrada.');

  var values = sh.getDataRange().getValues();
  if (values.length < 2) return txt_('ERRO: aba "' + sh.getName() + '" tem menos de 2 linhas.');

  var header = values.shift().map(function (h) { return String(h).trim().toLowerCase(); });
  var col = {};
  header.forEach(function (h, i) { if (h) col[h] = i; });

  var events = [];
  values.forEach(function (row) {
    var id = str(get(row, col, 'id'));
    var dateStr = normDate(get(row, col, 'data'));
    var ini = normTime(get(row, col, 'inicio'));
    if (!id || !dateStr || !ini) return;

    var fim = normTime(get(row, col, 'fim'));
    var start = localToUTC(dateStr, ini);
    var end = fim ? localToUTC(dateStr, fim) : addHours(start, 1);
    events.push({
      id: id, start: start, end: end,
      title: str(get(row, col, 'titulo_pt')) || 'Sessão',
      location: LOCS[str(get(row, col, 'local'))] || '',
      restr: str(get(row, col, 'restricao_pt')),
      nota: str(get(row, col, 'nota_pt'))
    });
  });

  if (debug) {
    var d = [];
    d.push('Aba usada: ' + sh.getName());
    d.push('Fuso: ' + TZ);
    d.push('Colunas: ' + header.join(' | '));
    d.push('Linhas de dados: ' + values.length);
    d.push('Eventos válidos: ' + events.length);
    if (events[0]) d.push('1º evento: ' + events[0].title + '  DTSTART=' + toIcsUTC(events[0].start));
    return txt_(d.join('\n'));
  }

  var out = [];
  out.push('BEGIN:VCALENDAR');
  out.push('VERSION:2.0');
  out.push('PRODID:-//Rito Brasileiro Sorriso 2026//Programa Oficial//PT');
  out.push('CALSCALE:GREGORIAN');
  out.push('METHOD:PUBLISH');
  out.push('X-WR-CALNAME:Programa Oficial — Rito Brasileiro · Sorriso 2026');
  out.push('X-WR-TIMEZONE:America/Cuiaba');
  var stamp = toIcsUTC(new Date());

  events.forEach(function (ev) {
    var desc = [];
    if (ev.restr) desc.push('Restrição: ' + ev.restr);
    if (ev.nota) desc.push(ev.nota);
    desc.push('https://viaveritasvita.github.io/ritobr/');
    out.push('BEGIN:VEVENT');
    out.push('UID:' + ev.id + '@ritobr');
    out.push('DTSTAMP:' + stamp);
    out.push('DTSTART:' + toIcsUTC(ev.start));
    out.push('DTEND:' + toIcsUTC(ev.end));
    out.push(fold('SUMMARY:' + esc(ev.title)));
    if (ev.location) out.push(fold('LOCATION:' + esc(ev.location)));
    out.push(fold('DESCRIPTION:' + esc(desc.join('\\n'))));
    out.push('END:VEVENT');
  });
  out.push('END:VCALENDAR');

  return ContentService.createTextOutput(out.join('\r\n'))
    .setMimeType(ContentService.MimeType.ICAL);
}

/* ---------- localizar a aba certa (por nome OU pelas colunas) ---------- */
function findSheet_(ss) {
  var names = ['Programação', 'Programacao', 'programação', 'programacao', 'Programaçao', 'PROGRAMAÇÃO'];
  for (var i = 0; i < names.length; i++) {
    var s = ss.getSheetByName(names[i]);
    if (s) return s;
  }
  var sheets = ss.getSheets();
  for (var j = 0; j < sheets.length; j++) {
    var lc = sheets[j].getLastColumn() || 1;
    var hdr = sheets[j].getRange(1, 1, 1, lc).getValues()[0]
      .map(function (h) { return String(h).trim().toLowerCase(); });
    if (hdr.indexOf('titulo_pt') >= 0 || (hdr.indexOf('id') >= 0 && hdr.indexOf('data') >= 0)) return sheets[j];
  }
  return sheets[0] || null;
}

/* ---------- helpers ---------- */
function get(row, col, name) { return (name in col) ? row[col[name]] : ''; }
function str(v) {
  // remove **negrito** e marca itens "- " como "• " (formatação usada no site)
  if (v != null) v = String(v).replace(/\*\*/g, '').replace(/^- /mg, '• '); return (v === null || v === undefined) ? '' : String(v).trim(); }
function pad(n) { n = Number(n); return (n < 10 ? '0' : '') + n; }

function normDate(v) {
  if (v instanceof Date) return Utilities.formatDate(v, TZ, 'yyyy-MM-dd');
  var s = String(v).trim();
  var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return m[1] + '-' + pad(m[2]) + '-' + pad(m[3]);
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (m) return m[3] + '-' + pad(m[2]) + '-' + pad(m[1]);
  return '';
}
function normTime(v) {
  if (v === '' || v === null || v === undefined) return '';
  if (v instanceof Date) return Utilities.formatDate(v, TZ, 'HH:mm');
  var m = String(v).trim().match(/^(\d{1,2}):(\d{2})/);
  return m ? pad(m[1]) + ':' + m[2] : '';
}
function localToUTC(dateStr, hhmm) {
  var d = dateStr.split('-'), t = hhmm.split(':');
  return new Date(Date.UTC(+d[0], +d[1] - 1, +d[2], +t[0] + 4, +t[1], 0)); // -04:00 (Sorriso – MT) -> UTC
}
function addHours(dt, n) { return new Date(dt.getTime() + n * 3600000); }
function toIcsUTC(dt) {
  return dt.getUTCFullYear() + pad(dt.getUTCMonth() + 1) + pad(dt.getUTCDate())
    + 'T' + pad(dt.getUTCHours()) + pad(dt.getUTCMinutes()) + pad(dt.getUTCSeconds()) + 'Z';
}
function esc(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
}
function fold(line) {
  if (line.length <= 73) return line;
  var parts = [], i = 0;
  while (i < line.length) { parts.push((i === 0 ? '' : ' ') + line.substr(i, i === 0 ? 73 : 72)); i += (i === 0 ? 73 : 72); }
  return parts.join('\r\n');
}
function txt_(s) { return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.TEXT); }
