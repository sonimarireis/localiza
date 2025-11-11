document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ produtos-whatsapp.js carregado!");

  const productList = document.getElementById("productList");
  const btnSalvar = document.getElementById("btnSalvar");
  const btnLogout = document.getElementById("btnLogout");
  const btnEnviarWhatsapp = document.getElementById("btnEnviarWhatsapp");
  const msgSucesso = document.getElementById("msgSucesso");
  const numeroWhatsappInput = document.getElementById("numeroWhatsapp");

  // ---------- Carrega produtos cadastrados ----------
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

  function renderProductList() {
    productList.innerHTML = "";

    if (produtos.length === 0) {
      productList.innerHTML = `<tr><td colspan="3">Nenhum produto encontrado.</td></tr>`;
      return;
    }

    produtos.forEach((prod, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prod.nome}</td>
        <td>${prod.validade || "Não informada"}</td>
        <td>
          <input 
            type="number" 
            step="0.01" 
            min="0" 
            placeholder="0,00" 
            data-index="${index}">
        </td>
      `;
      productList.appendChild(tr);
    });
  }

  // ---------- Renderiza ao carregar ----------
  renderProductList();

  // ---------- Salvar lista de venda ----------
  btnSalvar.addEventListener("click", () => {
    const inputs = document.querySelectorAll("input[type='number'][data-index]");
    const produtosVenda = [];

    inputs.forEach(input => {
      const index = parseInt(input.dataset.index);
      const valor = parseFloat(input.value) || 0;
      const produto = produtos[index];

      produtosVenda.push({
        nome: produto.nome,
        validade: produto.validade,
        valorVenda: valor
      });
    });

    localStorage.setItem("produtosVenda", JSON.stringify(produtosVenda));

    msgSucesso.textContent = "✅ Lista de produtos para venda salva com sucesso!";
    setTimeout(() => (msgSucesso.textContent = ""), 4000);
  });

  // ---------- Enviar pelo WhatsApp ----------
  btnEnviarWhatsapp.addEventListener("click", () => {
    const numero = numeroWhatsappInput.value.trim();

    if (!numero) {
      alert("Informe um número de WhatsApp (somente números, ex: 51999999999).");
      return;
    }

    const produtosVenda = JSON.parse(localStorage.getItem("produtosVenda")) || [];

    if (produtosVenda.length === 0) {
      alert("Nenhum produto salvo na lista. Clique em 'Salvar Lista' antes de enviar.");
      return;
    }

    // Monta mensagem formatada
    let mensagem = "🛍️ *Lista de Produtos à Venda:*\n\n";
    produtosVenda.forEach(p => {
      mensagem += `• ${p.nome} - Val: ${p.validade || "N/I"} - R$ ${p.valorVenda?.toFixed(2) || "0,00"}\n`;
    });
    mensagem += "\n_Enviado via Localiza_";

    // Codifica e abre link do WhatsApp Web
    const textoCodificado = encodeURIComponent(mensagem);
    const link = `https://wa.me/${numero}?text=${textoCodificado}`;

    window.open(link, "_blank");
  });

  // ---------- Logout ----------
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "index.html";
    });
  }
});
