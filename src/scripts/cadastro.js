document.addEventListener("DOMContentLoaded", function () {
  const formCadastro = document.getElementById("cadastroForm");
  const mensagem = document.getElementById("mensagemCadastro");

  formCadastro.addEventListener("submit", function (event) {
    event.preventDefault();

    // Pega os valores
    const nome = document.getElementById("nome").value.trim();
    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    // Busca usuários cadastrados
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Verifica duplicado
    const usuarioExistente = usuarios.find(u => u.usuario === usuario);

    if (usuarioExistente) {
      mensagem.textContent = "❌ Usuário já existe!";
      mensagem.style.color = "red";
      return;
    }

    // Salva novo usuário
    usuarios.push({ nome, usuario, senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // Mostra mensagem de sucesso
    mensagem.textContent = "✅ Usuário cadastrado com sucesso!";
    mensagem.style.color = "green";
    mensagem.style.fontWeight = "bold";

    // Limpa formulário
    formCadastro.reset();

    // Aguarda um segundo e redireciona
    setTimeout(() => {
      window.location.href = "login.html"; // ajuste para o nome correto do seu arquivo
    }, 1200);
  });
});
