
(function () {
  "use strict";

  const $ = (selector) => document.querySelector(selector);
  const page = document.body.dataset.page;
  const messageBox = $("#form-message");

  function showMessage(message, type = "error") {
    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.className = `message show ${type}`;
  }

  function setLoading(button, loading, originalText) {
    if (!button) return;

    button.disabled = loading;
    button.textContent = loading ? "Aguarde..." : originalText;
  }

  // TEMA CLARO E ESCURO
  const savedTheme = localStorage.getItem("cloudquiz-theme") || "light";
  document.documentElement.dataset.theme = savedTheme;

  document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
    const updateLabel = () => {
      button.textContent =
        document.documentElement.dataset.theme === "dark"
          ? "☀ Tema"
          : "☾ Tema";
    };

    updateLabel();

    button.addEventListener("click", () => {
      const next =
        document.documentElement.dataset.theme === "dark"
          ? "light"
          : "dark";

      document.documentElement.dataset.theme = next;
      localStorage.setItem("cloudquiz-theme", next);
      updateLabel();
    });
  });

  // CONFIGURAÇÃO BACK4APP
  const config = window.CLOUDQUIZ_CONFIG;

  const configReady =
    config &&
    config.appId &&
    config.javascriptKey &&
    !config.appId.startsWith("COLOQUE_") &&
    !config.javascriptKey.startsWith("COLOQUE_");

  if (!window.Parse) {
    showMessage("Não foi possível carregar o Parse SDK.");
    return;
  }

  if (!configReady) {
    showMessage(
      "Configure o Application ID e a JavaScript Key no config.js. Nunca use a Master Key no navegador."
    );
    return;
  }

  Parse.initialize(config.appId, config.javascriptKey);
  Parse.serverURL =
    config.serverURL || "https://parseapi.back4app.com/";

  // LOGIN
  if (page === "login") {
    if (Parse.User.current()) {
      window.location.replace("index.html");
      return;
    }

    const form = $("#login-form");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const button = form.querySelector("button[type='submit']");
      const originalText = "Entrar na minha conta →";

      const username = $("#username").value.trim();
      const password = $("#password").value;

      setLoading(button, true, originalText);

      try {
        await Parse.User.logIn(username, password);
        window.location.href = "index.html";
      } catch (error) {
        showMessage(error.message || "Não foi possível entrar.");
      } finally {
        setLoading(button, false, originalText);
      }
    });

    $("#forgot-password").addEventListener("click", async (event) => {
      event.preventDefault();

      const email = window.prompt("Digite seu e-mail cadastrado:");

      if (!email) return;

      try {
        await Parse.User.requestPasswordReset(
          email.trim().toLowerCase()
        );

        showMessage(
          "Se o e-mail estiver cadastrado, você receberá as instruções.",
          "success"
        );
      } catch (error) {
        showMessage(error.message);
      }
    });
  }

  // CADASTRO
  if (page === "register") {
    if (Parse.User.current()) {
      window.location.replace("index.html");
      return;
    }

    const form = $("#register-form");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const button = form.querySelector("button[type='submit']");
      const originalText = "Criar minha conta →";

      const name = $("#name").value.trim();
      const email = $("#email").value.trim().toLowerCase();
      const username = $("#username").value.trim();
      const password = $("#password").value;

      if (password.length < 8) {
        showMessage("A senha precisa ter pelo menos 8 caracteres.");
        return;
      }

      setLoading(button, true, originalText);

      try {
        const user = new Parse.User();

        user.set("username", username);
        user.set("email", email);
        user.set("password", password);
        user.set("name", name);
        user.set("bestScore", 0);

        await user.signUp();

        window.location.href = "index.html";
      } catch (error) {
        showMessage(error.message || "Não foi possível criar sua conta.");
      } finally {
        setLoading(button, false, originalText);
      }
    });
  }

  // PAINEL E QUIZ
  if (page === "dashboard") {
    
// CARREGAR RANKING
async function loadRanking() {
  const rankingList = $("#ranking-list");
  const rankingMessage = $("#ranking-message");

  rankingList.innerHTML = "<p>Carregando ranking...</p>";
  rankingMessage.textContent = "";
  rankingMessage.className = "message";

  try {
    const query = new Parse.Query(Parse.User);

    query.greaterThan("bestScore", 0);
    query.descending("bestScore");
    query.limit(10);
    query.select("name", "bestScore", "username");

    const players = await query.find();
    console.log("Jogadores encontrados:", players.length);

players.forEach((player) => {
  console.log(
    player.get("name"),
    player.get("bestScore")
  );
});
    rankingList.innerHTML = "";

    if (players.length === 0) {
      rankingList.innerHTML =
        "<p>Ainda não existem pontuações no ranking.</p>";
      return;
    }

    players.forEach((player, index) => {
      const position = index + 1;

      const name =
        player.get("name") ||
        player.get("username") ||
        "Jogador";

      const points = Number(player.get("bestScore") || 0);

      const item = document.createElement("div");
      item.className = "ranking-item";

      const playerInfo = document.createElement("div");
      playerInfo.className = "ranking-player";

      const positionElement = document.createElement("strong");
      positionElement.className = "ranking-position";

      positionElement.textContent =
        position === 1 ? "🥇" :
        position === 2 ? "🥈" :
        position === 3 ? "🥉" :
        `${position}º`;

      const nameElement = document.createElement("span");
      nameElement.textContent = name;

      const pointsElement = document.createElement("strong");
      pointsElement.className = "ranking-points";
      pointsElement.textContent = `${points} pts`;

      playerInfo.appendChild(positionElement);
      playerInfo.appendChild(nameElement);

      item.appendChild(playerInfo);
      item.appendChild(pointsElement);

      rankingList.appendChild(item);
    });

  } catch (error) {
    console.error("Erro ao carregar ranking:", error);

    rankingList.innerHTML = "";

    rankingMessage.textContent =
      "Não foi possível carregar o ranking. Verifique as permissões da classe Users no Back4App.";

    rankingMessage.className = "message show error";
  }
}

    const user = Parse.User.current();

    if (!user) {
      window.location.replace("login.html");
      return;
    }
 const dashboardScreen = $("#dashboard-screen");
const categoryScreen = $("#category-screen");
const rankingScreen = $("#ranking-screen");
const quizScreen = $("#quiz-screen");
const resultScreen = $("#result-screen");

    const questionText = $("#question-text");
    const questionCategory = $("#question-category");
    const answerOptions = $("#answer-options");

    const questionCounter = $("#question-counter");
    const progressFill = $("#progress-fill");
    const currentPoints = $("#current-points");

    const nextButton = $("#next-question");

    const quizMessage = $("#quiz-message");
    const resultMessage = $("#result-message");

    let questions = [];
    let currentQuestion = 0;
    let correctAnswers = 0;
    let answered = false;

    // DADOS DO JOGADOR
    $("#player-name").textContent =
      user.get("name") || user.get("username") || "jogador";

    function updateBestScore() {
      $("#best-score").textContent =
        `${Number(user.get("bestScore") || 0)} pts`;
    }

    updateBestScore();

    // SAIR DA CONTA
    $("#logout-button").addEventListener("click", async () => {
      try {
        await Parse.User.logOut();
        window.location.replace("login.html");
      } catch (error) {
        showMessage(error.message || "Não foi possível sair da conta.");
      }
    });

    // MENSAGENS DO QUIZ
    function quizFeedback(message, type = "error") {
      quizMessage.textContent = message;
      quizMessage.className = `message show ${type}`;
    }

    function resultFeedback(message, type = "success") {
      resultMessage.textContent = message;
      resultMessage.className = `message show ${type}`;
    }

    // SORTEIO DAS PERGUNTAS
    function shuffle(array) {
      const shuffled = [...array];

      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffled[i], shuffled[j]] =
          [shuffled[j], shuffled[i]];
      }

      return shuffled;
    }

    
    // BUSCAR PERGUNTAS NO BACK4APP POR CATEGORIA
