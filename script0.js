function maximize(element) {
  // Verifica se o elemento já está maximizado
  if (!element.classList.contains('maximized')) {
    // Adiciona a classe maximized para maximizar o elemento
    element.classList.add('maximized');
  } else {
    // Remove a classe maximized para restaurar o elemento ao tamanho original
    element.classList.remove('maximized');
  }
}