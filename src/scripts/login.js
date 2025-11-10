document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const mensagem = document.getElementById("mensagem");
  
    console.log("Login.js carregado com sucesso!");
    console.log("Form encontrado?", form);
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
  
      console.log("Botão Entrar clicado!"); // confirma o clique
  
      const usuario = document.getElementById("usuario").value.trim();
      const senha = document.getElementById("senha").value.trim();
  
      console.log("Usuário digitado:", usuario);
      console.log("Senha digitada:", senha);
  
      // Busca usuários cadastrados
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
      console.log("Usuários cadastrados no localStorage:", usuarios);
  
      // Procura o usuário no array
      const usuarioEncontrado = usuarios.find(
        (u) => u.usuario === usuario && u.senha === senha
      );
  
      if (usuarioEncontrado) {
        console.log("✅ Usuário encontrado:", usuarioEncontrado);
  
        // Salva o login ativo
        localStorage.setItem("usuarioLogado", JSON.stringify(usuarioEncontrado));
  
        mensagem.textContent = "✅ Login realizado com sucesso!";
        mensagem.style.color = "green";
        mensagem.style.fontWeight = "bold";
  
        // Redireciona após 1,5s
        setTimeout(() => {
          window.location.href = "clientes.html"; // página protegida
        }, 1500);
      } else {
        console.log("❌ Usuário ou senha incorretos!");
        mensagem.textContent = "❌ Usuário ou senha incorretos!";
        mensagem.style.color = "red";
      }
    });
  });
  