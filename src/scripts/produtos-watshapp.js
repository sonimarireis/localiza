document.addEventListener("DOMContentLoaded", () => {
    const productSelect = document.getElementById("pwProductSelect");
    const priceInput = document.getElementById("pwPrice");
    const form = document.getElementById("product-whatsapp-form");
    const productListDiv = document.querySelector(".product-list");
    const btnWhatsapp = document.querySelector(".btn-send-whatsapp");
  
    // Puxa os produtos já cadastrados do localStorage da página produtos.html
    let products = JSON.parse(localStorage.getItem("produtos")) || [];
  
    // Se algum produto não tiver "price", define como 0
    products = products.map(p => ({ name: p.name, validade: p.validade, price: p.price || 0 }));
  
    // Preenche o select com os produtos existentes
    function populateSelect() {
      productSelect.innerHTML = '<option value="">Selecione um produto</option>';
      products.forEach((p, index) => {
        productSelect.innerHTML += `<option value="${index}">${p.name} - Validade: ${p.validade}</option>`;
      });
    }
  
    populateSelect();
  
    // Renderiza a lista de produtos na página
    function renderProductsList() {
      if (products.length === 0) {
        productListDiv.textContent = "Nenhum produto cadastrado.";
        return;
      }
  
      productListDiv.textContent = products
        .map(p => `${p.name} - Validade: ${p.validade} - R$ ${p.price.toFixed(2)}`)
        .join("\n");
    }
  
    renderProductsList();
  
    // Cadastro do preço
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const index = productSelect.value;
      const price = parseFloat(priceInput.value);
  
      if (index === "" || isNaN(price) || price < 0) {
        alert("Selecione um produto e digite um valor válido.");
        return;
      }
  
      products[index].price = price;
  
      // Salva produtos no localStorage da lista WhatsApp
      localStorage.setItem("productsWhatsapp", JSON.stringify(products));
  
      renderProductsList();
      form.reset();
    });
  
    // Enviar pelo WhatsApp
    btnWhatsapp.addEventListener("click", () => {
      const phone = "55519864673088"; // Número do cliente
      const message = encodeURIComponent(products.map(p => `${p.name} - Validade: ${p.validade} - R$ ${p.price.toFixed(2)}`).join("\n"));
      const url = `https://wa.me/${phone}?text=${message}`;
      window.open(url, "_blank");
    });
  }); // <-- fecha o DOMContentLoaded
  