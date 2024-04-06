const botaoIniciar = document.getElementById('botao-iniciar');
const containerQuiz = document.getElementById('container-quiz');
const elementoPergunta = document.getElementById('pergunta');
const elementoRespostas = document.getElementById('respostas');
const elementoFeedback = document.getElementById('feedback');
const elementoResultado = document.getElementById('resultado');
const elementoPontuacaoFinal = document.getElementById('pontuacao-final');
const elementoProgresso = document.getElementById('progresso');
const barraProgresso = document.createElement('div');
barraProgresso.id = 'barra-progresso';

const niveis = ['facil', 'medio', 'dificil'];
let nivelAtual = 'facil';
let indicePerguntaAtual = 0;
let pontuacao = 0;
let vidas = 3;
let feedbackMostrado = false;
let feedbackTimeout;
let perguntasDoNivel = [];

// Função para embaralhar as perguntas
function embaralharPerguntas() {
  for (let i = perguntasDoNivel.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [perguntasDoNivel[i], perguntasDoNivel[j]] = [perguntasDoNivel[j], perguntasDoNivel[i]];
  }
}

// Função para reproduzir som de resposta correta
function reproduzirSomCorreto() {
  const audioCorreto = document.getElementById('audio-correto');
  audioCorreto.play();
}

// Função para reproduzir som de resposta incorreta
function reproduzirSomIncorreto() {
  const audioIncorreto = document.getElementById('audio-incorreto');
  audioIncorreto.play();
}

botaoIniciar.addEventListener('click', () => iniciarNivel(nivelAtual));

function mostrarFeedback(mensagem, cor) {
  elementoFeedback.innerText = mensagem;
  elementoFeedback.style.color = cor;
}

function iniciarNivel(nivel) {
  nivelAtual = nivel;
  indicePerguntaAtual = 0;
  pontuacao = 0;
  vidas = 3;
  elementoFeedback.innerText = '';
  const secaoIntroducao = document.getElementById('introducao');
  secaoIntroducao.classList.add('escondido');
  botaoIniciar.classList.add('escondido');
  containerQuiz.classList.remove('escondido');
  perguntasDoNivel = perguntas.filter(pergunta => pergunta.nivel === nivelAtual);
  embaralharPerguntas();
  mostrarPergunta();
  mostrarBarraProgresso();
}

function mostrarPergunta() {
  if (indicePerguntaAtual < perguntasDoNivel.length) {
    const pergunta = perguntasDoNivel[indicePerguntaAtual];
    elementoPergunta.innerText = pergunta.pergunta;
    elementoFeedback.innerText = '';
    elementoRespostas.innerHTML = '';
    pergunta.respostas.forEach(resposta => {
      const botao = criarBotaoResposta(resposta.texto);
      botao.addEventListener('click', () => selecionarResposta(resposta.correta, botao));
      elementoRespostas.appendChild(botao);
    });
  } else {
    finalizarNivel();
  }
}

function selecionarResposta(ehCorreta, botao) {
  const botoes = document.querySelectorAll('.botoes-resposta');
  botoes.forEach(b => {
    b.disabled = true;
  });

  const piscarInterval = setInterval(() => {
    botao.classList.toggle('piscar');
  }, 200);

  setTimeout(() => {
    clearInterval(piscarInterval);

    if (ehCorreta) {
      mostrarFeedback('Correto!', '#27ae60');
      pontuacao++;
      botao.style.backgroundColor = '#27ae60';
      reproduzirSomCorreto();
    } else {
      mostrarFeedback('Incorreto!', '#e74c3c');
      vidas--;
      botao.style.backgroundColor = '#e74c3c';
      reproduzirSomIncorreto();
    }

    setTimeout(() => {
      resetarCoresBotoes();

      if (indicePerguntaAtual < perguntasDoNivel.length) {
        indicePerguntaAtual++;
        mostrarPergunta();
        atualizarBarraProgresso();
      } else {
        finalizarNivel();
      }

      mostrarFeedback('', '');
    }, 1000);
  }, 1500);
}

function resetarCoresBotoes() {
  const botoes = document.querySelectorAll('.botoes-resposta');
  botoes.forEach(botao => {
    botao.style.backgroundColor = '#2196F3';
    botao.disabled = false;
  });
}

