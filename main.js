// variveis El elementos do DOM
const areaPrincipalEl = document.querySelector('[data-js="jogo-area"]');
const botaoIniciarEl = document.querySelector('[data-js="botao-iniciar"]');
const pontuacaoEl = document.querySelector('[data-js="score"]');
const botaoAumentarSpeedEl = document.querySelector(
  '[data-btn-speed="aumentar"]'
);
const botaoDiminuirSpeedEl = document.querySelector(
  '[data-btn-speed="diminuir"]'
);
const velocidadeEl = document.querySelector('[data-speed="velocidade"]');
const botaoAumentarTimerEl = document.querySelector(
  '[data-btn-timer="aumentar"]'
);
const botaoDiminuirTimerEl = document.querySelector(
  '[data-btn-timer="diminuir"]'
);
const timerEl = document.querySelector('[data-timer="timer"]');
const contagemEl = document.querySelector('[data-contagem="contagem"]');
const listaTituloEl = document.querySelector('[data-lista="title"]');
const botaoHistoricoEl = document.querySelector('[data-js="botao-historico"]');
const modalScreenEl = document.querySelector('[data-js="modal"]');
const botaoComoJogarEl = document.querySelector('[data-js="botao-ajuda"]');
const modalAjudaEl = document.querySelector('[data-js="como-jogar"]');
// variaveis

const coresBolhas = [
  'white',
  'tomato',
  'pink',
  'green',
  'yellow',
  'gray',
  'purple',
  'orange',
  'Teal',
];

// objeto pra controle geral do jogo e suas opções
const jogoControleTotal = (() => {
  let jogoObjeto = {
    start: 'sim',
    iniciouContagem: 'sim',
    idIntervalJogo: 0,
    idContagemRegresiva: 0,
    pontos: 0,
    erros: 0,
  };
  return {
    pontos: jogoObjeto.pontos,
    checarInicioGame: () => jogoObjeto.start,

    ativarInicioGame: () => {
      jogoObjeto.start = 'sim';
    },
    desativarInicioGame: () => {
      jogoObjeto.start = 'nao';
    },
    setarIdClearInterval: id => {
      jogoObjeto.idIntervalJogo = id;
      console.log('id' + jogoObjeto.idIntervalJogo);
    },

    setarIdContagem: id => {
      jogoObjeto.idContagemRegresiva = id;
    },

    paraJogoZerarTudo: () => {
      clearInterval(jogoObjeto.idIntervalJogo);
      clearInterval(jogoObjeto.idContagemRegresiva);
    },
    checarInicioContagem: () => jogoObjeto.iniciouContagem,

    ativiarIniciouContagem: () => {
      jogoObjeto.iniciouContagem = 'sim';
    },
    desativarInicioContagem: () => {
      jogoObjeto.iniciouContagem = 'nao';
    },
  };
})();

// controlar velocidade das bolhas
function controlarVelocidade() {
  botaoAumentarSpeedEl.addEventListener('click', e => {
    const velocAtual = Number(velocidadeEl.textContent);
    const velocidade = (velocAtual + 0.2).toFixed(1);
    velocidadeEl.textContent = velocidade;
  });

  botaoDiminuirSpeedEl.addEventListener('click', e => {
    const velocAtual = Number(velocidadeEl.textContent);
    const velocidade = (velocAtual - 0.2).toFixed(1);
    if (velocidade < 0.2) return;
    velocidadeEl.textContent = velocidade;
  });
}
controlarVelocidade();
// controlar timer menu
function controlarTimer() {
  botaoAumentarTimerEl.addEventListener('click', () => {
    const velocAtual = Number(timerEl.textContent);
    if (velocAtual === 60) return;
    timerEl.textContent = velocAtual + 10;
  });

  botaoDiminuirTimerEl.addEventListener('click', e => {
    const velocAtual = Number(timerEl.textContent);
    if (velocAtual === 10) return;
    timerEl.textContent = velocAtual - 10;
  });
}
controlarTimer();
//função que retorna a data e horario no momento que acaba a partida
const pegarDiaHoraHoje = () => {
  const timeStamp = new Date();
  const horas = timeStamp.getHours();
  const minutos = timeStamp.getMinutes();
  const segundos = timeStamp.getSeconds();
  const dia = timeStamp.getDay();
  const mes = timeStamp.getMonth() + 1;
  const ano = timeStamp.getFullYear();

  return [horas, minutos, segundos, dia, mes, ano];
};
// função que adiciona a partida no historico
const adicionarItemAoHistorico = segundosTimer => {
  const [horas, minutos, segundos, dia, mes, ano] = pegarDiaHoraHoje();

  const li = document.createElement('li');
  li.innerHTML = `<p>Partida jogada em: ${dia}/${mes}/${ano} as ${horas}:${minutos}:${segundos} </p>
  <span>Speed: ${velocidadeEl.textContent} </span>
  <span>| Timer: ${segundosTimer} segundos</span>
  <span>| ${pontuacaoEl.textContent}.</span>
  `;
  listaTituloEl.insertAdjacentElement('afterend', li);
};

// função parar limpar as bolhas
const limparBolhas = () => {
  const bolhasCriadasEl = document.querySelectorAll('[data-js="bolha"]');
  bolhasCriadasEl.forEach(item => item.remove());
};
// ativar o modal de historico
function mostrarHistorico() {
  botaoHistoricoEl.addEventListener('click', e => {
    modalScreenEl.classList.remove('hidden');
  });
}
mostrarHistorico();

