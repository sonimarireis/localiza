// 🔒 Proteção de acesso
document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (!usuarioLogado) {
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

  let produtos = [];

  // ===== Funções auxiliares =====
  function formatCurrency(value) {
    if (value == null) return "R$ 0,00";
    const n = Number(value) || 0;
    return "R$ " + n.toFixed(2).replace(".", ",");
  }

  function parsePreco(raw) {
    if (!raw) return 0;
    const normalized = String(raw).replace(/\s/g, "").replace(",", ".");
    const n = parseFloat(normalized);
    return isNaN(n) ? 0 : n;
  }

  async function carregarProdutos() {
    try {
      const res = await fetch("http://localhost:3000/produtos");
      produtos = await res.json();
      renderTabela();
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  }

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

      let classeValidade = "";
      let validadeTexto = prod.validade || "";

      if (prod.validade) {
        const validade = new Date(prod.validade);
        const diffDias = Math.floor((validade - hoje) / (1000 * 60 * 60 * 24));

        if (diffDias < 0) classeValidade = "vencido";
        else if (diffDias <= 7) classeValidade = "quase-vencendo";

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
          <button class="btn-editar" data-id="${prod.id}">✏️</button>
          <button class="btn-excluir" data-id="${prod.id}">🗑️</button>
        </td>
      `;

      tabela.appendChild(tr);
    });
  }

  // ====== Adicionar produto ======
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const produto = {
      id: Date.now(), // ID único
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

    try {
      const res = await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
      });

      const data = await res.json();
      alert(data.msg);
      form.reset();
      carregarProdutos();
      msgSucesso.textContent = "✅ Produto cadastrado com sucesso!";
      setTimeout(() => (msgSucesso.textContent = ""), 3000);
    } catch (err) {
      console.error("Erro ao adicionar produto:", err);
      alert("Erro ao adicionar produto.");
    }
  });

  // ====== Editar / Excluir ======
  tabela.addEventListener("click", async (e) => {
    const id = e.target.dataset.id;
    if (!id) return;

    const produto = produtos.find(p
