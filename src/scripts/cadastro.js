document.addEventListener("DOMContentLoaded", function () {
  const formCadastro = document.getElementById("cadastroForm");
  const mensagem = document.getElementById("mensagemCadastro");

  formCadastro.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioExistente = usuarios.find(u => u.usuario === usuario);

    if (usuarioExistente) {
      mensagem.textContent = "❌ Usuário já existe!";
      mensagem.style.color = "red";
      return;
    }

    usuarios.push({ nome, usuario, senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mensagem.textContent = "✅ Usuário cadastrado com sucesso!";
    mensagem.style.color = "green";
    mensagem.style.fontWeight = "bold";

    formCadastro.reset();

    setTimeout(() => {
      window.location.href = "/pages/index.html";

    }, 1200);
  });
});
