const levels = window.RITFIMI_LEVELS;
const app = document.querySelector("#app");
const headerInfo = document.querySelector("#header-info");
const homeButton = document.querySelector("#home-button");
const soundButton = document.querySelector("#sound-button");
const installButton = document.querySelector("#install-button");
const installDialog = document.querySelector("#install-dialog");
const dialogClose = document.querySelector("#dialog-close");
const dialogInstall = document.querySelector("#dialog-install");
const installInstructions = document.querySelector("#install-instructions");

const state = {
  level: 0,
  round: [],
  index: 0,
  typed: "",
  accentStarted: false,
  composing: false,
  locked: false,
  sound: localStorage.getItem("ritfimi-sound") !== "off",
};

let deferredInstallPrompt = null;

const keyboardRows = [
  [["1","1"],["2","2"],["3","3"],["4","4"],["5","5"],["6","6"],["7","7"],["8","8"],["9","9"],["0","0"],["Ö","ö"],["-","-"]],
  [["Q","q"],["W","w"],["E","e"],["R","r"],["T","t"],["Y","y"],["U","u"],["I","i"],["O","o"],["P","p"],["Ð","ð"],["´","acute"]],
  [["A","a"],["S","s"],["D","d"],["F","f"],["G","g"],["H","h"],["J","j"],["K","k"],["L","l"],["Æ","æ"],["'","'"]],
  [["⇧","shift","wide"],["<","<"],["Z","z"],["X","x"],["C","c"],["V","v"],["B","b"],["N","n"],["M","m"],[",",","],[".","."],["Þ","þ"],["⇧","shift","wide"]],
  [["bil","space","space"]],
];

const accented = {"á":"a","é":"e","í":"i","ó":"o","ú":"u","ý":"y","Á":"a","É":"e","Í":"i","Ó":"o","Ú":"u","Ý":"y"};
const shiftKeys = {"?":"'","!":"1",":":".","„":"2","“":"2",'"':"2"};

