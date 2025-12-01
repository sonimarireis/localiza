// arquivo: src/script/login.js
const formLogin = document.getElementById('loginForm');

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!usuario || !senha) {
    alert('Preencha usuário e senha.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha })
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.msg);
      window.location.href = 'produtos.html';
    } else {
      alert(data.msg);
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao fazer login. Verifique se o backend está rodando.');
  }
});
