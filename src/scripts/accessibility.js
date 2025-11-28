// /src/scripts/accessibility.js
(function () {
    'use strict';
  
    const STORAGE_KEY = 'siteScale_v1';
    const STEP = 0.1;
    const MIN = 0.8;
    const MAX = 1.5;
  
    // IDs no HTML
    const wrapperId = 'zoomWrapper';
    const btnAumentarId = 'aumentar';
    const btnDiminuirId = 'diminuir';
  
    // espera o DOM (caso o script não tenha defer)
    function ready(fn) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
      } else {
        fn();
      }
    }
  
    ready(function () {
      const wrapper = document.getElementById(wrapperId);
      const btnAumentar = document.getElementById(btnAumentarId);
      const btnDiminuir = document.getElementById(btnDiminuirId);
  
      // verificação defensiva: se falta algo, log e sai sem quebrar a página
      if (!wrapper) {
        console.warn(`[accessibility] elemento com id="${wrapperId}" não encontrado. Verifique o HTML.`);
        return;
      }
      if (!btnAumentar || !btnDiminuir) {
        console.warn('[accessibility] botões de aumentar/diminuir não encontrados. IDs esperados:', btnAumentarId, btnDiminuirId);
        return;
      }
  
      // recuperar escala salva
      let escala = 1.0;
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) escala = Math.max(MIN, Math.min(MAX, parseFloat(saved)));
      } catch (e) {
        // localStorage pode estar bloqueado em alguns contextos; ignora se der erro
        console.info('[accessibility] localStorage indisponível, continuará sem salvar.');
      }
  
      // aplica transformação visual (scale) ao wrapper e atualiza estado dos botões
      function aplicarEscala() {
        wrapper.style.transform = `scale(${escala})`;
        wrapper.style.transformOrigin = 'top left';
        wrapper.style.transition = 'transform 150ms ease';
  
        btnAumentar.disabled = escala >= MAX;
        btnDiminuir.disabled = escala <= MIN;
  
        try { localStorage.setItem(STORAGE_KEY, String(escala)); } catch (e) { /* ignore */ }
        console.debug(`[accessibility] escala aplicada: ${escala}`);
      }
  
      function aumentar() {
        if (escala + STEP <= MAX) {
          escala = parseFloat((escala + STEP).toFixed(2));
          aplicarEscala();
        }
      }
  
      function diminuir() {
        if (escala - STEP >= MIN) {
          escala = parseFloat((escala - STEP).toFixed(2));
          aplicarEscala();
        }
      }
  
      // event listeners
      btnAumentar.addEventListener('click', function (e) {
        e.preventDefault();
        aumentar();
      });
  
      btnDiminuir.addEventListener('click', function (e) {
        e.preventDefault();
        diminuir();
      });
  
      // teclado (Enter/Space)
      [btnAumentar, btnDiminuir].forEach(btn => {
        btn.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            btn.click();
          }
        });
      });
  
      // aplica ao iniciar
      aplicarEscala();
      console.info('[accessibility] inicializado com sucesso.');
    });
  })();
  