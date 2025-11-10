document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("client-form");
    const clientsTable = document.getElementById("clientsTable");

    // Carrega clientes do LocalStorage ou cria array vazio
    let clients = JSON.parse(localStorage.getItem("clients")) || [];

    // Função para renderizar clientes na tabela
    function renderClients(list) {
        clientsTable.innerHTML = "";
        if (list.length === 0) {
            clientsTable.innerHTML = `<tr><td colspan="4" style="text-align:center;">Nenhum cliente cadastrado.</td></tr>`;
            return;
        }

        const now = new Date();

        list.forEach(client => {
            const lastPurchaseDate = new Date(client.lastPurchase);
            const diffTime = Math.abs(now - lastPurchaseDate);
            const diffWeeks = diffTime / (1000 * 60 * 60 * 24 * 7);

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

            // Botão excluir
            row.querySelector(".delete").addEventListener("click", () => {
                clients = clients.filter(c => c.phone !== client.phone);
                localStorage.setItem("clients", JSON.stringify(clients));
                renderClients(clients);
            });

            // Botão editar (preenche o form)
            row.querySelector(".edit").addEventListener("click", () => {
                document.getElementById("cName").value = client.name;
                document.getElementById("cAddress").value = client.address;
                document.getElementById("cPhone").value = client.phone;
                document.getElementById("cLastPurchase").value = client.lastPurchase;
            });
        });
    }

    // Primeiro render
    renderClients(clients);

    // Evento de submit do form
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    
        const name = document.getElementById("cName").value.trim();
        const address = document.getElementById("cAddress").value.trim();
        const lastPurchase = document.getElementById("cLastPurchase").value;
    
        // Pega telefone e remove tudo que não for número
        let phoneInput = document.getElementById("cPhone").value;
        const phone = phoneInput.replace(/\D/g, ''); // remove tudo que não for número
    
        // Validação: exatamente 9 ou 11 dígitos
        if (!(phone.length === 9 || phone.length === 11)) {
            alert("Telefone inválido! Digite exatamente 9 ou 11 números sem espaços ou traços.");
            return;
        }
    
        // Previne duplicidade pelo nome ou telefone
        if (clients.find(c => c.name.toLowerCase() === name.toLowerCase() || c.phone === phone)) {
            alert("Este cliente já está cadastrado!");
            return;
        }
    
        const newClient = { name, address, phone, lastPurchase };
        clients.push(newClient);
        localStorage.setItem("clients", JSON.stringify(clients));
    
        renderClients(clients);
        form.reset();
    });
    

    // Botão limpar
    form.addEventListener("reset", () => {
        form.reset();
    });
});
