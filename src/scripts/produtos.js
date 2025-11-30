// 🔒 Proteção de acesso
document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (!usuarioLogado) {
    // Não deixa entrar!
    window.location.href = "/pages/index.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ produtos.js carregado!");

  const form = document.getElementById("product-form");
  const pDate = document.getElementById("pDate");
  const pCode = document.getElementById("pCode");
  const pName = document.getElementById("pName");
  const pMax = document.getElementById("pMax");
  const pExpiry = document.getElementById("pExpiry");
  const pCategory = document.getElementById("pCategory");
  const pPrice = document.getElementById("pPrice");
  const tabela = document.getElementById("productsTable");
  const msgSucesso = document.getElementById("msgSucesso");
  const searchInput = document.getElementById("searchProducts");
  const filterCategory = document.getElementById("filterCategory");

  // Chave única para produtos (usada também em produtos-whatsapp.js)
  const STORAGE_KEY = "produtosLocaliza";

  // Carrega produtos existentes
  let produtos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  console.log("📦 Produtos carregados:", produtos);

  function formatCurrency(value) {
    if (value == null) return "R$ 0,00";
    const n = Number(value) || 0;
    return "R$ " + n.toFixed(2).replace(".", ",");
  }

  // Renderiza tabela (com filtro, busca e destaque de validade)
function renderTabela() {
  const q = (searchInput?.value || "").toLowerCase().trim();
  const categoria = (filterCategory?.value || "").trim();

  tabela.innerHTML = "";

  const hoje = new Date();

  const listaFiltrada = produtos.filter(p => {
    const matchNome = p.nome.toLowerCase().includes(q);
    const matchCategoria = categoria ? p.categoria === categoria : true;
    return matchNome && matchCategoria;
  });

  if (listaFiltrada.length === 0) {
    tabela.innerHTML = `<tr><td colspan="7" style="text-align:center;">Nenhum produto cadastrado.</td></tr>`;
    return;
  }

  listaFiltrada.forEach((prod, index) => {
    const tr = document.createElement("tr");

    // ====== Lógica da validade ======
    let classeValidade = "";
    let validadeTexto = prod.validade || "";

    if (prod.validade) {
      const validade = new Date(prod.validade);
      const diffDias = Math.floor((validade - hoje) / (1000 * 60 * 60 * 24));

      if (diffDias < 0) {
        classeValidade = "vencido"; // Vermelho
      } else if (diffDias <= 7) {
        classeValidade = "quase-vencendo"; // Amarelo forte
      }

      validadeTexto = validade.toLocaleDateString("pt-BR");
    }

    tr.innerHTML = `
      <td>${prod.codigo || ""}</td>
      <td>${prod.nome}</td>
      <td>${formatCurrency(prod.preco)}</td>
      <td>${prod.estoque ?? 0}</td>
      <td>${prod.ultimaContagem || ""}</td>
      <td class="${classeValidade}">${validadeTexto}</td>
      <td>
        <button class="btn-editar" data-index="${index}">✏️</button>
        <button class="btn-excluir" data-index="${index}">🗑️</button>
      </td>
    `;

    tabela.appendChild(tr);
  });
}

renderTabela();


  // Validar e parsear preço (aceita vírgula ou ponto)
  function parsePreco(raw) {
    if (!raw) return 0;
    const normalized = String(raw).replace(/\s/g, "").replace(",", ".");
    const n = parseFloat(normalized);
    return isNaN(n) ? 0 : n;
  }

  // Salvar produto
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const produto = {
      data: pDate.value || null,
      codigo: pCode.value.trim(),
      nome: pName.value.trim(),
      estoque: Number(pMax.value) || 0,
      validade: pExpiry.value || null,
      categoria: pCategory.value || null,
      preco: parsePreco(pPrice.value),
      ultimaContagem: null
    };

    if (!produto.nome || produto.preco <= 0) {
      alert("Preencha pelo menos o nome e o preço (maior que 0).");
      return;
    }

    produtos.push(produto);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
    console.log("💾 Produto salvo:", produto);

    form.reset();
    renderTabela();

    msgSucesso.textContent = "✅ Produto cadastrado com sucesso!";
    setTimeout(() => (msgSucesso.textContent = ""), 3000);
  });

  // Excluir / Editar
  tabela.addEventListener("click", (e) => {
    const idx = e.target.dataset.index;
    if (!idx) return;

    if (e.target.classList.contains("btn-excluir")) {
      const confirmed = confirm("Confirma exclusão deste produto?");
      if (!confirmed) return;
      produtos.splice(Number(idx), 1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
      renderTabela();
      return;
    }

    if (e.target.classList.contains("btn-editar")) {
      // Carregar dados no formulário para editar (simples: ao salvar será novo registro)
      const p = produtos[Number(idx)];
      if (!p) return;
      pDate.value = p.data || "";
      pCode.value = p.codigo || "";
      pName.value = p.nome || "";
      pMax.value = p.estoque ?? "";
      pExpiry.value = p.validade || "";
      pCategory.value = p.categoria || "";
      pPrice.value = (p.preco != null) ? p.preco.toFixed(2).replace(".", ",") : "";
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  // Busca e filtro
  if (searchInput) {
    searchInput.addEventListener("input", renderTabela);
  }
  if (filterCategory) {
    filterCategory.addEventListener("change", renderTabela);
  }
});
