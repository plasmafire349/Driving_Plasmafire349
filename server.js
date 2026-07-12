<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Ajokortti Quiz — Finnish Driving Theory</title>
<script src="/socket.io/socket.io.js"></script>
<style>
  :root {
    --navy: #0B2545;
    --navy-2: #13315C;
    --navy-3: #1B4173;
    --sign-yellow: #FFD400;
    --sign-red: #D7263D;
    --sign-blue: #1F6FEB;
    --white: #F7F9FC;
    --grey: #8CA0B3;
    --success: #2FBF71;
    --danger: #ff4d6d;
    --font-display: 'Arial Black', 'Helvetica Neue', system-ui, sans-serif;
    --font-body: -apple-system, 'Segoe UI', Roboto, sans-serif;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    min-height: 100vh;
    background:
      radial-gradient(ellipse at 20% -10%, #1e548c 0%, transparent 55%),
      radial-gradient(ellipse at 90% 110%, #7a1230 0%, transparent 45%),
      linear-gradient(180deg, #0B2545 0%, #061225 100%);
    background-attachment: fixed;
    font-family: var(--font-body);
    color: var(--white);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .card {
    width: 100%; max-width: 560px;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 24px;
    padding: 28px;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 30px 80px rgba(0,0,0,0.5);
  }
  h1 {
    font-family: var(--font-display);
    font-size: 26px; letter-spacing: 0.5px;
    margin: 0 0 4px;
    display: flex; align-items: center; gap: 12px;
  }
  .subtitle { color: var(--grey); margin-bottom: 22px; font-size: 14px; }
  .road-sign-mini {
    width: 44px; height: 44px;
    background: var(--sign-red);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(215,38,61,0.45);
  }
  input[type=text] {
    width: 100%; padding: 14px 16px;
    border-radius: 12px;
    border: 1.5px solid rgba(255,255,255,0.16);
    background: rgba(255,255,255,0.05);
    color: var(--white); font-size: 16px;
    margin-bottom: 12px; outline: none;
    transition: border-color .15s ease;
  }
  input[type=text]:focus { border-color: var(--sign-yellow); }
  input[type=text]::placeholder { color: var(--grey); }
  button {
    width: 100%; padding: 14px;
    border-radius: 12px; border: none;
    font-size: 16px; font-weight: 700;
    cursor: pointer; margin-bottom: 10px;
    transition: transform .1s ease, filter .15s ease, box-shadow .15s ease;
    font-family: var(--font-body);
  }
  button:hover:not(:disabled) { filter: brightness(1.08); }
  button:active:not(:disabled) { transform: scale(0.98); }
  .btn-primary { background: var(--sign-yellow); color: var(--navy); box-shadow: 0 6px 18px rgba(255,212,0,0.25); }
  .btn-secondary { background: transparent; color: var(--white); border: 1.5px solid rgba(255,255,255,0.25); }
  .btn-blue { background: var(--sign-blue); color: white; box-shadow: 0 6px 18px rgba(31,111,235,0.3); }
  .btn-red { background: var(--sign-red); color: white; box-shadow: 0 6px 18px rgba(215,38,61,0.3); }
  .hidden { display: none !important; }
  .row { display: flex; gap: 10px; }
  .row > * { flex: 1; }
  .room-code {
    font-family: var(--font-display);
    font-size: 44px; letter-spacing: 8px;
    text-align: center; color: var(--sign-yellow);
    margin: 6px 0 18px;
    text-shadow: 0 4px 24px rgba(255,212,0,0.35);
  }
  .players-list { list-style: none; padding: 0; margin: 0 0 18px; }
  .players-list li {
    display: flex; justify-content: space-between; align-items: center;
    padding: 10px 14px;
    background: rgba(255,255,255,0.06);
    border-radius: 10px; margin-bottom: 8px;
    font-weight: 600;
    animation: popIn 0.25s ease;
  }
  .players-list li.dead { opacity: .45; text-decoration: line-through; }
  .players-list li.me { border: 1.5px solid var(--sign-yellow); }
  @keyframes popIn { from { opacity:0; transform: translateY(6px);} to {opacity:1; transform:translateY(0);} }
  .score-pill { background: var(--sign-yellow); color: var(--navy); padding: 3px 10px; border-radius: 999px; font-size: 13px; font-weight: 700; }
  .streak-pill { background: rgba(255,77,109,0.2); color: var(--danger); border: 1px solid var(--danger); padding: 3px 8px; border-radius: 999px; font-size: 12px; margin-left: 6px; }
  .progress-track { width: 100%; height: 10px; border-radius: 999px; background: rgba(255,255,255,0.1); overflow: hidden; margin-bottom: 20px; }
  .progress-fill { height: 100%; background: linear-gradient(90deg, var(--sign-yellow), var(--sign-red)); width: 100%; }
  .q-header { display:flex; justify-content: space-between; align-items:center; margin-bottom:6px; }
  .q-label { color: var(--grey); font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; }
  .q-streak { color: var(--sign-yellow); font-size: 13px; font-weight: 700; }

  /* Question visuals */
  .q-visual {
    display: flex; justify-content: center; align-items: center;
    margin: 0 0 16px;
    min-height: 96px;
  }
  .q-emoji { font-size: 64px; line-height: 1; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.4)); }
  .sign {
    width: 92px; height: 92px;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display);
    font-size: 30px; font-weight: 900;
    box-shadow: 0 10px 24px rgba(0,0,0,0.4);
    position: relative;
  }
  .sign.circle { border-radius: 50%; border-width: 8px; border-style: solid; }
  .sign.square { border-radius: 10px; border-width: 4px; border-style: solid; }
  .sign.octagon { clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%); border: none; }
  .sign.triangle {
    background: transparent !important; box-shadow: none;
    width: 100px; height: 92px; position: relative;
  }
  .sign.triangle .tri-inner {
    position: absolute; inset: 0;
    clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
    display:flex; align-items:flex-end; justify-content:center;
    padding-bottom: 12px;
    font-size: 30px;
    filter: drop-shadow(0 8px 20px rgba(0,0,0,0.4));
  }
  .sign.triangle-down {
    background: transparent !important; box-shadow: none;
    width: 100px; height: 92px; position: relative;
  }
  .sign.triangle-down .tri-inner {
    position: absolute; inset: 0;
    clip-path: polygon(0% 0%, 100% 0%, 50% 100%);
    filter: drop-shadow(0 8px 20px rgba(0,0,0,0.4));
  }
  .sign.diamond {
    transform: rotate(45deg);
    width: 78px; height: 78px;
    border-width: 6px; border-style: solid;
  }
  .sign.diamond > span { transform: rotate(-45deg); }

  .question-text { font-size: 20px; font-weight: 700; margin-bottom: 18px; line-height: 1.4; }
  .option-btn {
    width: 100%; text-align: left;
    padding: 15px 16px; border-radius: 12px;
    border: 1.5px solid rgba(255,255,255,0.15);
    background: rgba(255,255,255,0.05);
    color: var(--white); font-size: 15px; font-weight: 600;
    margin-bottom: 10px; cursor: pointer;
    transition: all .15s ease;
    display: flex; align-items: center; gap: 12px;
  }
  .opt-letter {
    width: 28px; height: 28px; border-radius: 8px;
    background: rgba(255,255,255,0.12);
    display:flex; align-items:center; justify-content:center;
    font-family: var(--font-display); font-size: 14px;
    flex-shrink: 0;
  }
  .option-btn:hover:not(:disabled) { border-color: var(--sign-yellow); background: rgba(255,212,0,0.08); }
  .option-btn.selected { border-color: var(--sign-yellow); background: rgba(255,212,0,0.15); }
  .option-btn.correct { background: rgba(47,191,113,0.25); border-color: var(--success); color: white; }
  .option-btn.correct .opt-letter { background: var(--success); }
  .option-btn.wrong { background: rgba(215,38,61,0.25); border-color: var(--sign-red); color: white; }
  .option-btn.wrong .opt-letter { background: var(--sign-red); }
  .option-btn:disabled { cursor: default; }
  .feedback {
    text-align: center; font-size: 20px; font-weight: 800; margin: 4px 0 16px;
    animation: popIn 0.3s ease;
  }
  .feedback.good { color: var(--success); }
  .feedback.bad { color: var(--danger); }

  .mode-tabs { display:flex; gap:8px; margin-bottom: 14px; background: rgba(0,0,0,0.2); padding:4px; border-radius: 12px; }
  .mode-tabs button {
    margin: 0; padding: 10px; font-size: 14px; background: transparent; color: var(--grey);
    border-radius: 8px;
  }
  .mode-tabs button.active { background: var(--sign-yellow); color: var(--navy); }
  .mode-tabs button:hover { filter: none; }

  .podium { display: flex; align-items: flex-end; justify-content: center; gap: 14px; margin: 30px 0 20px; }
  .podium-spot { text-align: center; }
  .podium-bar {
    width: 76px; border-radius: 10px 10px 0 0;
    display: flex; align-items: flex-start; justify-content: center;
    padding-top: 8px; font-family: var(--font-display); font-size: 22px;
    animation: growUp 0.6s ease;
  }
  @keyframes growUp { from { height: 0 !important; } }
  .p1 .podium-bar { height: 140px; background: linear-gradient(180deg, var(--sign-yellow), #E0B200); color: var(--navy); }
  .p2 .podium-bar { height: 100px; background: linear-gradient(180deg, #C8D1DB, #97A5B2); color: var(--navy); }
  .p3 .podium-bar { height: 70px; background: linear-gradient(180deg, #CD8A4E, #A9682F); color: white; }
  .podium-name { font-weight: 700; margin-top: 8px; font-size: 14px; }
  .podium-score { color: var(--sign-yellow); font-size: 13px; }
  .confetti { position: fixed; top: -10px; width: 8px; height: 14px; opacity: .9; animation: fall linear forwards; z-index: 5; pointer-events:none; }
  @keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity: 1; } }
  .error-msg { color: var(--sign-yellow); background: rgba(215,38,61,0.25); border: 1px solid var(--sign-red); padding: 10px 14px; border-radius: 10px; margin-bottom: 14px; font-size: 14px; }
  .stripe { height: 4px; background: repeating-linear-gradient(90deg, var(--sign-yellow) 0 16px, transparent 16px 30px); border-radius: 4px; margin: 16px 0 20px; opacity: .6; }
  .final-score { text-align:center; font-family: var(--font-display); font-size: 42px; color: var(--sign-yellow); margin: 10px 0 6px; }
  .final-sub { text-align:center; color: var(--grey); margin-bottom: 18px; }
</style>
</head>
<body>

<div class="card" id="app">

  <!-- HOME -->
  <div id="view-home">
    <h1><span class="road-sign-mini">🚦</span> Ajokortti Quiz</h1>
    <div class="subtitle">Finnish driving theory — solo survival or race your friends</div>
    <div class="stripe"></div>
    <div id="home-error"></div>
    <input type="text" id="name-input" placeholder="Your name" maxlength="16" />

    <div class="mode-tabs">
      <button id="tab-classic" class="active" type="button">👥 Multiplayer</button>
      <button id="tab-solo" type="button">🎯 Solo survival</button>
    </div>

    <div id="pane-classic">
      <div class="mode-tabs">
        <button id="mode-classic" class="active" type="button">15 questions</button>
        <button id="mode-endless" type="button">Endless (until wrong)</button>
      </div>
      <button class="btn-primary" id="btn-create">Create a room</button>
      <input type="text" id="join-code-input" placeholder="Room code" maxlength="5" style="text-transform:uppercase" />
      <button class="btn-blue" id="btn-join">Join room</button>
    </div>

    <div id="pane-solo" class="hidden">
      <p style="color:var(--grey); font-size:14px; margin:0 0 14px;">
        Answer as many questions as you can. One wrong answer or timeout ends the run.
      </p>
      <button class="btn-primary" id="btn-solo">Start solo run</button>
    </div>
  </div>

  <!-- LOBBY -->
  <div id="view-lobby" class="hidden">
    <h1><span class="road-sign-mini">🏁</span> Lobby</h1>
    <div class="subtitle" id="lobby-mode-sub">Mode: 15 questions</div>
    <div class="room-code" id="lobby-code">-----</div>
    <ul class="players-list" id="lobby-players"></ul>
    <button class="btn-primary hidden" id="btn-start">Start game</button>
    <div id="lobby-wait-msg" class="subtitle" style="text-align:center;">Waiting for the host to start...</div>
  </div>

  <!-- QUESTION -->
  <div id="view-question" class="hidden">
    <div class="q-header">
      <div class="q-label" id="q-progress">Question 1</div>
      <div class="q-streak" id="q-streak"></div>
    </div>
    <div class="progress-track"><div class="progress-fill" id="timer-bar"></div></div>
    <div class="q-visual" id="q-visual"></div>
    <div class="question-text" id="q-text"></div>
    <div id="options-container"></div>
  </div>

  <!-- REVEAL -->
  <div id="view-reveal" class="hidden">
    <div class="feedback" id="reveal-feedback"></div>
    <div class="q-visual" id="reveal-visual" style="min-height:60px;"></div>
    <div class="question-text" id="reveal-q" style="font-size:16px; color:var(--grey);"></div>
    <div id="reveal-options"></div>
    <div class="subtitle" style="text-align:center; margin:14px 0 8px;">Standings</div>
    <ul class="players-list" id="reveal-players"></ul>
  </div>

  <!-- GAME OVER -->
  <div id="view-gameover" class="hidden">
    <h1 style="justify-content:center;"><span class="road-sign-mini">🏆</span> <span id="go-title">Game Over!</span></h1>
    <div id="solo-summary" class="hidden">
      <div class="final-score" id="solo-final-score">0</div>
      <div class="final-sub" id="solo-final-sub">You answered 0 questions correctly.</div>
    </div>
    <div id="podium-wrap">
      <div class="podium" id="podium"></div>
    </div>
    <ul class="players-list" id="final-players"></ul>
    <button class="btn-primary hidden" id="btn-again">Play again</button>
    <button class="btn-secondary" id="btn-home">Back to home</button>
  </div>

</div>

<script>
const socket = io();
let myCode = null;
let isHost = false;
let mySocketId = null;
let currentMode = 'classic';
let selectedMode = 'classic';   // classic|endless (for multiplayer)
let activeTab = 'classic';      // classic|solo
let lastQuestion = null;
let myChoice = null;

socket.on('connect', () => { mySocketId = socket.id; });

const views = ['home','lobby','question','reveal','gameover'];
function show(view) {
  views.forEach(v => document.getElementById('view-'+v).classList.toggle('hidden', v !== view));
}
function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
function showHomeError(msg) {
  document.getElementById('home-error').innerHTML = '<div class="error-msg">'+escapeHtml(msg)+'</div>';
}

// ---------- Tabs ----------
document.getElementById('tab-classic').onclick = () => switchTab('classic');
document.getElementById('tab-solo').onclick    = () => switchTab('solo');
function switchTab(t) {
  activeTab = t;
  document.getElementById('tab-classic').classList.toggle('active', t==='classic');
  document.getElementById('tab-solo').classList.toggle('active', t==='solo');
  document.getElementById('pane-classic').classList.toggle('hidden', t!=='classic');
  document.getElementById('pane-solo').classList.toggle('hidden', t!=='solo');
}
document.getElementById('mode-classic').onclick = () => setSelectedMode('classic');
document.getElementById('mode-endless').onclick = () => setSelectedMode('endless');
function setSelectedMode(m) {
  selectedMode = m;
  document.getElementById('mode-classic').classList.toggle('active', m==='classic');
  document.getElementById('mode-endless').classList.toggle('active', m==='endless');
}

// ---------- HOME actions ----------
document.getElementById('btn-create').onclick = () => {
  const name = document.getElementById('name-input').value.trim();
  if (!name) return showHomeError('Enter your name first.');
  socket.emit('createRoom', { name, mode: selectedMode });
};
document.getElementById('btn-join').onclick = () => {
  const name = document.getElementById('name-input').value.trim();
  const code = document.getElementById('join-code-input').value.trim();
  if (!name) return showHomeError('Enter your name first.');
  if (!code) return showHomeError('Enter a room code.');
  socket.emit('joinRoom', { code, name });
};
document.getElementById('btn-solo').onclick = () => {
  const name = document.getElementById('name-input').value.trim() || 'You';
  socket.emit('startSolo', { name });
};
document.getElementById('btn-home').onclick = () => {
  location.reload();
};

socket.on('errorMsg', (msg) => showHomeError(msg));

socket.on('roomCreated', ({ code, players, isHost: host, mode, solo }) => {
  myCode = code; isHost = host; currentMode = mode;
  if (solo) return; // solo: skip lobby, question will arrive shortly
  enterLobby(code, players);
});
socket.on('roomJoined', ({ code, players, isHost: host, mode }) => {
  myCode = code; isHost = host; currentMode = mode;
  enterLobby(code, players);
});

function enterLobby(code, players) {
  document.getElementById('lobby-code').textContent = code;
  document.getElementById('lobby-mode-sub').textContent =
    'Mode: ' + (currentMode === 'endless' ? 'Endless (until wrong)' : '15 questions');
  renderPlayers('lobby-players', players);
  document.getElementById('btn-start').classList.toggle('hidden', !isHost);
  document.getElementById('lobby-wait-msg').classList.toggle('hidden', isHost);
  show('lobby');
}

socket.on('lobbyUpdate', ({ players }) => renderPlayers('lobby-players', players));
socket.on('modeChanged', ({ mode }) => {
  currentMode = mode;
  document.getElementById('lobby-mode-sub').textContent =
    'Mode: ' + (mode === 'endless' ? 'Endless (until wrong)' : '15 questions');
});

document.getElementById('btn-start').onclick = () => socket.emit('startGame', myCode);

function renderPlayers(elId, players) {
  const el = document.getElementById(elId);
  el.innerHTML = players.map(p => {
    const cls = [];
    if (!p.alive) cls.push('dead');
    if (p.id === mySocketId) cls.push('me');
    const streak = p.streak > 0 ? '<span class="streak-pill">🔥 '+p.streak+'</span>' : '';
    return '<li class="'+cls.join(' ')+'"><span>'+escapeHtml(p.name)+streak+'</span><span class="score-pill">'+p.score+' pts</span></li>';
  }).join('');
}

// ---------- Visuals ----------
function renderVisual(container, qData) {
  container.innerHTML = '';
  if (qData.sign) {
    const s = qData.sign;
    const el = document.createElement('div');
    el.className = 'sign ' + s.shape;
    if (s.shape === 'triangle' || s.shape === 'triangle-down') {
      el.innerHTML = '<div class="tri-inner" style="background:'+s.border+';"><div style="position:absolute;inset:6px;background:'+s.bg+';clip-path:inherit;display:flex;align-items:'+(s.shape==='triangle'?'flex-end':'flex-start')+';justify-content:center;padding:'+(s.shape==='triangle'?'0 0 10px':'8px 0 0')+';color:'+(s.textColor||'#0B2545')+';font-size:26px;font-weight:900;">'+escapeHtml(s.text||'')+'</div></div>';
    } else if (s.shape === 'octagon') {
      el.style.background = s.bg;
      el.style.color = s.textColor || '#fff';
      el.textContent = s.text || '';
    } else if (s.shape === 'diamond') {
      el.style.background = s.bg;
      el.style.borderColor = s.border;
      el.style.color = s.textColor || '#0B2545';
      el.innerHTML = '<span>'+escapeHtml(s.text||'')+'</span>';
    } else {
      el.style.background = s.bg;
      el.style.borderColor = s.border;
      el.style.color = s.textColor || '#0B2545';
      el.textContent = s.text || '';
    }
    container.appendChild(el);
  } else if (qData.icon) {
    const el = document.createElement('div');
    el.className = 'q-emoji';
    el.textContent = qData.icon;
    container.appendChild(el);
  }
}

// ---------- QUESTION ----------
let timerRaf = null;
socket.on('question', ({ index, total, q, options, icon, sign, timeMs, mode, players }) => {
  lastQuestion = { q, options, icon, sign };
  myChoice = null;
  show('question');
  currentMode = mode;
  const label = total ? ('Question ' + index + ' / ' + total) : ('Question ' + index + ' · endless');
  document.getElementById('q-progress').textContent = label;
  const me = (players || []).find(p => p.id === mySocketId);
  document.getElementById('q-streak').textContent = (me && me.streak > 0) ? '🔥 streak '+me.streak : '';

  renderVisual(document.getElementById('q-visual'), { icon, sign });
  document.getElementById('q-text').textContent = q;

  const container = document.getElementById('options-container');
  container.innerHTML = '';
  const letters = ['A','B','C','D','E','F'];
  options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.type = 'button';
    btn.innerHTML = '<span class="opt-letter">'+letters[i]+'</span><span>'+escapeHtml(opt)+'</span>';
    btn.onclick = () => selectAnswer(i, btn);
    container.appendChild(btn);
  });

  const bar = document.getElementById('timer-bar');
  bar.style.transition = 'none';
  bar.style.width = '100%';
  // reflow, then animate
  void bar.offsetWidth;
  bar.style.transition = 'width '+timeMs+'ms linear';
  bar.style.width = '0%';
});

function selectAnswer(i, btn) {
  if (myChoice !== null) return;
  myChoice = i;
  document.querySelectorAll('.option-btn').forEach(b => { b.disabled = true; b.classList.remove('selected'); });
  btn.classList.add('selected');
  socket.emit('submitAnswer', { code: myCode, choice: i });
}

socket.on('answerReceived', () => { /* reveal will handle visual */ });

socket.on('reveal', ({ correct, players }) => {
  // Mark options on the live question view first (visible during pause)
  document.querySelectorAll('#options-container .option-btn').forEach((b, i) => {
    if (i === correct) b.classList.add('correct');
    else if (i === myChoice) b.classList.add('wrong');
  });

  // Then transition to reveal view with same info
  setTimeout(() => {
    const me = (players || []).find(p => p.id === mySocketId);
    const iWasCorrect = myChoice === correct;
    const iAnswered = myChoice !== null;
    const fb = document.getElementById('reveal-feedback');
    if (!iAnswered) { fb.textContent = '⏱ Time up!'; fb.className = 'feedback bad'; }
    else if (iWasCorrect) { fb.textContent = '✅ Correct!'; fb.className = 'feedback good'; }
    else { fb.textContent = '❌ Wrong answer'; fb.className = 'feedback bad'; }

    if (lastQuestion) {
      renderVisual(document.getElementById('reveal-visual'), lastQuestion);
      document.getElementById('reveal-q').textContent = lastQuestion.q;
      const wrap = document.getElementById('reveal-options');
      wrap.innerHTML = '';
      const letters = ['A','B','C','D','E','F'];
      lastQuestion.options.forEach((opt, i) => {
        const div = document.createElement('div');
        div.className = 'option-btn';
        if (i === correct) div.classList.add('correct');
        else if (i === myChoice) div.classList.add('wrong');
        div.innerHTML = '<span class="opt-letter">'+letters[i]+'</span><span>'+escapeHtml(opt)+'</span>';
        wrap.appendChild(div);
      });
    }
    renderPlayers('reveal-players', players);
    show('reveal');
  }, 900);
});

// ---------- GAME OVER ----------
socket.on('gameOver', ({ players, mode }) => {
  show('gameover');
  const me = players.find(p => p.id === mySocketId);
  const soloMode = players.length === 1 && mode === 'endless';
  document.getElementById('solo-summary').classList.toggle('hidden', !soloMode);
  document.getElementById('podium-wrap').classList.toggle('hidden', soloMode);
  document.getElementById('final-players').classList.toggle('hidden', soloMode);

  if (soloMode && me) {
    document.getElementById('go-title').textContent = 'Run over!';
    document.getElementById('solo-final-score').textContent = me.streak + ' correct';
    document.getElementById('solo-final-sub').textContent =
      'Score: ' + me.score + ' pts · Streak: 🔥 ' + me.streak;
  } else {
    document.getElementById('go-title').textContent = mode === 'endless' ? 'Last driver standing!' : 'Game Over!';
    renderPlayers('final-players', players);
    buildPodium(players);
  }
  launchConfetti();
  document.getElementById('btn-again').classList.toggle('hidden', !isHost);
});

function buildPodium(players) {
  const podium = document.getElementById('podium');
  podium.innerHTML = '';
  const order = [1,0,2];
  const medals = {0:'🥇',1:'🥈',2:'🥉'};
  order.forEach(rank => {
    const p = players[rank];
    if (!p) return;
    const div = document.createElement('div');
    div.className = 'podium-spot p'+(rank+1);
    div.innerHTML =
      '<div class="podium-bar">'+medals[rank]+'</div>'+
      '<div class="podium-name">'+escapeHtml(p.name)+'</div>'+
      '<div class="podium-score">'+p.score+' pts</div>';
    podium.appendChild(div);
  });
}

function launchConfetti() {
  const colors = ['#FFD400','#D7263D','#1F6FEB','#2FBF71','#F7F9FC'];
  for (let i = 0; i < 70; i++) {
    const el = document.createElement('div');
    el.className = 'confetti';
    el.style.left = Math.random()*100+'vw';
    el.style.background = colors[Math.floor(Math.random()*colors.length)];
    el.style.animationDuration = (2 + Math.random()*2)+'s';
    el.style.animationDelay = (Math.random()*0.5)+'s';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 4500);
  }
}

document.getElementById('btn-again').onclick = () => socket.emit('playAgain', myCode);
socket.on('backToLobby', ({ players, mode }) => { currentMode = mode; enterLobby(myCode, players); });
</script>
</body>
</html>
