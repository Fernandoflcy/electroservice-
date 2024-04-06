document.addEventListener('DOMContentLoaded', function() {
  // Adiciona evento de clique aos links da barra de navegação
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault(); // Impede o comportamento padrão de clicar em um link
      const targetId = this.getAttribute('href').substring(1); // Obtém o ID da seção de destino
      const targetSection = document.getElementById(targetId); // Obtém a seção de destino
      if (targetSection) {
        // Calcula a posição da seção de destino na página
        const offsetTop = targetSection.offsetTop;
        // Rola suavemente para a posição da seção de destino
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
});