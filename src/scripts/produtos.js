// produtos.js — versão revisada e compatível com produtos-whatsapp.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ produtos.js carregado!");

  const form = document.getElementById("product-form");
  const nomeInput = document.getElementById("nome");
  const validadeInput = document.getElementById("validade");
  const precoInput = document.getElementById("preco");
  const estoqueInput = document.getElementById("estoque");
  const tabela = document.getElementById("tabelaProdutos");
  const msgSucesso = document.getElementById("msgSucesso");

  // ----------- Carrega produtos existentes -----------
  let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  console.log("📦 Produtos carregados:", produtos);

  // ----------- Renderiza tabela -----------
  function renderTabela() {
    tabela.innerHTML = "";

    if (produtos.length === 0) {
      tabela.innerHTML = `
        <tr><td colspan="4" style="text-align:center;">Nenhum produto cadastrado.</td></tr>
      `;
      return;
    }

    produtos.forEach((prod, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${prod.nome}</td>
        <td>${prod.validade || "N/I"}</td>
        <td>R$ ${Number(prod.preco).toFixed(2)}</td>
        <td>${prod.estoque || 0}</td>
        <td><button class="btn-excluir" data-index="${index}">🗑️ Excluir</button></td>
      `;
      tabela.appendChild(tr);
    });
  }

  renderTabela();

  // ----------- Salvar produto -----------
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = nomeInput.value.trim();
    const validade = validadeInput.value.trim();
    const preco = parseFloat(precoInput.value) || 0;
    const estoque = parseInt(estoqueInput.value) || 0;

    if (!nome || !validade || preco <= 0) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const novoProduto = { nome, validade, preco, estoque };

    produtos.push(novoProduto);
    localStorage.setItem("produtos", JSON.stringify(produtos));
    console.log("💾 Produto salvo:", novoProduto);

    form.reset();
    renderTabela();

    msgSucesso.textContent = "✅ Produto cadastrado com sucesso!";
    setTimeout(() => (msgSucesso.textContent = ""), 3000);
  });

  // ----------- Excluir produto -----------
  tabela.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-excluir")) {
      const index = e.target.dataset.index;
      produtos.splice(index, 1);
      localStorage.setItem("produtos", JSON.stringify(produtos));
      renderTabela();
    }
  });
});