function escapeHtml(text) {
  return text.replace(/[&<>'"]/g, (char) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[char]);
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function savedProgress() {
  try { return JSON.parse(localStorage.getItem("ritfimi-progress")) || {}; }
  catch { return {}; }
}

function renderMenu() {
  state.locked = true;
  headerInfo.textContent = "Veldu stig";
  const progress = savedProgress();
  app.innerHTML = `
    <section class="hero">
      <h1>Hvar viltu byrja?</h1>
      <p>Veldu verkefni sem hentar þér. Framvindan vistast sjálfkrafa.</p>
    </section>
    <section class="level-grid" aria-label="Erfiðleikastig">
      ${levels.map((level, i) => `
        <button class="level-card" data-level="${i}">
          <span class="level-number" style="background:${level.color}">${i + 1}</span>
          <span class="level-copy">
            <strong>${escapeHtml(level.title)}</strong>
            <small>${escapeHtml(level.description)}</small>
            ${progress[i] ? `<span class="level-best">✓ ${progress[i]} lot${progress[i] === 1 ? "a" : "ur"} kláraðar</span>` : ""}
          </span>
          <span class="level-arrow" aria-hidden="true">›</span>
        </button>`).join("")}
    </section>`;
  app.querySelectorAll("[data-level]").forEach((button) => {
    button.addEventListener("click", () => startLevel(Number(button.dataset.level)));
  });
  app.focus();
}

function startLevel(levelIndex) {
  state.level = levelIndex;
  state.round = shuffle(levels[levelIndex].items).slice(0, 10);
  state.index = 0;
  state.typed = "";
  state.accentStarted = false;
  state.composing = false;
  state.locked = false;
  renderPractice();
}

function targetText() { return state.round[state.index] || ""; }
function expectedChar() { return targetText()[state.typed.length] || ""; }

function expectedKeyIds() {
  const char = expectedChar();
  if (!char) return [];
  if (accented[char]) {
    if (!state.accentStarted) return ["acute"];
    return char === char.toUpperCase() ? [accented[char], "shift"] : [accented[char]];
  }
  if (char === " ") return ["space"];
  if (shiftKeys[char]) return ["shift", shiftKeys[char]];
  if (/[A-ZÐÞÆÖ]/.test(char)) return [char.toLowerCase(), "shift"];
  return [char.toLowerCase()];
}

function keyboardHtml() {
  return `<div class="keyboard" aria-label="Íslenskt lyklaborð">
    ${keyboardRows.map((row) => `<div class="key-row">${row.map(([label,id,size=""]) =>
      `<span class="key ${size}" data-key="${id}">${label}</span>`).join("")}</div>`).join("")}
  </div><p class="keyboard-hint">Guli takkinn sýnir hvað á að ýta á næst.</p>`;
}

function renderPractice() {
  const level = levels[state.level];
  headerInfo.textContent = `Stig ${state.level + 1} · ${level.title}`;
  app.innerHTML = `
    <div class="practice-top">
      <button class="link-button" id="back-button">‹ Til baka</button>
      <span class="progress-text">${state.index + 1} af 10</span>
    </div>
    <div class="progress-track"><div class="progress-fill" style="width:${state.index * 10}%"></div></div>
    <section class="practice-card">
      <p class="eyebrow">SKRIFAÐU</p>
      <h1 class="target">${escapeHtml(targetText())}</h1>
      <textarea class="typing-input" id="typing-input" rows="1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" aria-label="Skrifaðu textann hér"></textarea>
      <p class="feedback" id="feedback">Byrjaðu að skrifa</p>
    </section>
    <section class="keyboard-card">${keyboardHtml()}</section>`;

  app.querySelector("#back-button").addEventListener("click", renderMenu);
  const input = app.querySelector("#typing-input");
  input.addEventListener("keydown", handleKeyDown);
  input.addEventListener("beforeinput", handleBeforeInput);
  input.addEventListener("compositionstart", handleCompositionStart);
  input.addEventListener("compositionend", handleCompositionEnd);
  input.addEventListener("input", handleNativeInput);
  input.addEventListener("paste", (event) => event.preventDefault());
  input.addEventListener("drop", (event) => event.preventDefault());
  input.focus();
  resizeTypingArea(input);
  updateExpectedKeys();
}

function resizeTypingArea(input) {
  if (!input) return;
  const maxHeight = Math.min(240, Math.max(120, window.innerHeight * 0.3));
  input.style.height = "auto";
  const wantedHeight = Math.max(66, input.scrollHeight);
  input.style.height = `${Math.min(wantedHeight, maxHeight)}px`;
  input.style.overflowY = wantedHeight > maxHeight ? "auto" : "hidden";
  // Bendillinn er alltaf aftast þar sem aðeins réttur næsti stafur er leyfður.
  input.scrollTop = input.scrollHeight;
}

function handleKeyDown(event) {
  if (event.key === "Escape") { event.preventDefault(); renderMenu(); return; }
  if (["Shift","Control","Alt","Meta","CapsLock","Tab"].includes(event.key)) return;
  if (event.isComposing || state.composing || event.key === "Process") return;
  if (event.key === "Dead") {
    if (accented[expectedChar()] && !state.accentStarted) {
      // Ekki stöðva sjálfgefna hegðun. ChromeOS þarf hana til að hefja
      // composition og sameina broddinn við næsta sérhljóða.
      state.accentStarted = true;
      setFeedback("Núna kemur stafurinn", "good");
      updateExpectedKeys();
    } else {
      event.preventDefault();
      wrongKey();
    }
    return;
  }
  if (event.key.length === 1) {
    event.preventDefault();
    processCharacter(event.key);
  } else if (event.key === "Backspace" || event.key === "Delete" || event.key === "Enter") {
    event.preventDefault();
    wrongKey();
  }
}

function handleBeforeInput(event) {
  // ChromeOS þarf að fá að ljúka composition-atburðum fyrir broddstafi.
  if (event.isComposing || event.inputType.includes("Composition")) return;

  // beforeinput sér annars um sýndarlyklaborð í símum. keydown sér um tölvur.
  event.preventDefault();
  if (event.inputType === "insertText" && event.data) {
    for (const char of event.data) processCharacter(char);
  }
}

function handleCompositionStart() {
  state.composing = true;
  if (accented[expectedChar()] && !state.accentStarted) {
    state.accentStarted = true;
    setFeedback("Núna kemur stafurinn", "good");
    updateExpectedKeys();
  }
}

function handleCompositionEnd(event) {
  const input = app.querySelector("#typing-input");
  const composed = (event.data || "").normalize("NFC");
  state.composing = false;
  if (input) input.value = state.typed;
  if (!composed) return;

  const expected = expectedChar();
  const base = accented[expected];
  if (base && state.accentStarted) {
    const reportedBase = composed.replace(/[´'\u0301]/g, "");
    if (composed === expected || reportedBase === (expected === expected.toUpperCase() ? base.toUpperCase() : base)) {
      acceptCharacter(expected);
      return;
    }
    state.accentStarted = false;
    updateExpectedKeys();
    wrongKey();
    return;
  }

  for (const char of composed) processCharacter(char);
}

function handleNativeInput(event) {
  // Fjarlægir tímabundinn texta sem vafrinn setur sjálfur inn án þess að
  // leyfa röngum staf að sitja eftir í svarreitnum.
  if (!state.composing && !event.isComposing) event.target.value = state.typed;
  resizeTypingArea(event.target);
}

function processCharacter(char) {
  if (state.locked) return;
  const expected = expectedChar();
  if (!expected) return;

  if (char === '"' && (expected === "„" || expected === "“")) char = expected;
  if (char === expected) { acceptCharacter(expected); return; }

  // Varaleið fyrir ChromeOS-uppsetningar sem senda fyrst Dead og síðan
  // grunnstafinn í stað þess að skila samsetta stafnum í compositionend.
  if (state.accentStarted && accented[expected]) {
    const base = expected === expected.toUpperCase() ? accented[expected].toUpperCase() : accented[expected];
    if (char === base) { acceptCharacter(expected); return; }
    state.accentStarted = false;
    updateExpectedKeys();
    wrongKey();
    return;
  }

  if (accented[expected] && !state.accentStarted && (char === "´" || char === "'")) {
    state.accentStarted = true;
    setFeedback("Núna kemur stafurinn", "good");
    updateExpectedKeys();
    return;
  }
  wrongKey();
}

function acceptCharacter(char) {
  state.typed += char;
  state.accentStarted = false;
  const input = app.querySelector("#typing-input");
  if (!input) return;
  input.value = state.typed;
  input.setSelectionRange(input.value.length, input.value.length);
  resizeTypingArea(input);
  setFeedback("Flott! Haltu áfram.", "good");
  beep(560, .035);

  if (state.typed === targetText()) {
    state.locked = true;
    setFeedback("Rétt! Vel gert! ✓", "good");
    updateExpectedKeys([]);
    beep(760, .11);
    setTimeout(nextItem, 720);
  } else updateExpectedKeys();
}

function nextItem() {
  state.index += 1;
  if (state.index >= state.round.length) { renderFinish(); return; }
  state.typed = "";
  state.accentStarted = false;
  state.composing = false;
  state.locked = false;
  renderPractice();
}

function wrongKey() {
  setFeedback("Prófaðu takkann sem blikkar", "bad");
  beep(150, .08);
  const input = app.querySelector("#typing-input");
  input?.classList.remove("wrong");
  void input?.offsetWidth;
  input?.classList.add("wrong");
  document.querySelectorAll(".key.expected").forEach((key) => {
    key.classList.add("flash");
    setTimeout(() => key.classList.remove("flash"), 260);
  });
}

function setFeedback(text, className = "") {
  const feedback = app.querySelector("#feedback");
  if (feedback) { feedback.textContent = text; feedback.className = `feedback ${className}`; }
}

function updateExpectedKeys(ids = expectedKeyIds()) {
  const wanted = new Set(ids);
  app.querySelectorAll(".key").forEach((key) => key.classList.toggle("expected", wanted.has(key.dataset.key)));
}

function renderFinish() {
  state.locked = true;
  const progress = savedProgress();
  progress[state.level] = (progress[state.level] || 0) + 1;
  localStorage.setItem("ritfimi-progress", JSON.stringify(progress));
  headerInfo.textContent = `Stig ${state.level + 1} lokið`;
  app.innerHTML = `<section class="finish-card">
    <div class="finish-star">★</div>
    <h1>Vel gert!</h1>
    <p>Þú kláraðir 10 verkefni á stigi ${state.level + 1}.</p>
    <div class="button-row">
      <button class="primary-button" id="again-button">Æfa aftur</button>
      <button class="secondary-button" id="levels-button">Velja stig</button>
    </div>
  </section>`;
  app.querySelector("#again-button").addEventListener("click", () => startLevel(state.level));
  app.querySelector("#levels-button").addEventListener("click", renderMenu);
  beep(880, .18);
}

function beep(frequency, duration) {
  if (!state.sound) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  } catch { /* Hljóð er aðeins aukahlutur. */ }
}

function platformInstructions() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return `<ol><li>Opnaðu síðuna í Safari.</li><li>Ýttu á deilingartáknið <strong>□↑</strong>.</li><li>Veldu <strong>Bæta við heimaskjá</strong>.</li></ol>`;
  if (/Android/.test(ua)) return `<ol><li>Opnaðu valmynd vafrans <strong>⋮</strong>.</li><li>Veldu <strong>Setja upp app</strong> eða <strong>Bæta við heimaskjá</strong>.</li></ol>`;
  return `<ol><li>Ýttu á <strong>Setja upp núna</strong> hér fyrir neðan.</li><li>Ef hnappurinn virkar ekki skaltu velja uppsetningartáknið hægra megin í veffangastikunni.</li></ol>`;
}

async function requestInstall() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installDialog.close();
  } else {
    installInstructions.innerHTML = platformInstructions();
    dialogInstall.style.display = /iPhone|iPad|iPod|Android/.test(navigator.userAgent) ? "none" : "inline-block";
    installDialog.showModal();
  }
}

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
});
window.addEventListener("appinstalled", () => { deferredInstallPrompt = null; });

homeButton.addEventListener("click", renderMenu);
soundButton.addEventListener("click", () => {
  state.sound = !state.sound;
  localStorage.setItem("ritfimi-sound", state.sound ? "on" : "off");
  soundButton.textContent = state.sound ? "🔊" : "🔇";
  soundButton.setAttribute("aria-pressed", String(state.sound));
});
installButton.addEventListener("click", requestInstall);
dialogInstall.addEventListener("click", requestInstall);
dialogClose.addEventListener("click", () => installDialog.close());
installDialog.addEventListener("click", (event) => { if (event.target === installDialog) installDialog.close(); });

soundButton.textContent = state.sound ? "🔊" : "🔇";
renderMenu();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js"));
}
