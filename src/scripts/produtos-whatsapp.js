document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (!usuarioLogado) {
    window.location.href = "/pages/index.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ produtos-whatsapp.js carregado!");

  const tabela = document.getElementById("productList");
  const btnSalvar = document.getElementById("btnSalvar");
  const btnEnviarWhatsapp = document.getElementById("btnEnviarWhatsapp");
  const msgSucesso = document.getElementById("msgSucesso");
  const numeroWhatsapp = document.getElementById("numeroWhatsapp");

  let produtosVenda = [];

  // ===== Funções =====
  async function carregarProdutosVenda() {
    try {
      const res = await fetch("http://localhost:3000/produtos-whatsapp");
      produtosVenda = await res.json();
      renderTabela();
    } catch (err) {
      console.error("Erro ao carregar produtos WhatsApp:", err);
    }
  }

  function renderTabela() {
    tabela.innerHTML = "";

    if (produtosVenda.length === 0) {
      tabela.innerHTML = `
        <tr>
          <td colspan="4" style="text-align:center;">Nenhum produto cadastrado.</td>
        </tr>`;
      return;
    }

    produtosVenda.forEach((prod, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>
          <input type="checkbox" class="chkProduto" data-index="${index}">
        </td>
        <td>${prod.nome || ""}</td>
        <td>${prod.validade || ""}</td>
        <td>
          <input 
            type="number" 
            step="0.01" 
            class="input-valor" 
            data-index="${index}" 
            value="${prod.valorVenda || ""}" 
            placeholder="R$ 0,00"
          />
        </td>
      `;

      tabela.appendChild(tr);
    });

    // Atualiza valores conforme digita
    document.querySelectorAll(".input-valor").forEach(input => {
      input.addEventListener("input", e => {
        const index = e.target.dataset.index;
        produtosVenda[index].valorVenda = e.target.value.trim();
      });
    });
  }

  async function salvarLista() {
    try {
      const res = await fetch("http://localhost:3000/produtos-whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtosVenda)
      });

      const data = await res.json();
      msgSucesso.textContent = "✅ Lista salva com sucesso!";
      msgSucesso.style.color = "green";
      setTimeout(() => (msgSucesso.textContent = ""), 2000);
      console.log(data.msg);
    } catch (err) {
      console.error("Erro ao salvar lista:", err);
      alert("Erro ao salvar lista.");
    }
  }

  btnSalvar.addEventListener("click", salvarLista);

  btnEnviarWhatsapp.addEventListener("click", () => {
    const numero = numeroWhatsapp.value.replace(/\D/g, "");
    if (!numero) {
      alert("Digite um número de WhatsApp válido (somente números).");
      return;
    }

    const selecionados = Array.from(document.querySelectorAll(".chkProduto"))
      .filter(chk => chk.checked)
      .map(chk => produtosVenda[chk.dataset.index]);

    if (selecionados.length === 0) {
      alert("Selecione pelo menos um produto para enviar.");
      return;
    }

    let mensagem = "*📦 Lista de Produtos para Venda:*\n\n";
    selecionados.forEach((p, i) => {
      const valor = p.valorVenda ? `R$ ${p.valorVenda}` : "—";
      mensagem += `${i + 1}. ${p.nome} (${p.validade || "sem validade"}) - ${valor}\n`;
    });

    const texto = encodeURIComponent(mensagem);
    const url = `https://wa.me/55${numero}?text=${texto}`;
    window.open(url, "_blank");
  });

  // Carrega produtos ao abrir
  carregarProdutosVenda();
});