async function loadQuestions(category) {
  const query = new Parse.Query("Question");

  // Filtra pela matéria escolhida
  query.equalTo("category", category);

  query.limit(1000);

  const results = await query.find();

  const validQuestions = results.filter((question) => {
    const options = question.get("options");
    const correctIndex = Number(question.get("correctIndex"));

    return (
      typeof question.get("text") === "string" &&
      Array.isArray(options) &&
      options.length === 4 &&
      Number.isInteger(correctIndex) &&
      correctIndex >= 0 &&
      correctIndex < 4
    );
  });

  if (validQuestions.length < 10) {
    throw new Error(
      `Não existem 10 perguntas válidas cadastradas em ${category}.`
    );
  }

  return shuffle(validQuestions).slice(0, 10);
}

    // INICIAR PARTIDA
async function startQuiz(category) {
  dashboardScreen.classList.add("hidden");
  categoryScreen.classList.add("hidden");
  resultScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");

  quizMessage.className = "message";
  quizMessage.textContent = "";

  questionText.textContent = "Carregando perguntas...";
  answerOptions.innerHTML = "";
  nextButton.classList.add("hidden");

  try {
    questions = await loadQuestions(category);

    currentQuestion = 0;
    correctAnswers = 0;

    renderQuestion();

  } catch (error) {
    quizScreen.classList.add("hidden");
    categoryScreen.classList.remove("hidden");

    showMessage(
      error.message || "Não foi possível carregar as perguntas."
    );
  }
}
    // EXIBIR PERGUNTA
    function renderQuestion() {
      answered = false;

      const question = questions[currentQuestion];

      const options = question.get("options");

      questionText.textContent = question.get("text");
      questionCategory.textContent =
        question.get("category") || "Conhecimentos gerais";

      questionCounter.textContent =
        `Questão ${currentQuestion + 1} de 10`;

      progressFill.style.width =
        `${((currentQuestion + 1) / 10) * 100}%`;

      currentPoints.textContent =
        `Pontuação: ${correctAnswers * 10}`;

      quizMessage.className = "message";
      quizMessage.textContent = "";

      nextButton.classList.add("hidden");

      answerOptions.innerHTML = "";

      options.forEach((option, index) => {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "answer-option";
        button.textContent = option;
        button.dataset.index = index;

        button.addEventListener("click", () => {
          selectAnswer(index);
        });

        answerOptions.appendChild(button);
      });
    }

    // SELECIONAR RESPOSTA
    function selectAnswer(selectedIndex) {
      if (answered) return;

      answered = true;

      const question = questions[currentQuestion];

      const correctIndex =
        Number(question.get("correctIndex"));

      const buttons =
        answerOptions.querySelectorAll(".answer-option");

      buttons.forEach((button) => {
        const index = Number(button.dataset.index);

        button.disabled = true;

        if (index === correctIndex) {
          button.classList.add("correct");
        }

        if (
          index === selectedIndex &&
          selectedIndex !== correctIndex
        ) {
          button.classList.add("incorrect");
        }
      });

      if (selectedIndex === correctIndex) {
        correctAnswers++;

        quizFeedback("Muito bem! Você acertou! 🎉", "success");
      } else {
        quizFeedback("Não foi dessa vez! Vamos para a próxima.", "error");
      }

      currentPoints.textContent =
        `Pontuação: ${correctAnswers * 10}`;

      nextButton.textContent =
        currentQuestion === 9
          ? "Ver resultado →"
          : "Próxima questão →";

      nextButton.classList.remove("hidden");
    }

    // AVANÇAR PERGUNTA
    nextButton.addEventListener("click", () => {
      if (!answered) return;

      if (currentQuestion < 9) {
        currentQuestion++;
        renderQuestion();
      } else {
        finishQuiz();
      }
    });

    // FINALIZAR PARTIDA
    async function finishQuiz() {
      quizScreen.classList.add("hidden");
      resultScreen.classList.remove("hidden");

      const points = correctAnswers * 10;
      const wrongAnswers = 10 - correctAnswers;

      $("#final-score").textContent = points;
      $("#final-correct").textContent = correctAnswers;
      $("#final-wrong").textContent = wrongAnswers;

      resultMessage.className = "message";
      resultMessage.textContent = "";

      // REGISTRAR PARTIDA
      try {
        const match = new Parse.Object("Match");

        match.set("player", user);
        match.set("totalQuestions", 10);
        match.set("correctAnswers", correctAnswers);

        await match.save();

        // REGISTRAR PONTUAÇÃO
        const score = new Parse.Object("Score");

        score.set("player", user);
        score.set("match", match);
        score.set("points", points);

        await score.save();

        // ATUALIZAR MELHOR PONTUAÇÃO
        const bestScore = Number(user.get("bestScore") || 0);

        if (points > bestScore) {
          user.set("bestScore", points);

          await user.save();

          updateBestScore();
        }

        resultFeedback(
          "Sua partida foi salva com sucesso!",
          "success"
        );

      } catch (error) {
        console.error("Erro ao salvar partida:", error);

        resultFeedback(
          "Você terminou a partida, mas houve um problema ao salvar o resultado. Verifique as permissões das classes Match, Score e Users no Back4App.",
          "error"
        );
      }
    }

    // BOTÕES DO PAINEL

