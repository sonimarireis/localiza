document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("product-form");
    const productsTable = document.getElementById("productsTable");
    const searchInput = document.getElementById("searchProducts");
    const filterCategory = document.getElementById("filterCategory");
  
    // Carrega produtos do LocalStorage ou cria array vazio
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
  
    // Função para renderizar produtos na tabela
    function renderProducts(list) {
      productsTable.innerHTML = "";
  
      if (list.length === 0) {
        productsTable.innerHTML = `<tr><td colspan="6" style="text-align:center;">Nenhum produto cadastrado.</td></tr>`;
        return;
      }
  
      list.forEach(produto => {
        const row = document.createElement("tr");
  
        // Cria células
        const tdCodigo = document.createElement("td");
        tdCodigo.textContent = produto.codigo;
  
        const tdNome = document.createElement("td");
        tdNome.textContent = produto.nome;
  
        const tdEstoque = document.createElement("td");
        tdEstoque.textContent = produto.estoque;
  
        const tdData = document.createElement("td");
        tdData.textContent = produto.data;
  
        const tdAcoes = document.createElement("td");
  
        // Botão Ver Validade
        const btnValidade = document.createElement("button");
        btnValidade.textContent = "Ver Validade";
        btnValidade.classList.add("validade");
        btnValidade.addEventListener("click", () => {
          if (produto.validade) {
            alert(`Produto: ${produto.nome}\nValidade: ${produto.validade}`);
          } else {
            alert(`Produto: ${produto.nome}\nValidade não cadastrada.`);
          }
        });
  
        // Botão Editar
        const btnEdit = document.createElement("button");
        btnEdit.textContent = "Editar";
        btnEdit.classList.add("edit");
        btnEdit.addEventListener("click", () => {
          document.getElementById("pDate").value = produto.data;
          document.getElementById("pCode").value = produto.codigo;
          document.getElementById("pName").value = produto.nome;
          document.getElementById("pMax").value = produto.estoque;
          document.getElementById("pExpiry").value = produto.validade || "";
          document.getElementById("pCategory").value = produto.categoria || "";
        });
  
        // Botão Excluir
        const btnDelete = document.createElement("button");
        btnDelete.textContent = "Excluir";
        btnDelete.classList.add("delete");
        btnDelete.addEventListener("click", () => {
          produtos = produtos.filter(p => p.codigo !== produto.codigo);
          localStorage.setItem("produtos", JSON.stringify(produtos));
          renderProducts(produtos);
        });
  
        // Adiciona botões à célula
        tdAcoes.appendChild(btnValidade);
        tdAcoes.appendChild(btnEdit);
        tdAcoes.appendChild(btnDelete);
  
        // Adiciona células à linha
        row.appendChild(tdCodigo);
        row.appendChild(tdNome);
        row.appendChild(tdEstoque);
        row.appendChild(tdData);
        row.appendChild(tdAcoes);
  
        // Adiciona linha à tabela
        productsTable.appendChild(row);
      });
    }
  
    // Render inicial
    renderProducts(produtos);
  
    // Cadastro de produto
    form.addEventListener("submit", (e) => {
      e.preventDefault();
  
      const data = document.getElementById("pDate").value;
      const codigo = document.getElementById("pCode").value.trim();
      const nome = document.getElementById("pName").value.trim();
      const estoque = document.getElementById("pMax").value;
      const validade = document.getElementById("pExpiry").value;
      const categoria = document.getElementById("pCategory").value;
  
      // Evita código duplicado
      if (produtos.find(p => p.codigo === codigo)) {
        alert("Código de produto já existe!");
        return;
      }
  
      const novoProduto = { data, codigo, nome, estoque, validade, categoria };
      produtos.push(novoProduto);
      localStorage.setItem("produtos", JSON.stringify(produtos));
  
      renderProducts(produtos);
      form.reset();
    });
  
    // Busca por nome
    searchInput.addEventListener("input", () => {
      const termo = searchInput.value.toLowerCase();
      const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
      renderProducts(filtrados);
    });
  
    // Filtrar por categoria
    filterCategory.addEventListener("change", () => {
      const categoria = filterCategory.value;
      const filtrados = categoria ? produtos.filter(p => p.categoria === categoria) : produtos;
      renderProducts(filtrados);
    });
  });
  
  const btnLogout = document.getElementById("btnLogout");

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("usuarioLogado"); // remove login
  window.location.href = "index.html";      // redireciona para Home
});
