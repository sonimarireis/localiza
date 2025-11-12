document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const mensagem = document.getElementById("mensagem");

  console.log("✅ login.js carregado e pronto!");

  if (!form) {
    console.error("⚠️ Formulário de login não encontrado!");
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const usuario = document.getElementById("usuario")?.value.trim();
    const senha = document.getElementById("senha")?.value.trim();

    if (!usuario || !senha) {
      mensagem.textContent = "⚠️ Preencha todos os campos.";
      mensagem.style.color = "orange";
      return;
    }

    console.log("Tentando login com:", usuario, senha);

    // Busca usuários cadastrados
    const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios")) || [];
    console.log("Usuários encontrados:", usuariosSalvos);

    // Verifica se o usuário e senha correspondem
    const usuarioEncontrado = usuariosSalvos.find(
      (u) => u.usuario === usuario && u.senha === senha
    );

    if (usuarioEncontrado) {
      console.log("✅ Login realizado com sucesso:", usuarioEncontrado);

      mensagem.textContent = `✅ Bem-vindo(a), ${usuarioEncontrado.nome || usuario}!`;
      mensagem.style.color = "green";
      mensagem.style.fontWeight = "bold";

      // Salva o usuário logado
      localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));

      // Redireciona após 1.5s
      setTimeout(() => {
        window.location.href = "clientes.html";
      }, 1500);
    } else {
      console.warn("❌ Usuário ou senha incorretos!");
      mensagem.textContent = "❌ Usuário ou senha incorretos!";
      mensagem.style.color = "red";
      mensagem.style.fontWeight = "bold";
    }
  });
});