// Abrir escolha de categorias
$("#start-quiz").addEventListener("click", () => {
  dashboardScreen.classList.add("hidden");
  categoryScreen.classList.remove("hidden");
});

// Selecionar matéria com um clique
document.querySelectorAll(".category-card").forEach((button) => {
  button.addEventListener("click", async () => {
    if (button.disabled) return;

    const category = button.dataset.category;

    // Evita cliques repetidos
    document.querySelectorAll(".category-card").forEach((card) => {
      card.disabled = true;
    });

    await startQuiz(category);

    document.querySelectorAll(".category-card").forEach((card) => {
      card.disabled = false;
    });
  });
});

// Voltar da escolha de categorias
$("#back-category").addEventListener("click", () => {
  categoryScreen.classList.add("hidden");
  dashboardScreen.classList.remove("hidden");
});

// Jogar novamente: escolher matéria
$("#play-again").addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  categoryScreen.classList.remove("hidden");
});

// Voltar ao painel inicial
$("#back-dashboard").addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  dashboardScreen.classList.remove("hidden");
});

 // ABRIR RANKING
$("#open-ranking").addEventListener("click", async () => {
  dashboardScreen.classList.add("hidden");
  rankingScreen.classList.remove("hidden");

  await loadRanking();
});

// VOLTAR DO RANKING
$("#back-ranking").addEventListener("click", () => {
  rankingScreen.classList.add("hidden");
  dashboardScreen.classList.remove("hidden");
}); }
  
})();
