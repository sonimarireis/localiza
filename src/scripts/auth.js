const DEFAULT_PROTECTED_PAGES = ['clientes.html', 'produtos.html', 'vendas.html'];

let authReadyPromise;

function isBrowser() {
  return typeof window !== 'undefined';
}

function getWebCrypto() {
  if (!isBrowser()) return undefined;
  return window.crypto || globalThis.crypto;
}

async function hashPassword(password) {
  const cryptoApi = getWebCrypto();
  if (!cryptoApi?.subtle) {
    throw new Error('API WebCrypto não disponível neste ambiente.');
  }
  const enc = new TextEncoder();
  const data = enc.encode(password);
  const hashBuffer = await cryptoApi.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

function getUsers() {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem('users');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Erro ao ler usuários do localStorage', e);
    return {};
  }
}

function setUsers(users) {
  if (!isBrowser()) return;
  window.localStorage.setItem('users', JSON.stringify(users));
}

function setLoggedUser(username) {
  if (!isBrowser()) return;
  window.localStorage.setItem('loggedUser', username);
}

export function getLoggedUser() {
  if (!isBrowser()) return null;
  return window.localStorage.getItem('loggedUser');
}

export function logout() {
  if (!isBrowser()) return;
  window.localStorage.removeItem('loggedUser');
  window.location.reload();
}

async function ensureDefaultUser() {
  if (!isBrowser()) return;
  const users = getUsers();
  if (!users.admin) {
    const hashed = await hashPassword('admin123');
    users.admin = { passwordHash: hashed, name: 'Administrador' };
    setUsers(users);
    console.info('Usuário padrão "admin" criado (senha: admin123).');
  }
}

function ensureAuthReady() {
  if (!isBrowser()) {
    return Promise.resolve();
  }
  if (!authReadyPromise) {
    authReadyPromise = ensureDefaultUser().catch((err) => {
      console.error('Falha ao preparar autenticação', err);
      throw err;
    });
  }
  return authReadyPromise;
}

function getMensagemElement() {
  if (!isBrowser()) return null;
  return document.getElementById('mensagem');
}

async function handleLoginSubmit(event) {
  event.preventDefault();

  const mensagemEl = getMensagemElement();
  const userInput = document.getElementById('usuario');
  const passInput = document.getElementById('senha');

  const username = userInput?.value.trim();
  const password = passInput?.value;

  if (!username || !password) {
    if (mensagemEl) {
      mensagemEl.textContent = 'Preencha usuário e senha.';
      mensagemEl.style.color = 'crimson';
    }
    return;
  }

  const users = getUsers();
  const user = users[username];

  if (!user) {
    if (mensagemEl) {
      mensagemEl.textContent = 'Usuário não encontrado.';
      mensagemEl.style.color = 'crimson';
    }
    return;
  }

  const hashedInput = await hashPassword(password);
  if (hashedInput === user.passwordHash) {
    setLoggedUser(username);
    if (mensagemEl) {
      mensagemEl.textContent = `Bem-vindo(a), ${user.name || username}!`;
      mensagemEl.style.color = 'green';
    }
    setTimeout(() => window.location.reload(), 800);
  } else if (mensagemEl) {
    mensagemEl.textContent = 'Senha incorreta.';
    mensagemEl.style.color = 'crimson';
  }
}

export async function createUser(username, password, displayName) {
  if (!username || !password) {
    throw new Error('Usuário e senha são obrigatórios.');
  }

  if (username.length < 3) throw new Error('O nome de usuário deve ter pelo menos 3 caracteres.');
  if (password.length < 6) throw new Error('A senha deve ter pelo menos 6 caracteres.');

  const users = getUsers();
  if (users[username]) {
    throw new Error('Usuário já existe.');
  }

  const hashed = await hashPassword(password);
  users[username] = { passwordHash: hashed, name: displayName || username };
  setUsers(users);
  return true;
}

export function updateNavForAuth() {
  const logged = getLoggedUser();
  const form = document.getElementById('loginForm');
  const loginMessage = getMensagemElement();

  if (!form) return;

  if (logged) {
    form.style.display = 'none';
    if (loginMessage) {
      loginMessage.textContent = `Você está autenticado como ${logged}.`;
      loginMessage.style.color = 'green';
    }
  } else {
    form.style.display = '';
    if (loginMessage) {
      loginMessage.textContent = '';
    }
  }
}

export function initLoginPage() {
  if (!isBrowser()) return;
  document.addEventListener('DOMContentLoaded', async () => {
    await ensureAuthReady();
    const form = document.getElementById('loginForm');
    if (form) {
      form.addEventListener('submit', handleLoginSubmit);
    }
    updateNavForAuth();
  });
}

export function initCadastroPage() {
  if (!isBrowser()) return;
  document.addEventListener('DOMContentLoaded', async () => {
    await ensureAuthReady();
    updateNavForAuth();

    const form = document.getElementById('cadastroForm');
    const messageEl = document.getElementById('mensagem');

    if (!form || !messageEl) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const nome = document.getElementById('nome')?.value.trim();
      const usuario = document.getElementById('usuario')?.value.trim();
      const senha = document.getElementById('senha')?.value;

      try {
        await createUser(usuario, senha, nome);
        messageEl.textContent = 'Usuário cadastrado com sucesso!';
        messageEl.style.color = 'green';
        form.reset();
        setTimeout(() => {
          window.location.href = 'index.html';
        }, 1200);
      } catch (error) {
        messageEl.textContent = error.message;
        messageEl.style.color = 'crimson';
      }
    });
  });
}

export function guardProtectedPage(pages = DEFAULT_PROTECTED_PAGES) {
  if (!isBrowser()) return;
  document.addEventListener('DOMContentLoaded', async () => {
    await ensureAuthReady();
    const current = window.location.pathname.split('/').pop() || 'index.html';
    if (!pages.includes(current)) return;

    const logged = getLoggedUser();
    if (!logged) {
      alert('Você precisa estar logado(a) para acessar esta página.');
      window.location.href = 'index.html';
    }
  });
}

if (isBrowser()) {
  ensureAuthReady()
    .then(() => {
      window.appAuth = {
        createUser,
        logout,
        getLoggedUser,
      };
    })
    .catch(() => {
      // silencia erros já logados anteriormente
    });
}

