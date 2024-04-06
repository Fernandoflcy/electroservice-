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

// Função para mostrar/ocultar texto adicional
function toggleTexto(id) {
  const textoCompleto = document.getElementById(id);
  textoCompleto.classList.toggle('hidden');
  textoCompleto.classList.toggle('fade-in');
}
// Função para alternar a visibilidade de uma seção e seu contêiner correspondente
function toggleSection(sectionId) {
  // Esconde todos os contêineres de conteúdo
  const contentContainers = document.querySelectorAll('.content-container');
  contentContainers.forEach(container => {
    container.classList.add('hidden');
  });

  // Mostra o contêiner de conteúdo da seção atual
  const currentSectionContainer = document.getElementById(sectionId + '-container');
  currentSectionContainer.classList.remove('hidden');
}