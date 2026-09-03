# Como editar o site — guia rápido (fluxo da PLANILHA)

**A planilha do Google manda.** Depois de uma configuração única (passos 1–4 abaixo),
toda a programação e todos os avisos são editados **direto no Google Sheets**, como
numa planilha comum. O site lê a planilha ao vivo — **não precisa mexer em código**.

Se a planilha estiver fora do ar (ou ainda não configurada), o site usa
automaticamente uma cópia embutida (`data.js` + `avisos.json`) e **nunca quebra**.

---

## 1. Criar a planilha (uma única vez)

1. Entre no [Google Sheets](https://sheets.google.com) e crie uma planilha nova
   (ex.: nome **"Rito Brasileiro — Programação"**).
2. Renomeie a primeira aba para **Programação** e importe o arquivo
   `planilha/programacao.csv` deste repositório:
   **Arquivo → Importar → Fazer upload → programacao.csv → Substituir planilha atual**
   (separador: vírgula; encoding: o padrão detectado já funciona).
3. Crie uma segunda aba chamada **Avisos** e importe `planilha/avisos.csv` nela:
   **Arquivo → Importar → Fazer upload → avisos.csv → Inserir novas páginas**
   (depois renomeie a página criada para **Avisos**, se necessário).

> Importante: **não mude os nomes das colunas** (linha 1 de cada aba). É por elas
> que o site entende a planilha. E formate as colunas de hora como **texto simples**
> se o Sheets tentar "corrigir" os horários (o site aceita `9:00` ou `09:00`).

## 2. O que significa cada coluna

### Aba "Programação" — uma linha por sessão

| Coluna | O que é | Exemplos / valores aceitos |
|---|---|---|
| `id` | Código único da sessão (não repita!) | `d5-3`, `d5-10` (novo item do dia 5) |
| `data` | Dia da sessão, formato AAAA-MM-DD | `2026-09-05` |
| `inicio` | Hora de início (HH:MM) | `10:00` |
| `fim` | Hora de fim — **deixe vazio** se não houver | `12:30` ou vazio |
| `local` | Chave do lugar | `acqua` · `viola` · `templo` · `bluetree` · vazio = "a definir" |
| `rito` | Corpo/grau (define a cor do cartão) | `delegacia` · `capitulo` (graus 4–18) · `altos` (graus 19–33) · `cerimonia` · `cunhadas` · `geral` · `log` (refeições) |
| `tipo` | Só para itens de logística/sociais (define o ícone) | `meal` (refeição) · `hotel` (retorno) · `transfer` (traslado) · `coffee` (café) · `pickup` (buscar delegação) · `social` (confraternização) · vazio = cerimônia comum |
| `titulo_pt` | Nome da sessão | texto livre |
| `restricao_pt` | Tarja âmbar "Atenção" (vazio = sem tarja) | "Início pontual às 7h30" |
| `nota_pt` | Observação neutra (vazio = sem nota) | "R$ 50 por adulto." |

- **Mudar horário / nome / lugar** → edite a célula correspondente.
- **Mudar a ordem** dentro de um dia → mova a linha para cima/baixo (o site ordena por horário).
- **Adicionar sessão** → insira uma linha nova com um `id` **novo e único**.
- **Remover sessão** → apague a linha.
- **Dia novo** → basta usar uma `data` nova; os dias aparecem em ordem de data, e
  datas anteriores a 04/09 entram automaticamente como "véspera".

### Aba "Avisos" — uma linha por aviso (faixa no topo do site)

| Coluna | O que é |
|---|---|
| `id` | Código único do aviso (**novo para cada aviso**, ex.: `2026-09-05-almoco`) |
| `ativo` | `TRUE` = aviso no ar · `FALSE` = aviso desligado |
| `publicadoEm` | Data/hora de publicação (o mais recente aparece primeiro), ex.: `2026-09-05T11:40:00-04:00` |
| `texto_pt` | O texto do aviso |
| `link` | Opcional — um link "saiba mais" (deixe vazio se não usar) |

Para **publicar** um aviso: preencha uma linha nova e ponha `ativo` = `TRUE`.
Para **retirar**: mude para `FALSE`. Simples assim.

## 3. Publicar na web (uma única vez)

Na planilha: **Arquivo → Compartilhar → Publicar na web**. Então:

1. No primeiro seletor, escolha a aba **Programação**; no segundo, escolha
   **Valores separados por vírgula (.csv)** → **Publicar** → copie a URL.
2. Repita para a aba **Avisos** (também em .csv) → copie a segunda URL.

Você terá **2 URLs** (uma por aba), no formato
`https://docs.google.com/spreadsheets/d/e/…/pub?gid=…&single=true&output=csv`.

## 4. Colar as 2 URLs no site (uma única vez)

No arquivo `data.js` (edite no GitHub com o lápis ✏️ → Commit), no topo, em
`SITE_CONFIG`, substitua os placeholders:

```js
sheetProgramacaoCsvUrl: 'COLE_A_URL_CSV_PUBLICADA_DA_ABA_PROGRAMACAO',
sheetAvisosCsvUrl: 'COLE_A_URL_CSV_PUBLICADA_DA_ABA_AVISOS',
```

pelas URLs copiadas no passo 3. Commit → pronto.

---

## ✅ A partir daqui: só a planilha

- **Editar a planilha JÁ atualiza o site.** Não precisa de commit, não precisa de
  código, **não precisa subir versão de cache** para mudanças de conteúdo.
- O Google guarda o CSV publicado em cache: a mudança pode levar **alguns minutos**
  para aparecer (normalmente ~5 min). Recarregue o site para ver.
- **Offline**: quem abrir o app sem internet vê a última versão que o aparelho baixou.
- Se alguém apagar a planilha ou a publicação falhar, o site continua no ar com a
  cópia embutida (a última gravada em `data.js`/`avisos.json`).

## ⚠️ Regra de ouro do cache — só para mudanças de CÓDIGO

Mudou **arquivo do site** (visual, textos de interface, `index.html`, `styles.css`,
`app.js`, `data.js`, etc.)? Aí sim, suba a versão do cache em `sw.js`:

```js
const CACHE = 'amdrio26-v13';
```

troque `v13` → `v14` → `v15`... Sem isso, quem já instalou o app pode continuar
vendo a versão antiga **do código**. (Repetindo: mudança **na planilha** NÃO
precisa disso.)

## 📌 Nota sobre a assinatura no Google Agenda

O botão "Google Agenda" da agenda completa assina o arquivo **estático**
`assets/agenda-amdrio26.ics` — uma **fotografia** da grade. Se a programação mudar
na planilha, a assinatura só reflete a mudança se esse arquivo for **regenerado**
(peça para eu regerar) e o cache do `sw.js` for atualizado — é uma limitação do
modelo de assinatura do Google. Já o **download .ics** (sessão a sessão e o
programa completo) é gerado na hora, sempre com os dados em uso (planilha).

## Resumo de 1 linha

- **Programação e avisos** → edite a **planilha do Google** (nada mais).
- **Visual/código** → arquivos do repositório + subir o `CACHE` no `sw.js`.
- **Assinatura Google Agenda** → regerar `assets/agenda-amdrio26.ics` quando a grade mudar.
