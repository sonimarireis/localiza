// Bloqueia páginas para quem não fez login
document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (!usuarioLogado) {
    // manda para o login
    window.location.href = "/pages/index.html";
  }
});