function mostrarBarraProgresso() {
  elementoProgresso.appendChild(barraProgresso);
  atualizarBarraProgresso();
}

function atualizarBarraProgresso() {
  const progressoPercentual = (indicePerguntaAtual / perguntasDoNivel.length) * 100;
  barraProgresso.style.width = progressoPercentual + '%';
}

function finalizarNivel() {
  containerQuiz.classList.add('escondido');
  elementoResultado.classList.remove('escondido');
  elementoPontuacaoFinal.innerText = pontuacao;

  if (feedbackTimeout) {
    clearTimeout(feedbackTimeout);
    feedbackTimeout = null;
  }

  if (feedbackMostrado) {
    feedbackMostrado = false;
    elementoResultado.classList.remove('feedback-menor-media');
    elementoResultado.innerHTML = '';
  }

  const mediaPontuacao = pontuacao / perguntasPorNivel;
  const mensagemScore = `Média: ${mediaPontuacao.toFixed(2)}<br>`;

  if (mediaPontuacao >= 5) {
    elementoResultado.innerHTML = `<p>${mensagemScore}Você foi aprovado!</p>`;
    setTimeout(() => iniciarProximoNivel(), 5000);
  } else {
    elementoResultado.innerHTML = `<p>${mensagemScore}Você foi reprovado.</p>`;
    feedbackMostrado = true;
    feedbackTimeout = setTimeout(() => {
      feedbackTimeout = null;
      indicePerguntaAtual -= perguntasDoNivel.length;
      mostrarPergunta();
      atualizarBarraProgresso();
      setTimeout(() => {
        iniciarNivel(nivelAtual);
        elementoResultado.classList.remove('feedback-menor-media');
        mostrarFeedback('', '');
      }, 5000);
    }, 5000);
  }
}
function iniciarProximoNivel() {
  const proximoNivelIndex = niveis.indexOf(nivelAtual) + 1;
  if (proximoNivelIndex < niveis.length) {
    iniciarNivel(niveis[proximoNivelIndex]);
  } else {
    elementoResultado.innerHTML = "<h2>Parabéns! Você concluiu todos os níveis!</h2>";
  }

  elementoFeedback.innerText = ''; // Limpa o feedback após o término do nível atual
}

const perguntasPorNivel = 10; // Defina o número de perguntas por n// Função para criar botões de resposta
function criarBotaoResposta(texto) {
  const botao = document.createElement('button');
  botao.innerText = texto;
  botao.classList.add('botoes-resposta');
  return botao;
}



