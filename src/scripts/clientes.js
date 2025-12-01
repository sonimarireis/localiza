// arquivo: clientes.js
const formCliente = document.getElementById('formCliente');
const listaClientes = document.getElementById('listaClientes');

async function carregarClientes() {
  const res = await fetch('http://localhost:3000/clientes');
  const clientes = await res.json();

  listaClientes.innerHTML = '';
  const hoje = new Date();

  clientes.forEach(cli => {
    const ultimaCompra = new Date(cli.ultimaCompra);
    const diffDias = (hoje - ultimaCompra) / (1000*60*60*24);

    const li = document.createElement('li');
    li.textContent = `${cli.nome} - CPF: ${cli.cpf} - Última compra: ${cli.ultimaCompra}`;
    if (diffDias > 14) li.style.color = 'red';
    listaClientes.appendChild(li);
  });
}

formCliente.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const cpf = document.getElementById('cpf').value;
  const ultimaCompra = new Date().toISOString().split('T')[0];

  try {
    const res = await fetch('http://localhost:3000/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, cpf, ultimaCompra })
    });
    const data = await res.json();
    alert(data.msg);
    formCliente.reset();
    carregarClientes();
  } catch (err) {
    console.error(err);
    alert('Erro ao cadastrar cliente.');
  }
});

carregarClientes();
