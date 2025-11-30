document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = localStorage.getItem("usuarioLogado");

  if (!usuarioLogado) {
    // Não deixa entrar!
    window.location.href = "/pages/index.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("client-form");
  const tableBody = document.getElementById("clientsTable");

  const inputCPF = document.getElementById("cCPF");

  // ========== MÁSCARA DE CPF ==========
  inputCPF.addEventListener("input", () => {
    let v = inputCPF.value.replace(/\D/g, ""); // remove tudo que não for número

    if (v.length > 11) v = v.slice(0, 11);

    // monta máscara
    if (v.length > 9) {
      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (v.length > 6) {
      v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (v.length > 3) {
      v = v.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    inputCPF.value = v;
  });

  // ========== VALIDAÇÃO DE CPF ==========
  function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false; // evita cpfs tipo 11111111111

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += cpf[i] * (10 - i);
    let dig1 = 11 - (soma % 11);
    if (dig1 > 9) dig1 = 0;

    if (dig1 != cpf[9]) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += cpf[i] * (11 - i);
    let dig2 = 11 - (soma % 11);
    if (dig2 > 9) dig2 = 0;

    return dig2 == cpf[10];
  }

  // ========== SALVAR CLIENTE ==========
  function salvarCliente(cliente) {
    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
    clientes.push(cliente);
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }

  // ========== RENDERIZAR TABELA ==========
  function carregarClientes() {
    tableBody.innerHTML = "";

    const clientes = JSON.parse(localStorage.getItem("clientes")) || [];

    clientes.forEach((cliente, index) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${cliente.nome}</td>
        <td>${cliente.endereco}</td>
        <td>${cliente.telefone}</td>
        <td>${cliente.cpf}</td>
        <td>${cliente.ultimaCompra}</td>
        <td>
          <button class="btn-excluir" data-index="${index}">Excluir</button>
        </td>
      `;

      // --- VERIFICAR DIAS SEM COMPRA ---
      const hoje = new Date();
      const ultimaCompra = new Date(cliente.ultimaCompra);

      const diffMs = hoje - ultimaCompra;
      const diffDias = diffMs / (1000 * 60 * 60 * 24);

      if (diffDias > 14) {
        tr.style.backgroundColor = "rgba(255, 0, 0, 0.25)"; // leve vermelho
        tr.style.fontWeight = "bold";
      }


      tableBody.appendChild(tr);
    });
  }

  // ========== EXCLUIR ==========
  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-excluir")) {
      const index = e.target.getAttribute("data-index");

      const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
      clientes.splice(index, 1);
      localStorage.setItem("clientes", JSON.stringify(clientes));

      carregarClientes();
    }
  });

  // ========== SUBMIT DO FORMULÁRIO ==========
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const cliente = {
      nome: document.getElementById("cName").value,
      endereco: document.getElementById("cAddress").value,
      telefone: document.getElementById("cPhone").value,
      cpf: inputCPF.value,
      ultimaCompra: document.getElementById("cLastPurchase").value
    };

    // valida CPF
    if (!validarCPF(cliente.cpf)) {
      alert("CPF inválido!");
      return;
    }

    salvarCliente(cliente);
    carregarClientes();
    form.reset();
  });

  carregarClientes(); // inicializa lista
});
