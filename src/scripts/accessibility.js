// acessibilidade.js
let tamanho = 16; // tamanho inicial em px
const MIN = 10;
const MAX = 48;

function aplicarTamanho() {
  document.body.style.fontSize = tamanho + "px";
}

document.addEventListener('DOMContentLoaded', () => {
  // aplica tamanho inicial
  aplicarTamanho();

  // pega os botões pelo ID
  const btnAumentar = document.getElementById('aumentar');
  const btnDiminuir = document.getElementById('diminuir');

  if (btnAumentar) {
    btnAumentar.addEventListener('click', () => {
      if (tamanho < MAX) {
        tamanho += 2;
        aplicarTamanho();
      }
    });
  }

  if (btnDiminuir) {
    btnDiminuir.addEventListener('click', () => {
      if (tamanho > MIN) {
        tamanho -= 2;
        aplicarTamanho();
      }
    });
  }
});
