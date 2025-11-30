# Fullstack Pack (Vite + Express)

Projeto base minimalista para rodar localmente aplicações fullstack com frontend no Vite e backend em Express.

## Requisitos
- Node.js 18+ (LTS)

## Instalação e execução
```bash
npm install
npm run dev
```
- Frontend (Vite): `http://localhost:3000`
- Backend (API Express): `http://localhost:3001`

O Vite proxia chamadas para `/api` automaticamente para o backend (porta 3001).

## Estrutura de Pastas
```
.
├── pages/               # Páginas HTML (Vite serve diretamente)
│   ├── index.html
│   ├── sobre.html
│   └── contato.html
├── server/
│   ├── routes/          # Rotas da API (autoload)
│   │   └── hello.js
│   └── server.js        # Servidor Express (porta 3001)
├── src/
│   ├── scripts/         # JS do frontend (um por página, opcional)
│   │   ├── index.js
│   │   ├── sobre.js
│   │   └── contato.js
│   └── styles/
│       └── main.css
├── vite.config.js
├── package.json
├── nodemon.json
└── .gitignore
```

## Criar uma nova PÁGINA
1) Crie `pages/minha.html`:
```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Minha Página</title>
  </head>
  <body>
    <div id="app">Carregando...</div>
    <script type="module" src="/src/scripts/minha.js"></script>
  </body>
</html>
```
2) (Opcional) Crie `src/scripts/minha.js`:
```js
import '../styles/main.css';

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  if (app) app.textContent = 'Minha página com Vite!';
});
```
3) Acesse `http://localhost:3000/minha.html`.

## Criar uma nova ROTA de API (sem editar server.js)
1) Crie `server/routes/time.js`:
```js
module.exports = (app) => {
  app.get('/api/time', (_req, res) => {
    const agora = new Date();
    res.json({ time: agora.toISOString() });
  });
};
```
2) Acesse `http://localhost:3000/api/time` (via proxy do Vite).

## Dicas rápidas
- Auto-reload: o Vite faz HMR no frontend; o `nodemon` reinicia a API ao salvar arquivos em `server/`.
- Estilos: importe `src/styles/main.css` nos seus `*.js`.
- Porta ocupada: altere a porta do Vite com `--port` ou a da API com `PORT=3002`.

Pronto! Para criar, basta adicionar arquivos em `pages/` e `server/routes/` e usar `npm run dev`.
