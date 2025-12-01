console.log('✅ Projeto Localiza rodando!');

function salvarDados(dados) {
  const produtosExistentes = JSON.parse(localStorage.getItem("produtos")) || [];
  const novosProdutos = [...produtosExistentes, ...dados];
  localStorage.setItem("produtos", JSON.stringify(novosProdutos));
  atualizarTabela();
  alert("CSV importado com sucesso!");
}

function atualizarTabela() {
  const tabelaBody = document.querySelector("#tabelaProdutos tbody");
  tabelaBody.innerHTML = "";
  const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

  produtos.forEach(prod => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${prod.Codigo || ""}</td>
      <td>${prod.Nome || ""}</td>
      <td>${prod.Preco || ""}</td>
    `;
    tabelaBody.appendChild(tr);
  });
}

document.getElementById("importButton").addEventListener("click", () => {
  const fileInput = document.getElementById("csvFileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Escolha um arquivo CSV antes!");
    return;
  }

  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    complete: function(results) {
      console.log("Dados importados:", results.data);
      salvarDados(results.data);
    },
    error: function(err) {
      console.error("Erro ao importar CSV:", err);
    }
  });
});

document.addEventListener("DOMContentLoaded", atualizarTabela);
