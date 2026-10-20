/* ============================================================
   script.js — AZ-900 Quiz Builder (Unofficial)
   Controls: rendering topic cards, one-question-at-a-time flow,
   instant feedback with highlight + explanation, and results.
   No frameworks. No backend. Reads QUESTIONS / TOPICS from questions.js.
   ============================================================ */

// Import quiz data (see questions.js).
import { TOPICS, QUESTIONS } from "./questions.js";
import "./style.css";

(function () {
  "use strict";

  /* ---------- DOM references (cached once) ---------- */
  const screens = {
    home:    document.getElementById("screen-home"),
    quiz:    document.getElementById("screen-quiz"),
    results: document.getElementById("screen-results"),
  };
  const topicListEl = document.getElementById("topic-list");
  const quizTopicEl = document.getElementById("quiz-topic");
  const quizScoreEl  = document.getElementById("quiz-score");
  const progressFillEl = document.getElementById("progress-fill");
  const progressLabelEl = document.getElementById("progress-label");
  const questionTextEl = document.getElementById("question-text");
  const optionsListEl  = document.getElementById("options-list");
  const feedbackEl     = document.getElementById("feedback");
  const feedbackVerdictEl = document.getElementById("feedback-verdict");
  const feedbackExplanationEl = document.getElementById("feedback-explanation");
  const nextBtn = document.getElementById("next-btn");
  const resultsScoreEl = document.getElementById("results-score");
  const resultsMessageEl = document.getElementById("results-message");
  const ringProgressEl = document.getElementById("ring-progress");
  const reviewSectionEl = document.getElementById("review-section");
  const reviewListEl = document.getElementById("review-list");
  const retryBtn = document.getElementById("retry-btn");
  const homeBtn  = document.getElementById("home-btn");

  /* ---------- App state ---------- */
  let currentTopic = null;   // topic key the user chose
  let quiz = null;           // current quiz session object (see startQuiz)

  /* ============================================================
     SCREEN SWITCHING
     ============================================================ */
  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("is-active"));
    screens[name].classList.add("is-active");
    // Move focus to the top of the screen for screen readers.
    screens[name].setAttribute("tabindex", "-1");
    screens[name].focus({ preventScroll: true });
    // Scroll to top between screens.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ============================================================
     HOME SCREEN
     ============================================================ */
  function renderTopics() {
    topicListEl.innerHTML = "";
    TOPICS.forEach((topic) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "topic-card";
      card.setAttribute("aria-label", "Start " + topic.title + " quiz");

      card.innerHTML =
        '<span class="topic-icon" aria-hidden="true">' + topic.icon + "</span>" +
        '<span class="topic-body">' +
          '<span class="topic-title">' + topic.title + "</span>" +
          '<span class="topic-desc">' + topic.description + "</span>" +
        "</span>";

      card.addEventListener("click", function () {
        startQuiz(topic.key);
      });
      topicListEl.appendChild(card);
    });
  }

  /* ============================================================
     QUIZ SCREEN
     ============================================================ */

  // Build a fresh quiz session for the chosen topic.
  function startQuiz(topicKey) {
    currentTopic = topicKey;
    // Pull only the questions for this topic. (New array so we never
    // accidentally mutate the original QUESTIONS data.)
    const topicQuestions = QUESTIONS.filter((q) => q.topic === topicKey);

    if (topicQuestions.length === 0) {
      // Graceful empty state if a topic has no questions yet.
      quizTopicEl.textContent = TOPICS.find((t) => t.key === topicKey).title;
      quizScoreEl.textContent = "Score: 0";
      progressFillEl.style.width = "0%";
      progressLabelEl.textContent = "No questions yet";
      questionTextEl.textContent =
        "There are no questions for this topic yet. Add some to questions.js.";
      optionsListEl.innerHTML = "";
      feedbackEl.hidden = true;
      showScreen("quiz");
      return;
    }

    quiz = {
      questions: topicQuestions,
      index: 0,          // current question (0-based)
      score: 0,          // correct answers so far
      missed: [],        // [{question, correctAnswer, explanation}]
    };

    const topicTitle = TOPICS.find((t) => t.key === topicKey).title;
    quizTopicEl.textContent = topicTitle;

    showScreen("quiz");
    renderQuestion();
  }

  // Build a shuffled list of options for a question while tracking
  // which one is correct. Returns [{ text, isCorrect }, ...].
  function shuffleOptions(q) {
    const items = q.options.map(function (text, i) {
      return { text: text, isCorrect: i === q.correctIndex };
    });
    // Fisher–Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
    }
    return items;
  }

  // Render the current question + options, reset feedback state.
  function renderQuestion() {
    const q = quiz.questions[quiz.index];
    const total = quiz.questions.length;
    const number = quiz.index + 1;

    // Progress bar + label + score
    progressFillEl.style.width = (quiz.index / total) * 100 + "%";
    progressLabelEl.textContent = "Question " + number + " of " + total;
    quizScoreEl.textContent = "Score: " + quiz.score;

    // Question text
    questionTextEl.textContent = q.question;

    // Options — shuffle them each time so the correct answer isn't
    // always in the same slot, but keep track of where it lands.
    const shuffled = shuffleOptions(q);
    quiz.currentShuffled = shuffled; // remember for handleAnswer

    optionsListEl.innerHTML = "";
    shuffled.forEach(function (item, i) {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option";
      // Letter marker A/B/C/D
      const letter = String.fromCharCode(65 + i);
      btn.innerHTML =
        '<span class="option-letter" aria-hidden="true">' + letter + "</span>" +
        '<span class="option-text">' + item.text + "</span>";
      btn.addEventListener("click", function () {
        handleAnswer(i);
      });
      li.appendChild(btn);
      optionsListEl.appendChild(li);
    });

    // Hide feedback until the user answers.
    feedbackEl.hidden = true;
    feedbackEl.classList.remove("feedback"); // re-add below to replay animation
  }

  // Called when the user picks an option.
  function handleAnswer(pickedIndex) {
    const q = quiz.questions[quiz.index];
    const shuffled = quiz.currentShuffled;
    const isCorrect = shuffled[pickedIndex].isCorrect;
    const correctIndex = shuffled.findIndex(function (item) {
      return item.isCorrect;
    });

    // Lock all options so only one answer can be chosen.
    const optionButtons = optionsListEl.querySelectorAll(".option");
    optionButtons.forEach(function (btn, i) {
      btn.disabled = true;
      if (i === correctIndex) {
        btn.classList.add("correct");
      }
      if (i === pickedIndex && !isCorrect) {
        btn.classList.add("wrong");
      }
    });

    // Update score and track missed questions for the review section.
    if (isCorrect) {
      quiz.score += 1;
    } else {
      quiz.missed.push({
        question: q.question,
        correctAnswer: shuffled[correctIndex].text,
        explanation: q.explanation,
      });
    }
    quizScoreEl.textContent = "Score: " + quiz.score;

    // Build the feedback block. The explanation in questions.js is
    // expected to cover BOTH why the right answer is right and why the
    // wrong options are wrong, so we display it verbatim.
    feedbackVerdictEl.textContent = isCorrect
      ? "Correct!"
      : "Not quite.";
    feedbackVerdictEl.className = "feedback-verdict " +
      (isCorrect ? "is-correct" : "is-wrong");

    feedbackExplanationEl.textContent = q.explanation;

    // Reveal feedback with animation. Re-adding the class restarts the
    // CSS animation so it plays every time, not just the first.
    feedbackEl.hidden = false;
    feedbackEl.classList.remove("feedback");
    // Force reflow so the class re-add triggers the keyframes again.
    void feedbackEl.offsetWidth;
    feedbackEl.classList.add("feedback");

    // Next button label changes on the last question.
    nextBtn.textContent = (quiz.index + 1 >= quiz.questions.length)
      ? "See results"
      : "Next";
  }

  // Advance to the next question or finish the quiz.
  function handleNext() {
    if (quiz.index + 1 < quiz.questions.length) {
      quiz.index += 1;
      renderQuestion();
    } else {
      // Fill the progress bar to full on completion.
      progressFillEl.style.width = "100%";
      showResults();
    }
  }

  /* ============================================================
     RESULTS SCREEN
     ============================================================ */
  function showResults() {
    const total = quiz.questions.length;
    const score = quiz.score;
    const pct = Math.round((score / total) * 100);

    resultsScoreEl.textContent = pct + "%";
    document.getElementById("results-score-sub").textContent =
      score + " of " + total + " correct";
    resultsMessageEl.textContent = messageFor(pct);

    // Animate the circular progress ring. Circumference = 2 * PI * r (r = 62).
    const circumference = 2 * Math.PI * 62;
    const offset = circumference * (1 - pct / 100);
    // Start empty, then transition to the filled amount after the screen shows.
    ringProgressEl.style.strokeDasharray = circumference.toFixed(2);
    ringProgressEl.style.strokeDashoffset = circumference.toFixed(2);
    // Pick a stroke color based on performance (blue -> green -> red bands).
    ringProgressEl.style.stroke = ringColorFor(pct);

    // Delay slightly so the screen transition runs first, then the ring fills.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        ringProgressEl.style.strokeDashoffset = offset.toFixed(2);
      });
    });

    // Review what you got wrong
    if (quiz.missed.length === 0) {
      reviewSectionEl.hidden = true;
      reviewListEl.innerHTML = "";
    } else {
      reviewSectionEl.hidden = false;
      reviewListEl.innerHTML = "";
      quiz.missed.forEach(function (item) {
        const div = document.createElement("div");
        div.className = "review-item";
        div.innerHTML =
          '<p class="q">' + item.question + "</p>" +
          '<p class="a">Correct answer: ' + item.correctAnswer + "</p>" +
          '<p class="e">' + item.explanation + "</p>";
        reviewListEl.appendChild(div);
      });
    }

    showScreen("results");
  }

  // Stroke color for the results ring, reflecting performance band.
  function ringColorFor(pct) {
    if (pct >= 80) return getComputedStyle(document.documentElement)
                       .getPropertyValue("--success-500").trim();
    if (pct < 50)  return getComputedStyle(document.documentElement)
                       .getPropertyValue("--error-500").trim();
    return getComputedStyle(document.documentElement)
              .getPropertyValue("--blue-500").trim();
  }

  // Encouraging, non-judgmental feedback message based on the score.
  function messageFor(pct) {
    if (pct === 100) return "Perfect! You've mastered this topic. On to the next.";
    if (pct >= 80)  return "Great work — you're in strong shape for the exam.";
    if (pct >= 60)  return "Good effort. A quick review and you'll be set.";
    if (pct >= 40)  return "You're on your way. Review the explanations and try again.";
    return "Every expert started here. Review, retry, and you'll improve.";
  }

  /* ============================================================
     BUTTON WIRING
     ============================================================ */
  nextBtn.addEventListener("click", handleNext);
  retryBtn.addEventListener("click", function () {
    startQuiz(currentTopic);
  });
  homeBtn.addEventListener("click", function () {
    showScreen("home");
  });

  /* ============================================================
     INIT
     ============================================================ */
  renderTopics();
  showScreen("home");
})();
