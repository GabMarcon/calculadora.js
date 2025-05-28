// Espera o DOM (Document Object Model - a estrutura HTML) estar completamente carregado
document.addEventListener("DOMContentLoaded", () => {
  // Seleciona os elementos do HTML que vamos usar
  const visorAnteriorElemento = document.getElementById("visor-anterior");
  const visorAtualElemento = document.getElementById("visor-atual");
  const botoesNumero = document.querySelectorAll("[data-numero]");
  const botoesOperador = document.querySelectorAll("[data-operador]"); // Inclui o botão de %
  const botaoIgual = document.getElementById("botao-igual");
  const botaoDelete = document.getElementById("botao-del");
  const botaoAC = document.getElementById("botao-ac");

  // Variáveis para guardar o estado da calculadora
  let operandoAnterior = "";
  let operandoAtual = "0"; // Começa com '0' no visor
  let operacao = undefined;
  let calculoFeito = false; // Flag para saber se o último ato foi um cálculo (clique no '=')

  // --- FUNÇÕES PRINCIPAIS ---

  // Função para limpar tudo (All Clear)
  function limpar() {
    operandoAtual = "0";
    operandoAnterior = "";
    operacao = undefined;
    calculoFeito = false;
    atualizarVisor();
  }

  // Função para deletar o último dígito
  function deletar() {
    if (calculoFeito) return; // Não deleta se um cálculo acabou de ser feito
    operandoAtual = operandoAtual.toString().slice(0, -1);
    if (operandoAtual === "") {
      operandoAtual = "0"; // Se apagar tudo, volta para '0'
    }
    atualizarVisor();
  }

  // Função para adicionar um número ao operando atual
  function adicionarNumero(numero) {
    // Se um cálculo foi feito e um novo número é digitado, reseta o operando atual
    if (calculoFeito) {
      operandoAtual = "";
      calculoFeito = false;
    }
    // Evita múltiplos pontos decimais
    if (numero === "." && operandoAtual.includes(".")) return;
    // Se o visor está '0' e o número não é '.', substitui o '0'
    if (operandoAtual === "0" && numero !== ".") {
      operandoAtual = numero;
    } else {
      operandoAtual = operandoAtual.toString() + numero.toString();
    }
    atualizarVisor();
  }

  // Função para escolher uma operação
  function escolherOperacao(op) {
    if (operandoAtual === "" && operandoAnterior === "") return; // Nada a fazer se não há números

    // Se já existe uma operação anterior e um novo operador é clicado, calcula antes
    if (operandoAnterior !== "" && operandoAtual !== "") {
      calcular();
    }

    operacao = op;
    // Se o operando atual está vazio (ex: 5 * - ), não move nada ainda
    // Ou se o último ato foi um cálculo, usa o resultado como operando anterior
    if (operandoAtual !== "" || calculoFeito) {
      operandoAnterior = operandoAtual;
      operandoAtual = ""; // Limpa para o próximo número
    }
    calculoFeito = false; // Resetar flag, pois uma nova operação foi iniciada
    atualizarVisor();
  }

  // Função para realizar o cálculo
  function calcular() {
    let resultado;
    const anterior = parseFloat(operandoAnterior);
    const atual = parseFloat(operandoAtual);

    if (isNaN(anterior) || isNaN(atual)) return; // Não calcula se os números não são válidos

    switch (operacao) {
      case "+":
        resultado = anterior + atual;
        break;
      case "-":
        resultado = anterior - atual;
        break;
      case "*":
        resultado = anterior * atual;
        break;
      case "÷": // Usamos '÷' no display, mas podemos ter '/' como data-operador
      case "/": // Adicionando caso para '/' se o data-operador for '/'
        if (atual === 0) {
          alert("Não é possível dividir por zero!");
          limpar(); // Limpa a calculadora em caso de erro
          return;
        }
        resultado = anterior / atual;
        break;
      case "%":
        // Calcula a porcentagem do 'anterior' com base no 'atual'
        // Ex: 100 % 10 (10% de 100) = 10
        // Ex: 200 * 50 % (50% de 200) = 100
        resultado = anterior * (atual / 100);
        break;
      default:
        return; // Nenhuma operação válida
    }

    operandoAtual = formatarResultado(resultado);
    operacao = undefined;
    operandoAnterior = "";
    calculoFeito = true; // Indica que o último ato foi um cálculo
    atualizarVisor();
  }

  // Função para formatar o resultado (ex: evitar muitos decimais)
  function formatarResultado(numero) {
    // Se o número for muito pequeno ou muito grande, pode usar notação científica
    // Aqui, vamos apenas limitar as casas decimais para evitar números muito longos
    const numeroString = numero.toString();
    if (numeroString.includes(".")) {
      // Arredonda para um número razoável de casas decimais, ex: 5
      // Ou usa toFixed, mas cuidado com o tipo (string)
      // parseFloat(numero.toFixed(8)) pode ser uma boa aproximação
      if (numeroString.split(".")[1].length > 8) {
        return parseFloat(numero.toPrecision(10)); // Tenta manter 10 dígitos significativos
      }
    }
    return numeroString;
  }

  // Função para atualizar o visor
  function atualizarVisor() {
    visorAtualElemento.innerText = operandoAtual;
    if (operacao != null) {
      // Mostra o operando anterior e a operação
      visorAnteriorElemento.innerText = `${operandoAnterior} ${operacao}`;
    } else {
      visorAnteriorElemento.innerText = "";
    }
  }

  // --- EVENT LISTENERS (Escutadores de Eventos para os botões) ---

  // Para os botões de número
  botoesNumero.forEach((botao) => {
    botao.addEventListener("click", () => {
      adicionarNumero(botao.dataset.numero);
    });
  });

  // Para os botões de operador
  botoesOperador.forEach((botao) => {
    botao.addEventListener("click", () => {
      escolherOperacao(botao.dataset.operador);
    });
  });

  // Para o botão de igual
  botaoIgual.addEventListener("click", () => {
    if (operandoAnterior === "" || operandoAtual === "" || !operacao) return; // Só calcula se tiver tudo
    calcular();
  });

  // Para o botão AC (All Clear)
  botaoAC.addEventListener("click", limpar);

  // Para o botão DEL (Delete)
  botaoDelete.addEventListener("click", deletar);

  // Inicializa o visor ao carregar a página
  atualizarVisor();
});
