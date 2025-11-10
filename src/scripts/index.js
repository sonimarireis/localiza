const formLogin = document.getElementById("loginForm");
const mensagem = document.getElementById("mensagem");

formLogin.addEventListener("submit", function (event) {
  event.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();

  // busca os usuários cadastrados
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // verifica se o login é válido
  const usuarioValido = usuarios.find(u => u.usuario === usuario && u.senha === senha);

  if (usuarioValido) {
    mensagem.textContent = `Bem-vindo, ${usuarioValido.nome}!`;
    mensagem.style.color = "green";

    // salva usuário logado (para uso em outras páginas)
    localStorage.setItem("usuarioLogado", JSON.stringify(usuarioValido));

    // redireciona após 2 segundos
    setTimeout(() => {
      window.location.href = "clientes.html"; // ou outra página
    }, 2000);
  } else {
    mensagem.textContent = "Usuário ou senha incorretos!";
    mensagem.style.color = "red";
  }
});
