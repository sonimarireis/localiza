document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ login.js carregado e funcional!");

  const form = document.getElementById("loginForm");
  const usuarioInput = document.getElementById("usuario");
  const senhaInput = document.getElementById("senha");
  const mensagem = document.getElementById("mensagem");

  if (!form || !usuarioInput || !senhaInput || !mensagem) {
    console.error("❌ IDs incorretos ou elementos não encontrados no HTML.");
    return;
  }

  const mostrarMensagem = (texto, cor = "red") => {
    mensagem.textContent = texto;
    mensagem.style.color = cor;
    mensagem.style.fontWeight = "bold";
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = usuarioInput.value.trim();
    const senha = senhaInput.value.trim();

    if (!usuario || !senha) {
      mostrarMensagem("⚠️ Preencha todos os campos.", "orange");
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    if (!Array.isArray(usuarios) || usuarios.length === 0) {
      mostrarMensagem("⚠️ Nenhum usuário cadastrado encontrado.", "orange");
      return;
    }

    const encontrado = usuarios.find(
      (u) => u.usuario === usuario && u.senha === senha
    );

    if (encontrado) {
      mostrarMensagem(`✅ Bem-vindo(a), ${encontrado.nome || usuario}!`, "green");
      localStorage.setItem("usuarioLogado", JSON.stringify(encontrado));
      setTimeout(() => {
        window.location.href = "/pages/clientes.html";
      }, 1500);
    } else {
      mostrarMensagem("❌ Usuário ou senha incorretos!");
    }
  });
});