document.addEventListener("DOMContentLoaded", () => {
  const productListDiv = document.getElementById("productList");
  const btnSalvar = document.getElementById("btnSalvar");
  const msgSucesso = document.getElementById("msgSucesso");

  // Busca produtos cadastrados
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

  function renderProductList() {
    productListDiv.innerHTML = "";

    if (produtos.length === 0) {
      productListDiv.innerHTML = `<tr><td colspan="3">Nenhum produto encontrado.</td></tr>`;
      return;
    }

    produtos.forEach(prod => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prod.nome}</td>
        <td>${prod.validade || "Não informada"}</td>
        <td><input type="number" step="0.01" min="0" placeholder="0,00" data-codigo="${prod.codigo}"></td>
      `;
      productListDiv.appendChild(tr);
    });
  }

  // Renderiza tabela assim que a página abre
  renderProductList();

  // Botão salvar
  btnSalvar.addEventListener("click", () => {
    const inputs = document.querySelectorAll("input[data-codigo]");
    const produtosVenda = [];

    inputs.forEach(input => {
      const codigo = input.dataset.codigo;
      const valor = parseFloat(input.value) || 0;
      const produto = produtos.find(p => p.codigo === codigo);

      if (produto) {
        produtosVenda.push({
          nome: produto.nome,
          validade: produto.validade,
          valorVenda: valor
        });
      }
    });

    localStorage.setItem("produtosVenda", JSON.stringify(produtosVenda));

    msgSucesso.textContent = "✅ Lista de produtos para venda salva com sucesso!";
    setTimeout(() => (msgSucesso.textContent = ""), 4000);
  });

  // Logout
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogado");
      window.location.href = "index.html";
    });
  }
});
