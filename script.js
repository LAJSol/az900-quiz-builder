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
    bookmarks: document.getElementById("screen-bookmarks"),
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
  const bookmarkToggleEl = document.getElementById("bookmark-toggle");
  const topicChartBarsEl = document.getElementById("topic-chart-bars");
  const bookmarksBtn = document.getElementById("bookmarks-btn");
  const bookmarksCountEl = document.getElementById("bookmarks-count");
  const bookmarksListEl = document.getElementById("bookmarks-list");
  const bookmarksEmptyEl = document.getElementById("bookmarks-empty");
  const bookmarksBackBtn = document.getElementById("bookmarks-back-btn");
  const muteToggleBtn = document.getElementById("mute-toggle");
  const muteIconOn = document.getElementById("mute-icon-on");
  const muteIconOff = document.getElementById("mute-icon-off");
  const muteLabelEl = document.getElementById("mute-label");
  const themeToggleBtn = document.getElementById("theme-toggle");
  const themeIconLight = document.getElementById("theme-icon-light");
  const themeIconDark = document.getElementById("theme-icon-dark");
  const themeLabelEl = document.getElementById("theme-label");

  /* ---------- App state ---------- */
  let currentTopic = null;   // topic key the user chose
  let quiz = null;           // current quiz session object (see startQuiz)

  /* ---------- Audio feedback (Web Audio API) ---------- */
  const MUTE_KEY = "az900_muted_v1";
  let muted = false;
  let audioCtx = null;

  /* ---------- Confetti (canvas-based burst) ---------- */
  const CONFETTI_THRESHOLD = 80;   // celebrate scores >= 80%
  let confettiCanvas = null;
  let confettiCtx = null;
  let confettiParticles = [];
  let confettiRafId = null;

  function initConfettiCanvas() {
    if (!confettiCanvas) {
      confettiCanvas = document.createElement("canvas");
      confettiCanvas.id = "confetti-canvas";
      confettiCanvas.setAttribute("aria-hidden", "true");
      confettiCanvas.className = "confetti-canvas";
      document.body.appendChild(confettiCanvas);
      confettiCtx = confettiCanvas.getContext("2d");
    }
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
  }

  function startConfetti() {
    initConfettiCanvas();
    confettiCanvas.style.display = "block";
    confettiParticles = [];

    const colors = [
      "#2f7fe0", "#5b9bf0", "#1f9d57", "#f5a623",
      "#d8423a", "#88baef", "#c8f0d8", "#fff",
    ];
    const count = 140;
    const cx = confettiCanvas.width / 2;
    const cy = confettiCanvas.height / 3;

    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = 4 + Math.random() * 9;
      confettiParticles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        gravity: 0.28 + Math.random() * 0.1,
        size: 6 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        opacity: 1,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      });
    }

    if (confettiRafId) cancelAnimationFrame(confettiRafId);
    animateConfetti();
  }

  function animateConfetti() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    var alive = 0;
    for (var i = 0; i < confettiParticles.length; i++) {
      var p = confettiParticles[i];
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;
      if (p.y > confettiCanvas.height * 0.75) p.opacity -= 0.02;
      if (p.opacity <= 0) continue;
      alive++;

      confettiCtx.save();
      confettiCtx.globalAlpha = Math.max(0, p.opacity);
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate(p.rotation);
      confettiCtx.fillStyle = p.color;
      if (p.shape === "rect") {
        confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        confettiCtx.beginPath();
        confettiCtx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        confettiCtx.fill();
      }
      confettiCtx.restore();
    }

    if (alive > 0) {
      confettiRafId = requestAnimationFrame(animateConfetti);
    } else {
      confettiCanvas.style.display = "none";
      confettiRafId = null;
    }
  }

  function stopConfetti() {
    if (confettiRafId) cancelAnimationFrame(confettiRafId);
    confettiRafId = null;
    if (confettiCanvas) confettiCanvas.style.display = "none";
    confettiParticles = [];
  }

  // Resize handler keeps the canvas full-screen.
  window.addEventListener("resize", function () {
    if (confettiCanvas && confettiCanvas.style.display !== "none") {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  });

  /* ---------- Bookmarks (persisted in localStorage) ---------- */

  function loadMuted() {
    try { return localStorage.getItem(MUTE_KEY) === "1"; }
    catch (e) { return false; }
  }
  function saveMuted() {
    try { localStorage.setItem(MUTE_KEY, muted ? "1" : "0"); }
    catch (e) { /* ignore */ }
  }
  function getAudioCtx() {
    if (!audioCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    }
    return audioCtx;
  }
  // Play a short tone. freq in Hz, dur in seconds, type is the oscillator type.
  function playTone(freq, dur, type, gainVal) {
    if (muted) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    // Browsers suspend audio until a user gesture; resume if needed.
    if (ctx.state === "suspended") ctx.resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    gain.gain.value = gainVal == null ? 0.12 : gainVal;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    // Soft fade-out to avoid clicks.
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.start(now);
    osc.stop(now + dur);
  }
  // Correct: a bright ascending two-note chime.
  function playCorrectSound() {
    playTone(660, 0.12, "sine", 0.14);
    setTimeout(function () { playTone(880, 0.18, "sine", 0.14); }, 100);
  }
  // Wrong: a low, soft descending two-note buzz.
  function playWrongSound() {
    playTone(320, 0.16, "triangle", 0.12);
    setTimeout(function () { playTone(220, 0.22, "triangle", 0.12); }, 120);
  }
  function syncMuteUI() {
    muteToggleBtn.setAttribute("aria-pressed", muted ? "true" : "false");
    muteIconOn.hidden = muted;
    muteIconOff.hidden = !muted;
    muteLabelEl.textContent = muted ? "Sound off" : "Sound on";
  }
  function toggleMute() {
    muted = !muted;
    saveMuted();
    syncMuteUI();
  }

  /* ---------- Dark theme (persisted in localStorage) ---------- */
  const THEME_KEY = "az900_dark_theme_v1";
  let darkTheme = false;

  function loadDarkTheme() {
    try { return localStorage.getItem(THEME_KEY) === "1"; }
    catch (e) { return false; }
  }
  function saveDarkTheme() {
    try { localStorage.setItem(THEME_KEY, darkTheme ? "1" : "0"); }
    catch (e) { /* ignore */ }
  }
  function syncThemeUI() {
    document.body.classList.toggle("dark-theme", darkTheme);
    themeToggleBtn.setAttribute("aria-pressed", darkTheme ? "true" : "false");
    themeIconLight.hidden = darkTheme;
    themeIconDark.hidden = !darkTheme;
    themeLabelEl.textContent = darkTheme ? "Light mode" : "Dark mode";
  }
  function toggleTheme() {
    darkTheme = !darkTheme;
    saveDarkTheme();
    syncThemeUI();
  }

  /* ---------- Bookmarks (persisted in localStorage) ---------- */
  const BOOKMARK_KEY = "az900_bookmarks_v1";
  // Each bookmark: { id, topic, question, options, correctIndex, explanation }
  function loadBookmarks() {
    try { return JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function saveBookmarks(list) {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(list));
    updateBookmarksCount();
  }
  function updateBookmarksCount() {
    const n = loadBookmarks().length;
    bookmarksCountEl.textContent = n;
    bookmarksCountEl.hidden = n === 0;
  }
  function isBookmarked(q) {
    return loadBookmarks().some(function (b) { return b.id === q.id; });
  }
  function toggleBookmark(q) {
    const list = loadBookmarks();
    const i = list.findIndex(function (b) { return b.id === q.id; });
    if (i >= 0) list.splice(i, 1);
    else list.push({
      id: q.id, topic: q.topic, question: q.question,
      options: q.options, correctIndex: q.correctIndex,
      explanation: q.explanation,
    });
    saveBookmarks(list);
    return i < 0; // true if now bookmarked
  }

  /* ---------- Per-topic scores (persisted across quizzes) ---------- */
  const SCORES_KEY = "az900_topic_scores_v1";
  function loadTopicScores() {
    try { return JSON.parse(localStorage.getItem(SCORES_KEY) || "{}"); }
    catch (e) { return {}; }
  }
  function saveTopicScores(obj) {
    localStorage.setItem(SCORES_KEY, JSON.stringify(obj));
  }

  /* ============================================================
     SCREEN SWITCHING
     ============================================================ */
  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("is-active"));
    screens[name].classList.add("is-active");
    // Stop confetti when leaving the results screen.
    if (name !== "results") stopConfetti();
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
    TOPICS.forEach(function (topic) {
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
    updateBookmarksCount();
  }

  /* ============================================================
     BOOKMARKS SCREEN
     ============================================================ */
  function renderBookmarks() {
    const list = loadBookmarks();
    bookmarksListEl.innerHTML = "";
    if (list.length === 0) {
      bookmarksEmptyEl.hidden = false;
      return;
    }
    bookmarksEmptyEl.hidden = true;
    list.forEach(function (b) {
      const topicMeta = TOPICS.find(function (t) { return t.key === b.topic; });
      const div = document.createElement("div");
      div.className = "bookmark-item";
      div.innerHTML =
        '<span class="bi-topic">' + (topicMeta ? topicMeta.title : b.topic) + "</span>" +
        '<p class="bi-q">' + b.question + "</p>" +
        '<p class="bi-a">Correct answer: ' + b.options[b.correctIndex] + "</p>" +
        '<p class="bi-e">' + b.explanation + "</p>";
      const rm = document.createElement("button");
      rm.type = "button";
      rm.className = "bi-remove";
      rm.textContent = "Remove bookmark";
      rm.addEventListener("click", function () {
        const all = loadBookmarks().filter(function (x) { return x.id !== b.id; });
        saveBookmarks(all);
        renderBookmarks();
      });
      div.appendChild(rm);
      bookmarksListEl.appendChild(div);
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
    const topicQuestions = QUESTIONS.filter(function (q) { return q.topic === topicKey; });

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

    // Assign stable ids to each question for bookmark tracking.
    const withIds = topicQuestions.map(function (q, i) {
      return Object.assign({}, q, { id: topicKey + "-" + i });
    });

    quiz = {
      questions: withIds,
      index: 0,          // current question (0-based)
      score: 0,          // correct answers so far
      missed: [],        // [{question, correctAnswer, explanation}]
      topicScores: loadTopicScores(),   // persisted across quizzes
    };
    // Reset the current topic's score so this run replaces the previous one.
    quiz.topicScores[topicKey] = { correct: 0, total: 0 };

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

    // Bookmark toggle state for this question.
    bookmarkToggleEl.classList.remove("is-bookmarked");
    bookmarkToggleEl.setAttribute("aria-pressed", "false");
    if (isBookmarked(q)) {
      bookmarkToggleEl.classList.add("is-bookmarked");
      bookmarkToggleEl.setAttribute("aria-pressed", "true");
    }

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

    // Track per-topic score for the results chart.
    quiz.topicScores[q.topic].total += 1;
    if (isCorrect) quiz.topicScores[q.topic].correct += 1;

    // Subtle audio feedback.
    if (isCorrect) playCorrectSound();
    else playWrongSound();

    // Next button label changes on the last question.
    nextBtn.textContent = (quiz.index + 1 >= quiz.questions.length)
      ? "See results"
      : "Next";
  }

  // Bookmark toggle handler on the current question.
  bookmarkToggleEl.addEventListener("click", function () {
    if (!quiz || !quiz.questions[quiz.index]) return;
    const q = quiz.questions[quiz.index];
    const nowBookmarked = toggleBookmark(q);
    bookmarkToggleEl.classList.toggle("is-bookmarked", nowBookmarked);
    bookmarkToggleEl.setAttribute("aria-pressed", nowBookmarked ? "true" : "false");
  });

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

    // Per-topic score breakdown chart.
    saveTopicScores(quiz.topicScores);
    renderTopicChart();

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

    // Celebratory confetti for high scores.
    if (pct >= CONFETTI_THRESHOLD) {
      startConfetti();
    } else {
      stopConfetti();
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

  // Render the per-topic score breakdown on the results screen.
  // Shows one row per topic, with a colored bar and "X / Y" label.
  function renderTopicChart() {
    topicChartBarsEl.innerHTML = "";
    TOPICS.forEach(function (t) {
      const s = quiz.topicScores[t.key];
      const row = document.createElement("div");
      row.className = "topic-chart-row";
      const bar = document.createElement("div");
      bar.className = "topic-chart-track";
      const fill = document.createElement("div");
      fill.className = "topic-chart-fill";
      bar.appendChild(fill);
      const label = document.createElement("div");
      label.className = "topic-chart-label";
      const nameSpan = document.createElement("span");
      nameSpan.className = "topic-chart-name";
      nameSpan.textContent = t.title;
      const scoreSpan = document.createElement("span");
      scoreSpan.className = "topic-chart-score";
      scoreSpan.textContent = s ? (s.correct + " / " + s.total) : "0 / 0";
      label.appendChild(nameSpan);
      label.appendChild(scoreSpan);
      row.appendChild(label);
      row.appendChild(bar);
      topicChartBarsEl.appendChild(row);

      // Animate the fill in on the next frame so it grows from 0.
      const pct = s ? Math.round((s.correct / s.total) * 100) : 0;
      const band = pct >= 80 ? "is-good" : (pct >= 50 ? "is-mid" : "is-low");
      fill.classList.add(band);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          fill.style.width = pct + "%";
        });
      });
    });
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
  bookmarksBtn.addEventListener("click", function () {
    renderBookmarks();
    showScreen("bookmarks");
  });
  bookmarksBackBtn.addEventListener("click", function () {
    showScreen("home");
  });
  muteToggleBtn.addEventListener("click", toggleMute);
  themeToggleBtn.addEventListener("click", toggleTheme);

  /* ============================================================
     INIT
     ============================================================ */
  renderTopics();
  muted = loadMuted();
  syncMuteUI();
  darkTheme = loadDarkTheme();
  syncThemeUI();
  showScreen("home");
})();
