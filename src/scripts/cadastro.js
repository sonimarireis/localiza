document.addEventListener("DOMContentLoaded", function () {
  const formCadastro = document.getElementById("cadastroForm");
  const mensagem = document.getElementById("mensagemCadastro"); // elemento para mostrar mensagem

  formCadastro.addEventListener("submit", function (event) {
    event.preventDefault();

    // Pega os valores do formulário
    const nome = document.getElementById("nome").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    // Busca usuários já cadastrados
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica se o usuário já existe
    const usuarioExistente = usuarios.find(u => u.usuario === usuario);

    if (usuarioExistente) {
      mensagem.textContent = "❌ Usuário já existe!";
      mensagem.style.color = "red";
      return;
    }

    // Adiciona novo usuário
    usuarios.push({ nome, usuario, senha });

    // Salva no LocalStorage
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    mensagem.textContent = "✅ Usuário cadastrado com sucesso!";
    mensagem.style.color = "green";
    mensagem.style.fontWeight = "bold";

    // Limpa o formulário
    formCadastro.reset();
  });
});
