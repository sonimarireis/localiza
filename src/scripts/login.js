document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const mensagem = document.getElementById("mensagem");

  console.log("✅ login.js carregado com sucesso!");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const senha = document.getElementById("senha").value.trim();

    console.log("Tentando login com:", usuario, senha);

    // Busca os usuários cadastrados
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    console.log("Usuários cadastrados:", usuarios);

    // Verifica se existe um usuário igual
    const usuarioEncontrado = usuarios.find(
      (u) => u.usuario === usuario && u.senha === senha
    );

    if (usuarioEncontrado) {
      console.log("✅ Login bem-sucedido:", usuarioEncontrado);

      mensagem.textContent = `Bem-vindo(a), ${usuarioEncontrado.nome}!`;
      mensagem.style.color = "green";
      mensagem.style.fontWeight = "bold";

      // Salva usuário logado
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));

      // Redireciona após 1,5 segundos
      setTimeout(() => {
        window.location.href = "clientes.html";
      }, 1500);
    } else {
      console.log("❌ Usuário ou senha incorretos");
      mensagem.textContent = "❌ Usuário ou senha incorretos!";
      mensagem.style.color = "red";
    }
  });
});
