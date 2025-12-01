// arquivo: vendas.js
const formVenda = document.getElementById('formVenda');
const listaVendas = document.getElementById('listaVendas');

async function carregarVendas() {
  const res = await fetch('http://localhost:3000/vendas');
  const vendas = await res.json();

  listaVendas.innerHTML = '';
  vendas.forEach(v => {
    const li = document.createElement('li');
    li.textContent = `${v.produto} - Compra: R$${v.valorCompra} - Venda: R$${v.valorVenda} - Lucro: R$${v.lucro}`;
    listaVendas.appendChild(li);
  });
}

formVenda.addEventListener('submit', async (e) => {
  e.preventDefault();

  const produto = document.getElementById('produto').value;
  const valorCompra = parseFloat(document.getElementById('valorCompra').value);
  const valorVenda = parseFloat(document.getElementById('valorVenda').value);
  const lucro = valorVenda - valorCompra;

  try {
    const res = await fetch('http://localhost:3000/vendas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ produto, valorCompra, valorVenda, lucro, data: new Date().toISOString() })
    });
    const data = await res.json();
    alert(data.msg);
    formVenda.reset();
    carregarVendas();
  } catch (err) {
    console.error(err);
    alert('Erro ao registrar venda.');
  }
});

// Carrega vendas ao abrir a página
carregarVendas();
