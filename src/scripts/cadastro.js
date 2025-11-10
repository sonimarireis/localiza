document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("cadastroForm");
    const mensagem = document.getElementById("mensagem");
  
    form.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const nome = document.getElementById("nome").value.trim();
      const usuario = document.getElementById("usuario").value.trim();
      const senha = document.getElementById("senha").value.trim();
  
      // Verifica se campos estão vazios
      if (!usuario || !senha) {
        mensagem.textContent = "⚠️ Preencha todos os campos!";
        mensagem.style.color = "red";
        return;
      }
  
      // Recupera lista de usuários cadastrados
      const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  
      // Verifica se o usuário já existe
      if (usuarios.some((u) => u.usuario === usuario)) {
        mensagem.textContent = "⚠️ Usuário já cadastrado!";
        mensagem.style.color = "red";
        return;
      }
  
      // Salva novo usuário
      usuarios.push({ nome, usuario, senha });
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
  
      // Mensagem de sucesso
      mensagem.textContent = "✅ Cadastro realizado com sucesso!";
      mensagem.style.color = "green";
      mensagem.style.fontWeight = "bold";
  
      // Limpa o formulário
      form.reset();
  
      // Redireciona para o login
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    });
  });
  