// clientes.js — versão estável e com debug no console
document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ clientes.js carregado com sucesso!");
  
    const form = document.getElementById("client-form");
    const clientsTable = document.getElementById("clientsTable");
  
    if (!form || !clientsTable) {
      console.error("❌ Elementos obrigatórios não encontrados no HTML.");
      return;
    }
  
    // 🔹 Usa sempre a mesma chave para evitar perda de dados
    let clients = JSON.parse(localStorage.getItem("clientes")) || [];
  
    function salvar() {
      localStorage.setItem("clientes", JSON.stringify(clients));
      console.log("💾 Clientes salvos:", clients);
    }
  
    function renderClients(list) {
      clientsTable.innerHTML = "";
  
      if (!list.length) {
        clientsTable.innerHTML = `<tr><td colspan="5" style="text-align:center;">Nenhum cliente cadastrado.</td></tr>`;
        return;
      }
  
      const now = new Date();
  
      list.forEach(client => {
        const lastPurchaseDate = new Date(client.lastPurchase);
        const diffWeeks = (now - lastPurchaseDate) / (1000 * 60 * 60 * 24 * 7);
  
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${client.name}</td>
          <td>${client.address}</td>
          <td>${client.phone}</td>
          <td style="color:${diffWeeks > 3 ? 'red' : 'black'}">${client.lastPurchase}</td>
          <td>
            <button class="edit">Editar</button>
            <button class="delete">Excluir</button>
          </td>
        `;
        clientsTable.appendChild(row);
  
        // Excluir
        row.querySelector(".delete").addEventListener("click", () => {
          if (confirm(`Excluir cliente ${client.name}?`)) {
            clients = clients.filter(c => c.phone !== client.phone);
            salvar();
            renderClients(clients);
          }
        });
  
        // Editar
        row.querySelector(".edit").addEventListener("click", () => {
          document.getElementById("cName").value = client.name;
          document.getElementById("cAddress").value = client.address;
          document.getElementById("cPhone").value = client.phone;
          document.getElementById("cLastPurchase").value = client.lastPurchase;
        });
      });
    }
  
    // Render inicial
    renderClients(clients);
  
    // Cadastrar cliente
    form.addEventListener("submit", e => {
      e.preventDefault();
  
      const name = document.getElementById("cName").value.trim();
      const address = document.getElementById("cAddress").value.trim();
      const phone = document.getElementById("cPhone").value.replace(/\D/g, "");
      const lastPurchase = document.getElementById("cLastPurchase").value;
  
      if (!(phone.length === 9 || phone.length === 11)) {
        alert("Telefone inválido! Digite exatamente 9 ou 11 números sem espaços ou traços.");
        return;
      }
  
      const existente = clients.find(
        c => c.name.toLowerCase() === name.toLowerCase() || c.phone === phone
      );
      if (existente) {
        alert("Este cliente já está cadastrado!");
        return;
      }
  
      clients.push({ name, address, phone, lastPurchase });
      salvar();
      renderClients(clients);
      form.reset();
    });
  
    // Botão limpar
    form.addEventListener("reset", () => {
      form.reset();
    });
  });
  