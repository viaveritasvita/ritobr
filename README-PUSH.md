# README-PUSH.md — Ativar as notificações (OneSignal)

Guia para quem **não é técnico**. Seguindo os passos abaixo, o botão
**"Receber avisos"** aparece no site e você passa a poder enviar
notificações push para os celulares dos participantes.

**Situação especial deste site (importante entender):** o site vive numa
**subpasta** (`https://viaveritasvita.github.io/amdrio26/`) e **já possui um
service worker próprio** (`sw.js`) que faz o modo offline funcionar. Esse mesmo
`sw.js` já importa o worker do OneSignal internamente. Por isso, no painel do
OneSignal vamos dizer: **"use o MEU service worker"** — e apontar tudo para o
`sw.js`, no escopo `/amdrio26/`. Assim existe **um único** service worker
cuidando de offline **e** push, sem conflito.

---

## Passo 1 — Criar a conta e o app

1. Acesse https://onesignal.com e crie uma conta gratuita.
2. No painel, clique em **New App/Website**.
3. Dê um nome (ex.: `AMD Rio 26`) e escolha a plataforma **Web** (Web Push).

## Passo 2 — Configuração "Typical Site"

1. Escolha o tipo de integração **Typical Site**.
2. Preencha:
   - **Site Name:** `AMD Rio 26` (ou o nome que preferir — aparece na notificação)
   - **Site URL:** `https://viaveritasvita.github.io/amdrio26/`
   - **Site is HTTPS?** Sim (o GitHub Pages já é HTTPS).
3. **Default Notification Icon URL** (ícone padrão da notificação): use o brasão.
   Cole a URL:
   `https://viaveritasvita.github.io/amdrio26/assets/medalhao.png`

## Passo 3 — Advanced → Service Workers (o passo que NÃO pode ser pulado)

Ainda na mesma tela, abra a seção **Advanced** e localize
**Service Workers** (em algumas versões do painel aparece como
*"Custom service worker configuration"* ou a opção
*"I already have a service worker" / "I use my own service worker"* — ative-a).

Preencha os três campos assim (exatamente):

| Campo no painel | Valor |
|---|---|
| **Path to service worker files** (caminho dos arquivos) | `/amdrio26/` |
| **Main service worker filename** e **Updater service worker filename** | `sw.js` |
| **Service worker registration scope** (escopo) | `/amdrio26/` |

Em palavras simples: estamos dizendo ao OneSignal *"não crie um worker novo;
use o arquivo `sw.js` que já existe na pasta `/amdrio26/` do site"*. Se este
passo for pulado, o OneSignal tenta registrar um segundo worker e o push (ou o
modo offline) pode falhar.

Salve (**Save**).

## Passo 4 — Copiar o App ID e colar no site

1. No painel do OneSignal: **Settings → Keys & IDs**.
2. Copie o **OneSignal App ID** (um código no formato
   `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
3. Abra o arquivo `data.js` do site e troque o placeholder:

   ```js
   // antes
   oneSignalAppId: 'COLE_SEU_ONESIGNAL_APP_ID_AQUI',
   // depois (exemplo)
   oneSignalAppId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
   ```

## Passo 5 — Publicar

1. Suba o `data.js` alterado para o GitHub (commit + push).
2. Abra o `sw.js` e **aumente a versão do cache** em uma unidade
   (a linha `const CACHE = 'amdrio26-v19';` → `'amdrio26-v20'`, e assim por
   diante a cada publicação). Suba o `sw.js` também. Isso força os celulares a
   baixarem a versão nova do site.

Enquanto o App ID for o placeholder, o botão **"Receber avisos" fica oculto**
de propósito — nada quebrado aparece para o público. Depois de publicar o App
ID, ele passa a aparecer sozinho.

## Passo 6 — Testar (em aparelho real!)

**Android (Chrome):**
1. Abra `https://viaveritasvita.github.io/amdrio26/` no Chrome do celular.
2. Toque em **"Receber avisos"** e **permita** as notificações.
   O botão muda para *"Avisos ativados"*.
3. No painel do OneSignal: **Messages → New Message → Push**, escreva um teste
   e envie. A notificação deve chegar no celular (pode levar alguns minutos).

**iPhone (iOS 16.4 ou mais novo):**
1. **Instale primeiro**: abra o site no **Safari** → toque em
   **"Instalar app"** → siga o passo a passo (Compartilhar → *Adicionar à Tela
   de Início* → *Adicionar*). Só o Safari instala no iPhone.
2. Abra o app **pelo ícone novo na tela de início** (não pelo Safari).
3. Dentro do app instalado, toque em **"Receber avisos"** e permita.
4. Envie um teste pelo painel, como no Android.

## Avisos honestos (leia antes de se frustrar)

- **iPhone:** notificações web só funcionam com o app **instalado pela tela de
  início** e com **iOS 16.4 ou superior**. No Safari "normal" (sem instalar),
  não existe push no iPhone — por isso o botão "Receber avisos" no iPhone abre
  o passo a passo de instalação primeiro.
- A entrega de uma notificação **pode levar alguns minutos**; não é instantânea.
- Teste sempre em **aparelho real** (emuladores e modo anônimo se comportam
  diferente).
- Se a pessoa **negar** a permissão, o navegador bloqueia novos pedidos; ela
  precisa reativar nas configurações do próprio navegador (o botão do site
  mostrará *"Avisos bloqueados no navegador"*).
- O modo **offline não depende do OneSignal**: se o SDK não carregar (sem
  internet), o site continua 100% funcional — só o botão de avisos não aparece.
