const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// ==== Funções auxiliares ====
function lerJSON(arquivo) {
  if (!fs.existsSync(arquivo)) fs.writeFileSync(arquivo, '[]');
  return JSON.parse(fs.readFileSync(arquivo, 'utf-8'));
}

function escreverJSON(arquivo, dados) {
  fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));
}

// ==== ROTAS USUÁRIOS ====
app.post('/usuarios', (req, res) => {
  const { usuario, senha } = req.body;
  const usuarios = lerJSON('./usuarios.json');

  if (usuarios.find(u => u.usuario === usuario)) {
    return res.status(400).json({ msg: 'Usuário já existe!' });
  }

  usuarios.push({ usuario, senha });
  escreverJSON('./usuarios.json', usuarios);
  res.json({ msg: 'Cadastrado com sucesso!' });
});

app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;
  const usuarios = lerJSON('./usuarios.json');
  const user = usuarios.find(u => u.usuario === usuario && u.senha === senha);

  if (user) res.json({ msg: 'Login bem-sucedido!' });
  else res.status(401).json({ msg: 'Usuário ou senha incorretos!' });
});

// ==== ROTAS PRODUTOS ====
app.get('/produtos', (req, res) => res.json(lerJSON('./produtos.json')));
app.post('/produtos', (req, res) => {
  const produtos = lerJSON('./produtos.json');
  produtos.push(req.body);
  escreverJSON('./produtos.json', produtos);

  // Atualiza produtos-whatsapp automaticamente
  escreverJSON('./produtos-whatsapp.json', produtos);

  res.json({ msg: 'Produto adicionado!' });
});

// ==== ROTAS PRODUTOS WHATSAPP ====
app.get('/produtos-whatsapp', (req, res) => res.json(lerJSON('./produtos-whatsapp.json')));
app.post('/produtos-whatsapp', (req, res) => {
  const produtosWhatsapp = lerJSON('./produtos-whatsapp.json');
  produtosWhatsapp.push(req.body);
  escreverJSON('./produtos-whatsapp.json', produtosWhatsapp);
  res.json({ msg: 'Produto WhatsApp adicionado!' });
});

// ==== ROTAS CLIENTES ====
app.get('/clientes', (req, res) => res.json(lerJSON('./clientes.json')));
app.post('/clientes', (req, res) => {
  const clientes = lerJSON('./clientes.json');
  clientes.push(req.body);
  escreverJSON('./clientes.json', clientes);
  res.json({ msg: 'Cliente adicionado!' });
});

// ==== ROTAS VENDAS ====
app.get('/vendas', (req, res) => res.json(lerJSON('./vendas.json')));
app.post('/vendas', (req, res) => {
  const vendas = lerJSON('./vendas.json');
  vendas.push(req.body);
  escreverJSON('./vendas.json', vendas);
  res.json({ msg: 'Venda registrada!' });
});

// ==== INICIAR SERVIDOR ====
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
