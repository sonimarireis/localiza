// produtos.js - arquivo completo e resiliente
document.addEventListener("DOMContentLoaded", () => {
  try {
    // Referências aos elementos HTML — checamos se existem
    const form = document.getElementById("product-form");
    const productsTable = document.getElementById("productsTable");
    const searchInput = document.getElementById("searchProducts");
    const filterCategory = document.getElementById("filterCategory");
    const btnLogout = document.getElementById("btnLogout");

    if (!form) throw new Error("Formulário com id 'product-form' não encontrado no HTML.");
    if (!productsTable) throw new Error("Elemento tbody com id 'productsTable' não encontrado no HTML.");

    // Carrega produtos do LocalStorage ou cria lista vazia
    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];

    // Guarda se estamos em modo edição e qual código está sendo editado
    let editingCodigo = null;

    // Renderiza a tabela
    function renderProducts(list) {
      productsTable.innerHTML = "";

      if (!Array.isArray(list) || list.length === 0) {
        productsTable.innerHTML =
          `<tr><td colspan="6" style="text-align:center;">Nenhum produto cadastrado.</td></tr>`;
        return;
      }

      list.forEach(produto => {
        const row = document.createElement("tr");

        const tdCodigo = document.createElement("td");
        tdCodigo.textContent = produto.codigo || "-";

        const tdNome = document.createElement("td");
        tdNome.textContent = produto.nome || "-";

        const tdEstoque = document.createElement("td");
        tdEstoque.textContent = produto.estoque || "-";

        const tdData = document.createElement("td");
        tdData.textContent = produto.data || "-";

        const tdValidade = document.createElement("td");
tdValidade.textContent = produto.validade || "-";

// 🔥 Destaca se estiver a menos de 7 dias do vencimento
if (produto.validade) {
  const hoje = new Date();
  
  // Tenta converter corretamente a string (input type="date" retorna AAAA-MM-DD)
  const partes = produto.validade.split("-");
  // Evita erro caso formato inesperado
  if (partes.length === 3) {
    const [ano, mes, dia] = partes.map(Number);
    const validade = new Date(ano, mes - 1, dia); // mês começa em 0 no JS

    // Zera hora pra evitar problemas de fuso horário
    validade.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);

    // Calcula diferença em dias
    const diffMs = validade - hoje;
    const diffDias = diffMs / (1000 * 60 * 60 * 24);

    if (diffDias <= 7 && diffDias >= 0) {
      tdValidade.classList.add("expirando");
    } else if (diffDias < 0) {
      tdValidade.classList.add("vencido");
    }
  }
        }
        
        const tdAcoes = document.createElement("td");
        tdAcoes.classList.add("actions");

        // Editar
        const btnEdit = document.createElement("button");
        btnEdit.type = "button";
        btnEdit.textContent = "Editar";
        btnEdit.classList.add("edit");
        btnEdit.addEventListener("click", () => {
          // Coloca os valores no formulário e marca modo edição
          document.getElementById("pDate").value = produto.data || "";
          document.getElementById("pCode").value = produto.codigo || "";
          document.getElementById("pName").value = produto.nome || "";
          document.getElementById("pMax").value = produto.estoque || "";
          document.getElementById("pExpiry").value = produto.validade || "";
          document.getElementById("pCategory").value = produto.categoria || "";

          // Mantém o código original para identificação durante a atualização
          editingCodigo = produto.codigo;
          // opcional: focar no nome para editar
          document.getElementById("pName").focus();
        });

        // Excluir
        const btnDelete = document.createElement("button");
        btnDelete.type = "button";
        btnDelete.textContent = "Excluir";
        btnDelete.classList.add("delete");
        btnDelete.addEventListener("click", () => {
          if (confirm(`Deseja excluir o produto "${produto.nome}"?`)) {
            produtos = produtos.filter(p => p.codigo !== produto.codigo);
            localStorage.setItem("produtos", JSON.stringify(produtos));
            renderProducts(produtos);
          }
        });

        tdAcoes.appendChild(btnEdit);
        tdAcoes.appendChild(btnDelete);

        row.appendChild(tdCodigo);
        row.appendChild(tdNome);
        row.appendChild(tdEstoque);
        row.appendChild(tdData);
        row.appendChild(tdValidade);
        row.appendChild(tdAcoes);

        productsTable.appendChild(row);
      });
    }

    // Render inicial
    renderProducts(produtos);

    // Função utilitária: pega valores do form
    function getFormValues() {
      return {
        data: document.getElementById("pDate")?.value || "",
        codigo: document.getElementById("pCode")?.value.trim() || "",
        nome: document.getElementById("pName")?.value.trim() || "",
        estoque: document.getElementById("pMax")?.value.trim() || "",
        validade: document.getElementById("pExpiry")?.value.trim() || "",
        categoria: document.getElementById("pCategory")?.value.trim() || ""
      };
    }

    // Garante que o botão de submit exista e seja do tipo correto.
    (function ensureSubmitButton() {
      const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
      if (!submitBtn) {
        // Se não existir, criamos um botão submit escondido para evitar que alguém tenha colocado type="button"
        const hidden = document.createElement("button");
        hidden.type = "submit";
        hidden.style.display = "none";
        form.appendChild(hidden);
      } else {
        // se existir, força seu type para submit (corrige markup errado)
        submitBtn.type = "submit";
      }
    })();

    // Tratamento do submit (cadastro / atualização)
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      try {
        const { data, codigo, nome, estoque, validade, categoria } = getFormValues();

        // Validações básicas
        if (!codigo) {
          alert("Preencha o campo Código.");
          document.getElementById("pCode").focus();
          return;
        }
        if (!nome) {
          alert("Preencha o campo Nome.");
          document.getElementById("pName").focus();
          return;
        }

        // Se estivermos em edição, atualiza o produto existente
        if (editingCodigo) {
          const idx = produtos.findIndex(p => p.codigo === editingCodigo);
          if (idx === -1) {
            alert("Produto para editar não foi encontrado (código original não existe).");
            editingCodigo = null;
            return;
          }

          // Se o código foi modificado para um que já existe (outro produto), impedir
          if (codigo !== editingCodigo && produtos.some(p => p.codigo === codigo)) {
            alert("Não é possível alterar para esse código: já existe outro produto com esse código.");
            return;
          }

          produtos[idx] = { data, codigo, nome, estoque, validade, categoria };
          editingCodigo = null; // sai do modo edição
        } else {
          // modo criação: evitar duplicidade de código
          if (produtos.some(p => p.codigo === codigo)) {
            alert("Código de produto já existe!");
            document.getElementById("pCode").focus();
            return;
          }
          produtos.push({ data, codigo, nome, estoque, validade, categoria });
        }

        // Salva e atualiza UI
        localStorage.setItem("produtos", JSON.stringify(produtos));
        renderProducts(produtos);
        form.reset();
      } catch (err) {
        console.error("Erro no submit:", err);
        alert("Ocorreu um erro ao tentar cadastrar/atualizar o produto. Veja o console.");
      }
    });

    // Busca
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const termo = searchInput.value.toLowerCase();
        const filtrados = produtos.filter(p => (p.nome || "").toLowerCase().includes(termo));
        renderProducts(filtrados);
      });
    }

    // Filtro por categoria
    if (filterCategory) {
      filterCategory.addEventListener("change", () => {
        const categoria = filterCategory.value;
        const filtrados = categoria ? produtos.filter(p => p.categoria === categoria) : produtos;
        renderProducts(filtrados);
      });
    }

    // Logout (se existir botão)
    if (btnLogout) {
      btnLogout.addEventListener("click", () => {
        localStorage.removeItem("usuarioLogado");
        window.location.href = "index.html";
      });
    }

    // Depuração: imprime no console o estado inicial
    console.info("produtos.js carregado corretamente. Produtos carregados:", produtos.length);
  } catch (error) {
    console.error("Erro ao inicializar produtos.js:", error);
    alert("Erro ao inicializar a página de produtos. Verifique o console (F12).");
  }
});
