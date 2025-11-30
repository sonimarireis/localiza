document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (!usuarioLogado) {
    // Não deixa entrar!
    window.location.href = "/pages/index.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {

  console.log("✅ vendas.js carregado e vinculado a produtos.js");

  const tabelaBody = document.querySelector("#tabelaVendas tbody");
  const btnImprimir = document.getElementById("btnImprimir");

  if (!tabelaBody) {
    console.error("❌ Elemento #tabelaVendas tbody não encontrado.");
    return;
  }

  // === Funções utilitárias ===
  const tryParse = (str) => {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  };

  const toNumber = (value) => {
    if (!value) return 0;
    return parseFloat(String(value).replace(/[^\d,.-]/g, "").replace(",", ".")) || 0;
  };

  const formatCurrency = (num) =>
    "R$ " + (Number(num) || 0).toFixed(2).replace(".", ",");

  // === Carregar produtos do localStorage ===
  const produtos = tryParse(localStorage.getItem("produtosLocaliza")) || [];
  console.log("📦 Produtos carregados do localStorage:", produtos);

  if (!Array.isArray(produtos) || produtos.length === 0) {
    tabelaBody.innerHTML =
      "<tr><td colspan='4' style='text-align:center;'>Nenhum produto cadastrado ainda.</td></tr>";
    return;
  }

  // === Gerar linhas da tabela ===
  tabelaBody.innerHTML = produtos
    .map((produto) => {
      const valorCompra = toNumber(produto.valorCompra);
      const valorVenda = toNumber(produto.valorVenda);
      const lucroBruto = valorVenda - valorCompra;

      return `
        <tr>
          <td>${produto.nome}</td>
          <td>${formatCurrency(valorCompra)}</td>
          <td>${formatCurrency(valorVenda)}</td>
          <td>${formatCurrency(lucroBruto)}</td>
        </tr>
      `;
    })
    .join("");

  // === Botão de imprimir ===
  btnImprimir.addEventListener("click", () => {
    window.print();
  });
});