const perguntas = [
  // Perguntas de nível fácil
 {
    nivel: 'facil',
    pergunta: "Qual é a unidade de medida da corrente elétrica?",
    respostas: [
      { texto: "Volt", correta: false },
      { texto: "Ampère", correta: true },
      { texto: "Watt", correta: false },
      { texto: "Ohm", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual componente elétrico armazena e libera energia?",
    respostas: [
      { texto: "Resistor", correta: false },
      { texto: "Capacitor", correta: true },
      { texto: "Transistor", correta: false },
      { texto: "Diodo", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é a unidade de medida da tensão elétrica?",
    respostas: [
      { texto: "Volt", correta: true },
      { texto: "Ampère", correta: false },
      { texto: "Watt", correta: false },
      { texto: "Ohm", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é o nome do fenômeno que ocorre quando a corrente elétrica passa por um condutor?",
    respostas: [
      { texto: "Efeito Joule", correta: false },
      { texto: "Efeito Capacitivo", correta: false },
      { texto: "Efeito Hall", correta: false },
      { texto: "Efeito Ohmico", correta: true }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é o nome do componente que controla o fluxo de corrente em um circuito?",
    respostas: [
      { texto: "Resistor", correta: false },
      { texto: "Capacitor", correta: false },
      { texto: "Transistor", correta: true },
      { texto: "Diodo", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é a cor do fio neutro em um circuito elétrico?",
    respostas: [
      { texto: "Vermelho", correta: false },
      { texto: "Preto", correta: false },
      { texto: "Azul", correta: true },
      { texto: "Verde", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é a cor do fio terra em um circuito elétrico?",
    respostas: [
      { texto: "Vermelho", correta: false },
      { texto: "Preto", correta: false },
      { texto: "Verde", correta: true },
      { texto: "Azul", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é o símbolo químico para o cobre?",
    respostas: [
      { texto: "Cb", correta: false },
      { texto: "Cu", correta: true },
      { texto: "Co", correta: false },
      { texto: "Cp", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é a unidade de medida da resistência elétrica?",
    respostas: [
      { texto: "Ohm", correta: true },
      { texto: "Ampère", correta: false },
      { texto: "Volt", correta: false },
      { texto: "Watt", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é o nome do componente elétrico que armazena carga?",
    respostas: [
      { texto: "Resistor", correta: false },
      { texto: "Capacitor", correta: true },
      { texto: "Indutor", correta: false },
      { texto: "Transistor", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é o nome da lei que descreve a relação entre a tensão, corrente e resistência em um circuito?",
    respostas: [
      { texto: "Lei de Ohm", correta: true },
      { texto: "Lei de Newton", correta: false },
      { texto: "Lei de Coulomb", correta: false },
      { texto: "Lei de Faraday", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é o nome do componente que permite o fluxo de corrente em um único sentido?",
    respostas: [
      { texto: "Diodo", correta: true },
      { texto: "Transistor", correta: false },
      { texto: "Resistor", correta: false },
      { texto: "Capacitor", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é a cor do fio fase em um circuito elétrico?",
    respostas: [
      { texto: "Azul", correta: false },
      { texto: "Vermelho", correta: true },
      { texto: "Verde", correta: false },
      { texto: "Preto", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é a unidade de medida da potência elétrica?",
    respostas: [
      { texto: "Watt", correta: true },
      { texto: "Ohm", correta: false },
      { texto: "Ampère", correta: false },
      { texto: "Volt", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é o nome do componente elétrico que controla o fluxo de corrente em um circuito?",
    respostas: [
      { texto: "Resistor", correta: false },
      { texto: "Transistor", correta: true },
      { texto: "Capacitor", correta: false },
      { texto: "Diodo", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é a unidade de medida da capacitância?",
    respostas: [
      { texto: "Farad", correta: true },
      { texto: "Henry", correta: false },
      { texto: "Volt", correta: false },
      { texto: "Ampère", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é o nome do componente que protege um circuito elétrico contra sobrecorrente?",
    respostas: [
      { texto: "Resistor", correta: false },
      { texto: "Transistor", correta: false },
      { texto: "Fusível", correta: true },
      { texto: "Capacitor", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é o nome do fenômeno que ocorre quando um ímã gera uma corrente elétrica em um circuito?",
    respostas: [
      { texto: "Efeito Joule", correta: false },
      { texto: "Efeito Capacitivo", correta: false },
      { texto: "Efeito Faraday", correta: true },
      { texto: "Efeito Ohmico", correta: false }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é o nome do componente que muda a direção da corrente alternada?",
    respostas: [
      { texto: "Retificador", correta: false },
      { texto: "Diodo", correta: false },
      { texto: "Transformador", correta: false },
      { texto: "Inversor", correta: true }
    ]
  },
  {
    nivel: 'facil',
    pergunta: "Qual é a unidade de medida da frequência?",
    respostas: [
      { texto: "Hertz", correta: true },
      { texto: "Watt", correta: false },
      { texto: "Ohm", correta: false },
      { texto: "Volt", correta: false }
    ]
  },
  // Mais perguntas de nível fácil aqui...


  // Perguntas de nível médio
  {
    nivel: 'medio',
    pergunta: "O que é um diodo?",
    respostas: [
      { texto: "Um dispositivo que permite a passagem de corrente em um único sentido", correta: true },
      { texto: "Um dispositivo que controla a tensão em um circuito", correta: false },
      { texto: "Um dispositivo que gera corrente elétrica", correta: false },
      { texto: "Um dispositivo que armazena energia elétrica", correta: false }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "Qual é a função de um amplificador operacional?",
    respostas: [
      { texto: "Converter corrente alternada em corrente contínua", correta: false },
      { texto: "Regular a tensão em um circuito", correta: false },
      { texto: "Amplificar sinais elétricos", correta: true },
      { texto: "Controlar a frequência de um circuito", correta: false }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é uma onda senoidal?",
    respostas: [
      { texto: "Uma onda que se propaga apenas em meios líquidos", correta: false },
      { texto: "Uma onda que se propaga apenas em meios gasosos", correta: false },
      { texto: "Uma onda que possui formato de seno", correta: false },
      { texto: "Uma onda que possui formato semelhante a um gráfico de seno", correta: true }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é uma corrente elétrica alternada?",
    respostas: [
      { texto: "Uma corrente elétrica que flui apenas em um sentido", correta: false },
      { texto: "Uma corrente elétrica que varia sua intensidade ao longo do tempo", correta: false },
      { texto: "Uma corrente elétrica que muda de direção periodicamente", correta: true },
      { texto: "Uma corrente elétrica que flui aleatoriamente", correta: false }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "Qual é a unidade de medida da potência elétrica?",
    respostas: [
      { texto: "Hertz", correta: false },
      { texto: "Watt", correta: true },
      { texto: "Ohm", correta: false },
      { texto: "Volt", correta: false }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é um motor elétrico?",
    respostas: [
      { texto: "Um dispositivo que gera energia elétrica", correta: false },
      { texto: "Um dispositivo que armazena energia elétrica", correta: false },
      { texto: "Um dispositivo que converte energia elétrica em energia mecânica", correta: true },
      { texto: "Um dispositivo que controla a tensão em um circuito", correta: false }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é uma resistência variável?",
    respostas: [
      { texto: "Uma resistência que muda de valor aleatoriamente", correta: false },
      { texto: "Uma resistência que não permite a passagem de corrente", correta: false },
      { texto: "Uma resistência cujo valor pode ser ajustado manualmente", correta: true },
      { texto: "Uma resistência que só funciona em circuitos paralelos", correta: false }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é a capacitância de um capacitor?",
    respostas: [
      { texto: "A medida da tensão máxima suportada pelo capacitor", correta: false },
      { texto: "A medida da corrente elétrica armazenada no capacitor", correta: false },
      { texto: "A medida da resistência oferecida pelo capacitor ao fluxo de corrente", correta: false },
      { texto: "A medida da quantidade de carga elétrica que o capacitor pode armazenar", correta: true }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é um circuito RL?",
    respostas: [
      { texto: "Um circuito que possui apenas resistores e indutores", correta: true },
      { texto: "Um circuito que possui apenas resistores e capacitores", correta: false },
      { texto: "Um circuito que possui apenas indutores e capacitores", correta: false },
      { texto: "Um circuito que não possui nenhum componente passivo", correta: false }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "Qual é a função de um transistor?",
    respostas: [
      { texto: "Armazenar energia elétrica", correta: false },
      { texto: "Controlar a intensidade de corrente em um circuito", correta: true },
      { texto: "Gerar corrente elétrica", correta: false },
      { texto: "Converter corrente alternada em corrente contínua", correta: false }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é um gerador elétrico?",
    respostas: [
      { texto: "Um dispositivo que gera energia mecânica a partir de energia elétrica", correta: false },
      { texto: "Um dispositivo que armazena energia elétrica", correta: false },
      { texto: "Um dispositivo que converte energia elétrica em energia térmica", correta: false },
      { texto: "Um dispositivo que gera energia elétrica a partir de energia mecânica", correta: true }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é um circuito RC?",
    respostas: [
      { texto: "Um circuito que possui apenas resistores e capacitores", correta: true },
      { texto: "Um circuito que possui apenas resistores e indutores", correta: false },
      { texto: "Um circuito que possui apenas indutores e capacitores", correta: false },
      { texto: "Um circuito que não possui nenhum componente passivo", correta: false }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é um circuito RLC?",
    respostas: [
      { texto: "Um circuito que possui apenas resistores e indutores", correta: false },
      { texto: "Um circuito que possui apenas resistores e capacitores", correta: false },
      { texto: "Um circuito que possui apenas indutores e capacitores", correta: false },
      { texto: "Um circuito que possui resistores, indutores e capacitores", correta: true }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é a frequência de ressonância em um circuito RLC?",
    respostas: [
      { texto: "A frequência na qual o circuito não possui corrente elétrica", correta: false },
      { texto: "A frequência na qual a corrente é máxima", correta: false },
      { texto: "A frequência na qual o circuito possui impedância infinita", correta: false },
      { texto: "A frequência na qual o circuito responde com máxima amplitude", correta: true }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é uma fonte de corrente?",
    respostas: [
      { texto: "Um dispositivo que gera uma corrente elétrica constante", correta: true },
      { texto: "Um dispositivo que gera uma tensão constante", correta: false },
      { texto: "Um dispositivo que armazena energia elétrica", correta: false },
      { texto: "Um dispositivo que controla a intensidade de corrente em um circuito", correta: false }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é uma ponte retificadora?",
    respostas: [
      { texto: "Um dispositivo que transforma corrente alternada em corrente contínua", correta: true },
      { texto: "Um dispositivo que regula a tensão em um circuito", correta: false },
      { texto: "Um dispositivo que amplifica sinais elétricos", correta: false },
      { texto: "Um dispositivo que gera energia elétrica", correta: false }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é um circuito integrado?",
    respostas: [
      { texto: "Um circuito que possui apenas resistores e capacitores", correta: false },
      { texto: "Um circuito que possui apenas indutores e capacitores", correta: false },
      { texto: "Um circuito que possui componentes ativos e passivos", correta: false },
      { texto: "Um circuito completo em um único chip", correta: true }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é a lei de Kirchhoff das correntes?",
    respostas: [
      { texto: "Uma lei que descreve a relação entre a tensão, corrente e resistência", correta: false },
      { texto: "Uma lei que descreve a relação entre a potência, tensão e corrente", correta: false },
      { texto: "Uma lei que descreve a conservação da energia em um circuito", correta: false },
      { texto: "Uma lei que descreve a conservação da corrente em um nó de um circuito", correta: true }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é a lei de Kirchhoff das tensões?",
    respostas: [
      { texto: "Uma lei que descreve a relação entre a tensão, corrente e resistência", correta: false },
      { texto: "Uma lei que descreve a relação entre a potência, tensão e corrente", correta: false },
      { texto: "Uma lei que descreve a conservação da energia em um circuito", correta: false },
      { texto: "Uma lei que descreve a conservação da tensão em um circuito", correta: true }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é um circuito equivalente?",
    respostas: [
      { texto: "Um circuito que possui apenas resistores", correta: false },
      { texto: "Um circuito que possui apenas indutores", correta: false },
      { texto: "Um circuito que possui apenas capacitores", correta: false },
      { texto: "Um circuito simplificado que representa as mesmas características elétricas de um circuito mais complexo", correta: true }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é a impedância?",
    respostas: [
      { texto: "A medida da resistência oferecida pelo capacitor ao fluxo de corrente", correta: false },
      { texto: "A medida da quantidade de carga elétrica que o capacitor pode armazenar", correta: false },
      { texto: "A medida da dificuldade que um circuito oferece à passagem da corrente alternada", correta: true },
      { texto: "A medida da capacidade de um circuito em armazenar energia elétrica", correta: false }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é um retificador de meia onda?",
    respostas: [
      { texto: "Um dispositivo que transforma corrente alternada em corrente contínua", correta: false },
      { texto: "Um dispositivo que regula a tensão em um circuito", correta: false },
      { texto: "Um dispositivo que amplifica sinais elétricos", correta: false },
      { texto: "Um dispositivo que retifica apenas metade do ciclo da corrente alternada", correta: true }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é um retificador de onda completa?",
    respostas: [
      { texto: "Um dispositivo que transforma corrente alternada em corrente contínua", correta: false },
      { texto: "Um dispositivo que regula a tensão em um circuito", correta: false },
      { texto: "Um dispositivo que amplifica sinais elétricos", correta: false },
      { texto: "Um dispositivo que retifica todo o ciclo da corrente alternada", correta: true }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é um relé?",
    respostas: [
      { texto: "Um dispositivo que controla a intensidade de corrente em um circuito", correta: false },
      { texto: "Um dispositivo que permite a passagem de corrente em um único sentido", correta: false },
      { texto: "Um dispositivo que gera energia elétrica", correta: false },
      { texto: "Um dispositivo eletromecânico que controla a abertura e o fechamento de circuitos elétricos", correta: true }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é um multímetro?",
    respostas: [
      { texto: "Um dispositivo que mede apenas a tensão elétrica", correta: false },
      { texto: "Um dispositivo que mede apenas a corrente elétrica", correta: false },
      { texto: "Um dispositivo que mede a resistência elétrica", correta: false },
      { texto: "Um dispositivo que mede múltiplas grandezas elétricas, como tensão, corrente e resistência", correta: true }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é um osciloscópio?",
    respostas: [
      { texto: "Um dispositivo que gera ondas senoidais", correta: false },
      { texto: "Um dispositivo que regula a intensidade de corrente em um circuito", correta: false },
      { texto: "Um dispositivo que mede a frequência de um sinal elétrico", correta: false },
      { texto: "Um dispositivo que exibe gráficos da variação de um sinal elétrico ao longo do tempo", correta: true }
    ]
  },
  {
    nivel: 'medio',
    pergunta: "O que é um fusível?",
    respostas: [
      { texto: "Um dispositivo que gera energia elétrica", correta: false },
      { texto: "Um dispositivo que amplifica sinais elétricos", correta: false },
      { texto: "Um dispositivo que regula a tensão em um circuito", correta: false },
      { texto: "Um dispositivo que protege um circuito contra correntes excessivas, queimando-se quando isso ocorre", correta: true }
    ]
  },
  // Mais perguntas de nível médio aqui...

  
















  // Perguntas de nível difícil
 {
    nivel: 'dificil',
    pergunta: "O que é a lei de Lenz?",
    respostas: [
      { texto: "Uma lei que descreve a relação entre a potência, tensão e corrente", correta: false },
      { texto: "Uma lei que descreve a conservação da energia em um circuito", correta: false },
      { texto: "Uma lei que descreve a indução eletromagnética", correta: false },
      { texto: "Uma lei que descreve o sentido da corrente induzida em um circuito", correta: true }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a autoindutância?",
    respostas: [
      { texto: "A propriedade de um circuito resistivo em gerar um campo magnético", correta: false },
      { texto: "A propriedade de um circuito capacitivo em gerar um campo elétrico", correta: false },
      { texto: "A propriedade de um circuito em oferecer resistência à passagem da corrente elétrica", correta: false },
      { texto: "A propriedade de um circuito em induzir uma corrente elétrica em si mesmo", correta: true }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a mutuaindutância?",
    respostas: [
      { texto: "A propriedade de um circuito em gerar uma corrente elétrica mutuamente induzida", correta: false },
      { texto: "A propriedade de um circuito em gerar uma tensão mutuamente induzida", correta: false },
      { texto: "A propriedade de um circuito em gerar um campo magnético mutuamente induzido", correta: false },
      { texto: "A propriedade de um circuito em induzir uma tensão em outro circuito", correta: true }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é um transformador?",
    respostas: [
      { texto: "Um dispositivo que transforma energia térmica em energia elétrica", correta: false },
      { texto: "Um dispositivo que transforma corrente alternada em corrente contínua", correta: false },
      { texto: "Um dispositivo que transforma energia mecânica em energia elétrica", correta: false },
      { texto: "Um dispositivo que transforma tensão e corrente alternada em diferentes níveis", correta: true }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a frequência natural de um circuito RLC em ressonância?",
    respostas: [
      { texto: "A frequência na qual o circuito não possui corrente elétrica", correta: false },
      { texto: "A frequência na qual a corrente é máxima", correta: true },
      { texto: "A frequência na qual o circuito possui impedância infinita", correta: false },
      { texto: "A frequência na qual o circuito responde com máxima amplitude", correta: false }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é um indutor de núcleo de ar?",
    respostas: [
      { texto: "Um indutor que utiliza um núcleo de ar como material dielétrico", correta: true },
      { texto: "Um indutor que utiliza um núcleo de ferro como material dielétrico", correta: false },
      { texto: "Um indutor que utiliza um núcleo de cobre como material dielétrico", correta: false },
      { texto: "Um indutor que utiliza um núcleo de papel como material dielétrico", correta: false }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a corrente de fuga?",
    respostas: [
      { texto: "A corrente elétrica que flui em um circuito quando a corrente principal está desligada", correta: false },
      { texto: "A corrente elétrica que flui através de um isolante", correta: true },
      { texto: "A corrente elétrica que flui em um circuito quando há um curto-circuito", correta: false },
      { texto: "A corrente elétrica que flui em um circuito quando há uma sobrecarga", correta: false }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é o efeito Joule?",
    respostas: [
      { texto: "O aquecimento de um condutor devido à passagem da corrente elétrica", correta: true },
      { texto: "A transformação de energia mecânica em energia elétrica", correta: false },
      { texto: "A emissão de elétrons de um material devido à incidência de luz", correta: false },
      { texto: "A geração de corrente elétrica em um circuito devido à indução eletromagnética", correta: false }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é um diodo Schottky?",
    respostas: [
      { texto: "Um diodo que emite luz quando polarizado", correta: false },
      { texto: "Um diodo que possui uma alta capacidade de armazenamento de carga", correta: false },
      { texto: "Um diodo que possui uma baixa tensão de polarização", correta: true },
      { texto: "Um diodo que é usado apenas em circuitos digitais", correta: false }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é um transistor de junção bipolar (BJT)?",
    respostas: [
      { texto: "Um transistor que utiliza junções Schottky", correta: false },
      { texto: "Um transistor que utiliza uma junção PN", correta: false },
      { texto: "Um transistor que utiliza uma junção PNP", correta: false },
      { texto: "Um transistor que utiliza uma junção PN ou NP", correta: true }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é um amplificador operacional?",
    respostas: [
      { texto: "Um amplificador que opera apenas em circuitos digitais", correta: false },
      { texto: "Um amplificador que opera apenas em circuitos analógicos", correta: false },
      { texto: "Um amplificador que possui uma alta impedância de entrada", correta: false },
      { texto: "Um amplificador de alta ganho e grande impedância de entrada utilizado em circuitos analógicos", correta: true }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a capacitância mútua?",
    respostas: [
      { texto: "A capacitância de um capacitor com mais de um dielétrico", correta: false },
      { texto: "A capacitância de um capacitor com mais de um eletrodo", correta: false },
      { texto: "A capacitância de um circuito que contém vários capacitores", correta: false },
      { texto: "A capacitância que resulta da influência de um capacitor em relação a outro", correta: true }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a resistência mútua?",
    respostas: [
      { texto: "A resistência de um resistor quando há mais de um fluxo de corrente", correta: false },
      { texto: "A resistência de um resistor em relação a outro resistor", correta: false },
      { texto: "A resistência de um material dielétrico quando há corrente elétrica", correta: false },
      { texto: "A resistência que resulta da influência de um resistor em relação a outro", correta: true }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a impedância mútua?",
    respostas: [
      { texto: "A impedância de um circuito quando há mais de um fluxo de corrente", correta: false },
      { texto: "A impedância de um circuito em relação a outro circuito", correta: false },
      { texto: "A impedância de um indutor quando há fluxo de corrente", correta: false },
      { texto: "A impedância que resulta da influência de um circuito em relação a outro", correta: true }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é um amplificador classe D?",
    respostas: [
      { texto: "Um amplificador que opera em circuitos digitais", correta: false },
      { texto: "Um amplificador que possui uma alta impedância de saída", correta: false },
      { texto: "Um amplificador que utiliza transistores de potência", correta: false },
      { texto: "Um amplificador que modula a amplitude de uma onda de sinal em um sinal PWM (Pulse Width Modulation)", correta: true }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é um conversor analógico-digital (ADC)?",
    respostas: [
      { texto: "Um dispositivo que converte sinais analógicos em sinais digitais", correta: true },
      { texto: "Um dispositivo que amplifica sinais analógicos", correta: false },
      { texto: "Um dispositivo que gera sinais analógicos a partir de sinais digitais", correta: false },
      { texto: "Um dispositivo que regula a intensidade de corrente em um circuito", correta: false }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a curva característica de um diodo?",
    respostas: [
      { texto: "Uma curva que relaciona a corrente e a tensão em um diodo", correta: true },
      { texto: "Uma curva que relaciona a corrente e a resistência em um diodo", correta: false },
      { texto: "Uma curva que relaciona a corrente e a capacitância em um diodo", correta: false },
      { texto: "Uma curva que relaciona a corrente e a indutância em um diodo", correta: false }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a resposta em frequência de um circuito?",
    respostas: [
      { texto: "A relação entre a frequência e a fase em um circuito", correta: false },
      { texto: "A relação entre a frequência e a amplitude em um circuito", correta: true },
      { texto: "A relação entre a frequência e a impedância em um circuito", correta: false },
      { texto: "A relação entre a frequência e a corrente em um circuito", correta: false }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a histerese em um circuito magnético?",
    respostas: [
      { texto: "A perda de energia em um circuito devido à resistência", correta: false },
      { texto: "A relação entre a corrente e a tensão em um circuito", correta: false },
      { texto: "A relação entre a magnetização e o campo magnético em um circuito", correta: true },
      { texto: "A relação entre a corrente e a impedância em um circuito", correta: false }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a equação de Maxwell para as equações do eletromagnetismo?",
    respostas: [
      { texto: "Um conjunto de equações que relacionam a corrente e a tensão em um circuito", correta: false },
      { texto: "Um conjunto de equações que descrevem o comportamento de um diodo", correta: false },
      { texto: "Um conjunto de equações que descrevem o comportamento de um transistor", correta: false },
      { texto: "Um conjunto de equações que relacionam o campo elétrico e o campo magnético", correta: true }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a matriz de impedância?",
    respostas: [
      { texto: "Uma matriz que relaciona a tensão e a corrente em um circuito", correta: true },
      { texto: "Uma matriz que relaciona a tensão e a potência em um circuito", correta: false },
      { texto: "Uma matriz que relaciona a tensão e a resistência em um circuito", correta: false },
      { texto: "Uma matriz que relaciona a tensão e a indutância em um circuito", correta: false }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a função de transferência de um circuito?",
    respostas: [
      { texto: "Uma função que relaciona a corrente e a tensão em um circuito", correta: false },
      { texto: "Uma função que relaciona a frequência e a impedância em um circuito", correta: true },
      { texto: "Uma função que relaciona a corrente e a resistência em um circuito", correta: false },
      { texto: "Uma função que relaciona a potência e a tensão em um circuito", correta: false }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a lei de Kirchhoff?",
    respostas: [
      { texto: "Uma lei que descreve a relação entre a potência, tensão e corrente em um circuito", correta: false },
      { texto: "Uma lei que descreve a relação entre a frequência e a amplitude em um circuito", correta: false },
      { texto: "Uma lei que descreve a conservação da energia em um circuito", correta: false },
      { texto: "Uma lei que descreve a conservação da carga e a conservação da energia em um circuito", correta: true }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é o fenômeno de Piezoeletricidade?",
    respostas: [
      { texto: "O fenômeno de geração de tensão em um material devido à deformação mecânica", correta: true },
      { texto: "O fenômeno de geração de corrente elétrica em um material devido à luz", correta: false },
      { texto: "O fenômeno de geração de corrente elétrica em um material devido ao calor", correta: false },
      { texto: "O fenômeno de geração de corrente elétrica em um material devido à exposição ao ar", correta: false }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a radioatividade?",
    respostas: [
      { texto: "O fenômeno de emissão de elétrons de um material devido à incidência de luz", correta: false },
      { texto: "O fenômeno de emissão de partículas alfa, beta e gama devido à desintegração nuclear", correta: true },
      { texto: "O fenômeno de geração de corrente elétrica em um material devido à exposição ao ar", correta: false },
      { texto: "O fenômeno de geração de tensão em um material devido à deformação mecânica", correta: false }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a Lei de Ampère?",
    respostas: [
      { texto: "Uma lei que descreve a relação entre a potência, tensão e corrente em um circuito", correta: false },
      { texto: "Uma lei que descreve a relação entre a frequência e a amplitude em um circuito", correta: false },
      { texto: "Uma lei que descreve a conservação da energia em um circuito", correta: false },
      { texto: "Uma lei que descreve a relação entre o campo magnético e a corrente elétrica", correta: true }
    ]
  },
  {
    nivel: 'dificil',
    pergunta: "O que é a Lei de Gauss?",
    respostas: [
      { texto: "Uma lei que descreve a relação entre a potência, tensão e corrente em um circuito", correta: false },
      { texto: "Uma lei que descreve a relação entre a frequência e a amplitude em um circuito", correta: false },
      { texto: "Uma lei que descreve a conservação da energia em um circuito", correta: false },
      { texto: "Uma lei que descreve a relação entre o campo elétrico e a carga elétrica", correta: true }
    ]
  }
  // Mais perguntas de nível difícil aqui...
];