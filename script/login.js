// js/login.js

// --- Utilitários ---
// Hash simples usando SubtleCrypto (SHA-256). Retorna hex string.
async function hashPassword(password) {
    const enc = new TextEncoder();
    const data = enc.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  function getUsers() {
    try {
      const raw = localStorage.getItem('users');
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      console.error('Erro ao ler users do localStorage', e);
      return {};
    }
  }
  
  function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  function setLoggedUser(username) {
    localStorage.setItem('loggedUser', username);
  }
  
  function getLoggedUser() {
    return localStorage.getItem('loggedUser');
  }
  
  function logout() {
    localStorage.removeItem('loggedUser');
    // Atualiza a UI se necessário
    location.reload();
  }
  
  // --- Inicialização: cria um usuário padrão se não existir ---
  async function ensureDefaultUser() {
    const users = getUsers();
    if (!users['admin']) {
      const hashed = await hashPassword('admin123'); // senha padrão para teste
      users['admin'] = { passwordHash: hashed, name: 'Administrador' };
      setUsers(users);
      console.info('Usuário padrão "admin" criado (senha: admin123). Troque depois.');
    }
  }
  
  // --- Manipulação do formulário ---
  async function handleLoginSubmit(event) {
    event.preventDefault();
    const mensagemEl = document.getElementById('mensagem');
    const userInput = document.getElementById('usuario');
    const passInput = document.getElementById('senha');
  
    const username = userInput.value.trim();
    const password = passInput.value;
  
    if (!username || !password) {
      mensagemEl.textContent = 'Preencha usuário e senha.';
      mensagemEl.style.color = 'crimson';
      return;
    }
  
    const users = getUsers();
    const user = users[username];
  
    if (!user) {
      mensagemEl.textContent = 'Usuário não encontrado.';
      mensagemEl.style.color = 'crimson';
      return;
    }
  
    const hashedInput = await hashPassword(password);
    if (hashedInput === user.passwordHash) {
      setLoggedUser(username);
      mensagemEl.textContent = `Bem-vindo(a), ${user.name || username}!`;
      mensagemEl.style.color = 'green';
      // redirecionar ou atualizar UI:
      // ex: window.location.href = 'dashboard.html';
      // por enquanto, só recarregamos para atualizar estado:
      setTimeout(() => location.reload(), 800);
    } else {
      mensagemEl.textContent = 'Senha incorreta.';
      mensagemEl.style.color = 'crimson';
    }
  }
  
  // --- Função para criar novo usuário (pode ser usada em um "cadastro" ou console) ---
  async function createUser(username, password, displayName) {
    if (!username || !password)
      throw new Error('Usuário e senha são obrigatórios.');
  
    // 🔸 Validação de tamanho mínimo
    if (username.length < 3)
      throw new Error('O nome de usuário deve ter pelo menos 3 caracteres.');
  
    if (password.length < 6)
      throw new Error('A senha deve ter pelo menos 6 caracteres.');
  
    const users = getUsers();
    if (users[username])
      throw new Error('Usuário já existe.');
  
    const hashed = await hashPassword(password);
    users[username] = { passwordHash: hashed, name: displayName || username };
    setUsers(users);
    return true;
  }
  
  // --- Atualizar a UI do nav (mostrar "Sair" se logado) ---
  function updateNavForAuth() {
    const logged = getLoggedUser();
    const navLinks = document.querySelectorAll('nav ul li a');
    // exemplo: você tinha um link "Sair" no nav — podemos transformá-lo
    const sairLi = Array.from(document.querySelectorAll('nav ul li')).find(li => {
      return li.textContent.trim().toLowerCase().includes('sair');
    });
  
    if (logged && sairLi) {
      sairLi.innerHTML = `<a href="#" id="logoutLink">⚙️ Sair (${logged})</a>`;
      document.getElementById('logoutLink').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
      });
      // opcional: esconder o form de login
      const form = document.getElementById('loginForm');
      if (form) form.style.display = 'none';
    } else if (sairLi) {
      // restaurar link padrão se ninguém logado
      sairLi.innerHTML = `<a href="#">⚙️ Sair</a>`;
      const form = document.getElementById('loginForm');
      if (form) form.style.display = '';
    }
  }
  
  // --- Verifica se a página exige login e redireciona se não estiver logado ---
  // Use isto nas páginas protegidas (produtos.html, vendas.html, etc.)
  function requireLoginOnPage() {
    // coloque esta chamada no topo das páginas protegidas
    const protectedPages = ['clientes.html', 'produtos.html', 'vendas.html'];
    const current = window.location.pathname.split('/').pop();
    if (protectedPages.includes(current)) {
      const logged = getLoggedUser();
      if (!logged) {
        // redirecione para a home ou mostre mensagem
        alert('Você precisa estar logado(a) para acessar esta página.');
        window.location.href = 'index.html'; // ajusta se necessário
      }
    }
  }
  
  // --- Setup ao carregar a página ---
  document.addEventListener('DOMContentLoaded', async () => {
    await ensureDefaultUser();
    updateNavForAuth();
    const form = document.getElementById('loginForm');
    if (form) form.addEventListener('submit', handleLoginSubmit);
    // descomente se quiser exigir login automaticamente:
    // requireLoginOnPage();
  });
  
  // --- Export (opcional, se quiser usar no console) ---
  window.appAuth = { createUser, logout, getLoggedUser };
  