// esconde o modal historico
const esconderHistorico = () => {
  modalScreenEl.addEventListener('click', e => {
    modalScreenEl.classList.add('hidden');
  });
};
esconderHistorico();

// ativa o modal de tutorial
const mostrarModalComoJogar = () => {
  botaoComoJogarEl.addEventListener('click', e => {
    modalAjudaEl.classList.remove('hidden');
  });
};
mostrarModalComoJogar();

// esconde o modal de tutorial
const esconderAjudaComoJogar = () => {
  modalAjudaEl.addEventListener('click', e => {
    modalAjudaEl.classList.add('hidden');
  });
};
esconderAjudaComoJogar();

function zerarGame(menuJogo, contagemElemento) {
  menuJogo.pontos = 0;
  menuJogo.paraJogoZerarTudo();
  menuJogo.ativarInicioGame();
  menuJogo.ativiarIniciouContagem();
  contagemElemento.textContent = '';
}
// função para o cronometro / cont. regressiva
function contagemRegressiva(segundos) {
  if (typeof segundos !== 'number') {
    segundos = 30;
  }
  const menuJogo = jogoControleTotal;
  let contagem = segundos;
  const checarStartTrue = menuJogo.checarInicioContagem();

  if (checarStartTrue === 'sim') {
    menuJogo.desativarInicioContagem();

    const idContagem = setInterval(() => {
      menuJogo.setarIdContagem(idContagem);
      contagemEl.textContent = `: ${contagem--} segundos`;

      if (contagem === -1) {
        adicionarItemAoHistorico(segundos);
        limparBolhas();
        zerarGame(menuJogo, contagemEl);
        contagemEl.textContent = 'acabou';
      }
    }, 1000);
  }
}

// função que dar o top e lef
function retornarTopELeft(topMedida, leftMedida) {
  const top = Math.round(Math.random(0) * topMedida);
  const left = Math.round(Math.random(0) * leftMedida);
  return [top, left];
}

// função que da limite de altura e largura bolhas
function setarMaximoTopLeft(bolhaElemento, topMaximo, leftMaximo) {
  bolhaElemento.style.top = `${topMaximo}px`;
  bolhaElemento.style.left = `${leftMaximo}px`;
}

// criar bolha
function criarElementoBolha(corEscolhida) {
  let bolhaEl = document.createElement('span');
  bolhaEl.dataset.js = 'bolha';
  bolhaEl.style.background = corEscolhida;

  return bolhaEl;
}
// função que controla as bolhas
function controlarBolhas(velocidade) {
  if (typeof velocidade !== 'number') {
    console.log('Velocidade passada não é um numero');
    velocidade = 1000;
  }

  const menuJogo = jogoControleTotal;
  const checarStartTrue = menuJogo.checarInicioGame();
  const larguraDaTela = window.screen.width;

  if (checarStartTrue === 'sim') {
    menuJogo.desativarInicioGame();

    const idSetInterval = setInterval(() => {
      menuJogo.setarIdClearInterval(idSetInterval);

      const IndexAleatorio = Math.round(
        Math.random(0) * (coresBolhas.length - 1)
      );
      const corEscolhida = coresBolhas[IndexAleatorio];
      const bolhaEl = criarElementoBolha(corEscolhida);

      if (larguraDaTela > 600) {
        const [top, left] = retornarTopELeft(340, 460);
        setarMaximoTopLeft(bolhaEl, top, left);
      } else {
        const [top, left] = retornarTopELeft(170, 280);
        setarMaximoTopLeft(bolhaEl, top, left);
      }
      areaPrincipalEl.appendChild(bolhaEl);
      bolhaEl.classList.add('bolhinha');
    }, velocidade);
  }
}

// função pra deletar as bolhas
function explodirBolha() {
  const menuJogo = jogoControleTotal;
  areaPrincipalEl.addEventListener('click', e => {
    const adicionarPonto = `SCORE: ${(menuJogo.pontos += 1)} pontos`;
    const bolhaContemClassBolhinha = e.target.classList.contains('bolhinha');
    let pontoNotificacao = document.createElement('span');
    const bolhaClidada = e.target;
    pontoNotificacao.textContent = '+1';
    setarMaximoTopLeft(pontoNotificacao, e.clientY - 20, e.clientX - 5);
    pontoNotificacao.classList.add('ponto-notificacao');

    if (bolhaContemClassBolhinha) {
      areaPrincipalEl.insertAdjacentElement('afterend', pontoNotificacao);
      bolhaClidada.remove();
      pontuacaoEl.textContent = adicionarPonto;
    }
    setTimeout(() => {
      pontoNotificacao.remove();
    }, 200);
  });
}
explodirBolha();
// iniciar o game / botao
function iniciarGame() {
  botaoIniciarEl.addEventListener('click', () => {
    const velocidadeMilisegundos = Number(velocidadeEl.textContent) * 1000;
    const segundosContagem = Number(timerEl.textContent);
    pontuacaoEl.textContent = `SCORE: 0 pontos`;

    controlarBolhas(velocidadeMilisegundos);
    contagemRegressiva(segundosContagem);
  });
}
iniciarGame();
