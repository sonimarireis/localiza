// arquivo: src/script/cadastro.js
const formCadastro = document.getElementById('cadastroForm');

formCadastro.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const usuario = document.getElementById('usuario').value.trim();
  const senha = document.getElementById('senha').value.trim();

  if (!nome || !usuario || !senha) {
    alert('Preencha todos os campos.');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, senha, nome }) // envia também nome se quiser salvar
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.msg); // cadastrado com sucesso
      window.location.href = 'login.html';
    } else {
      alert(data.msg); // usuário já existe
    }
  } catch (err) {
    console.error(err);
    alert('Erro ao cadastrar usuário. Verifique se o backend está rodando.');
  }
});
