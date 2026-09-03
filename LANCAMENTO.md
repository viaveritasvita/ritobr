# Lançamento — passo a passo (na ordem)

Site: `https://viaveritasvita.github.io/ritobr/` · Evento: 4 e 5 de setembro de 2026 · Sorriso – MT

A ordem abaixo coloca o site **no ar primeiro** (com a programação embutida no
`data.js`) e liga a planilha depois. Se a planilha atrasar, o site já funciona.

---

## PARTE 1 — GitHub (site no ar) · ~10 min

**1.** Entre em github.com com a conta `viaveritasvita` → botão **New** (repositório novo).

**2.** Preencha: *Repository name* = `ritobr` · **Public** · **NÃO** marque "Add a README" → **Create repository**.

**3.** Na página do repositório vazio, clique no link **"uploading an existing file"**.

**4.** Abra a pasta `Rito Brasileiro/site/` no Explorer, selecione **TUDO que está dentro dela**
(os arquivos soltos **e** as pastas `assets/` e `planilha/`) e **arraste** para a área
de upload do navegador. *Arraste — não use "choose your files", que ignora pastas
(senão o brasão dá 404).* Confira na lista se aparecem `assets/brasao.png` e
`assets/agenda-ritobr.ics`.

**5.** Role até o fim → **Commit changes**.

**6.** No repositório: **Settings → Pages** → em *Build and deployment*, *Source* =
**Deploy from a branch** → *Branch* = **main** / **/(root)** → **Save**.

**7.** Aguarde 1–3 min e abra `https://viaveritasvita.github.io/ritobr/`.
Se der 404, espere mais um minuto e recarregue.

**8.** Teste no celular: abrir o link, tocar em **Instalar app**, abrir um local no mapa,
tocar em **Agenda (.ics)**. Pronto — o site está no ar com a grade embutida.

---

## PARTE 2 — Google Sheets (edição sem código) · ~10 min

**9.** Entre em sheets.google.com → planilha nova → nome **"Rito Brasileiro — Programação"**.

**10.** **Arquivo → Configurações → Fuso horário = (GMT-04:00) Cuiabá** → Salvar.
*(Sorriso é UTC-4; se ficar em São Paulo, o feed de agenda sai 1 h errado.)*

**11.** **Arquivo → Importar → Fazer upload** → escolha `site/planilha/programacao.csv`
→ *Local de importação* = **Substituir planilha atual** → Importar dados.
Renomeie a aba (canto inferior) para **Programação**.

**12.** **Arquivo → Importar → Fazer upload** → `site/planilha/avisos.csv` →
**Inserir novas páginas** → Importar. Renomeie a aba nova para **Avisos**.

**13.** Na aba Programação, selecione as colunas **B, C e D** (`data`, `inicio`, `fim`) →
**Formatar → Número → Texto simples**. Confira se os horários continuam `19:00`, `07:30` etc.

**14.** **Arquivo → Compartilhar → Publicar na web** → 1º seletor = **Programação**,
2º seletor = **Valores separados por vírgula (.csv)** → **Publicar** → copie a URL.
Guarde como **URL-A**.

**15.** No mesmo diálogo, troque o 1º seletor para **Avisos** (mantenha .csv) → copie a
URL. Guarde como **URL-B**. Feche o diálogo.

---

## PARTE 3 — Ligar a planilha ao site · ~3 min

**16.** No GitHub, abra `data.js` → ícone do **lápis** (Edit) → no topo, em `SITE_CONFIG`:
- troque `'COLE_AQUI_A_URL_CSV_DA_ABA_PROGRAMACAO'` por `'URL-A'` (entre aspas);
- troque `'COLE_AQUI_A_URL_CSV_DA_ABA_AVISOS'` por `'URL-B'`.
→ **Commit changes**.

**17.** Abra `sw.js` → lápis → mude `const CACHE = 'ritobr-v1';` para `'ritobr-v2'` → Commit.
*(Sempre que mudar código, suba esse número; quem já instalou o app recebe a nova versão.)*

**18.** Teste: mude um título na planilha, espere ~5 min (cache do Google) e recarregue o
site. Se apareceu, a planilha manda. Se não, o site segue com o `data.js` — nunca quebra.

---

## PARTE 4 — Feed vivo do Google Agenda (opcional, recomendado) · ~7 min

Sem isso, o botão **Google Agenda** usa o `.ics` estático (correto hoje, mas não acompanha
mudanças na planilha).

**19.** Na planilha: **Extensões → Apps Script**. Apague o código que aparece, abra
`site/planilha/AppsScript-agenda-ics.gs`, copie tudo e cole. Salvar (disquete).

**20.** **Implantar → Nova implantação** → engrenagem → tipo **App da Web** →
*Executar como* = **Eu** · *Quem pode acessar* = **Qualquer pessoa** → **Implantar** →
autorize a conta (Avançado → Acessar o projeto) → copie a **URL que termina em /exec**.

**21.** Abra no navegador essa URL com `?debug=1` no fim. Deve mostrar
**"Eventos válidos: 13"** e "Fuso: America/Cuiaba". Se mostrar 0, volte ao passo 13.

**22.** No GitHub, `data.js` → lápis → `icsFeedUrl: ''` → cole a URL /exec entre as aspas →
Commit. Suba o `CACHE` em `sw.js` para `v3` → Commit.

---

## PARTE 5 — QR do crachá · ~3 min

**23.** tinyurl.com → cole `https://viaveritasvita.github.io/ritobr/` → alias `ritobr26`
→ crie. Gere o QR a partir do link curto (o próprio TinyURL oferece) e mande para a gráfica.

---

## Depois do lançamento — o que muda onde

| Quer mudar… | Onde | Precisa subir o CACHE? |
|---|---|---|
| Horário, título, local, nota de uma sessão | Planilha, aba Programação | Não |
| Publicar/retirar aviso na faixa do topo | Planilha, aba Avisos (`ativo` = TRUE/FALSE) | Não |
| Texto de interface, cor de corpo, endereço | `i18n.js` / `data.js` no GitHub | **Sim** (`sw.js`) |
| Apagar uma sessão sem perder a linha | Limpe a célula `id` da linha | Não |

Chaves aceitas na planilha — coluna `local`: `acqua` · `viola` · `templo` · `bluetree`.
Coluna `rito`: `delegacia` · `capitulo` · `altos` · `cerimonia` · `cunhadas` · `geral` · `log`.
Coluna `tipo` (ícone): `meal` · `coffee` · `social` · vazio.

Push (OneSignal) ficou de fora do lançamento; instruções em `README-PUSH.md`
(trocar `amdrio26` por `ritobr` em todos os caminhos).
