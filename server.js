const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const QUESTIONS = require('./questions.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve index.html and any static file from the project root — no public/ folder needed.
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.use(express.static(__dirname));

// ---------- Config ----------
const QUESTIONS_PER_GAME = 15;      // classic multiplayer round length
const ROUND_TIME_MS = 15000;        // per question
const REVEAL_TIME_MS = 3500;        // pause after reveal before next question
const ENDLESS_TIME_MS = 12000;      // slightly tighter for endless

// ---------- Room management ----------
// rooms[code] = {
//   players: { socketId: { name, score, alive, streak } },
//   hostId, mode: 'classic'|'endless',
//   state: 'lobby'|'question'|'reveal'|'finished',
//   currentQIndex, questionOrder, answersThisRound,
//   questionStartTime, qTimer, nextTimer
// }
const rooms = {};

function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  do {
    code = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  } while (rooms[code]);
  return code;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function publicPlayers(room) {
  return Object.entries(room.players).map(([id, p]) => ({
    id, name: p.name, score: p.score, alive: p.alive !== false, streak: p.streak || 0
  }));
}

function clearRoomTimers(room) {
  if (room.qTimer) { clearTimeout(room.qTimer); room.qTimer = null; }
  if (room.nextTimer) { clearTimeout(room.nextTimer); room.nextTimer = null; }
}

function pickQuestionIndex(room) {
  // Endless mode: pull an infinite stream, avoid immediate repeats.
  if (room.mode === 'endless') {
    let idx;
    let tries = 0;
    do {
      idx = Math.floor(Math.random() * QUESTIONS.length);
      tries++;
    } while (room.recentQs && room.recentQs.includes(idx) && tries < 20);
    room.recentQs = [...(room.recentQs || []), idx].slice(-30);
    return idx;
  }
  return room.questionOrder[room.currentQIndex];
}

function anyAlive(room) {
  return Object.values(room.players).some(p => p.alive !== false);
}

function startQuestion(code) {
  const room = rooms[code];
  if (!room) return;
  clearRoomTimers(room);

  if (room.mode === 'classic' && room.currentQIndex >= room.questionOrder.length) {
    finishGame(code);
    return;
  }
  if (room.mode === 'endless' && !anyAlive(room)) {
    finishGame(code);
    return;
  }

  const qIdx = pickQuestionIndex(room);
  const qData = QUESTIONS[qIdx];
  room.currentQData = qData;
  room.answersThisRound = {};
  room.questionStartTime = Date.now();
  room.state = 'question';

  const timeMs = room.mode === 'endless' ? ENDLESS_TIME_MS : ROUND_TIME_MS;

  io.to(code).emit('question', {
    index: room.mode === 'classic' ? room.currentQIndex + 1 : (room.qCount || 0) + 1,
    total: room.mode === 'classic' ? room.questionOrder.length : null,
    q: qData.q,
    options: qData.options,
    icon: qData.icon || null,
    sign: qData.sign || null,
    timeMs,
    mode: room.mode,
    players: publicPlayers(room)
  });

  room.qTimer = setTimeout(() => endQuestion(code), timeMs);
}

function endQuestion(code) {
  const room = rooms[code];
  if (!room) return;
  if (room.state !== 'question') return;
  room.state = 'reveal';
  clearRoomTimers(room);

  const qData = room.currentQData;

  // Endless mode: any alive player who was wrong (or didn't answer) is eliminated.
  if (room.mode === 'endless') {
    Object.entries(room.players).forEach(([id, p]) => {
      if (!p.alive) return;
      const ans = room.answersThisRound[id];
      if (ans !== qData.correct) {
        p.alive = false;
        p.streak = p.streak || 0;
      } else {
        p.streak = (p.streak || 0) + 1;
      }
    });
    room.qCount = (room.qCount || 0) + 1;
  }

  io.to(code).emit('reveal', {
    correct: qData.correct,
    players: publicPlayers(room).sort((a, b) => (b.score - a.score) || (b.streak - a.streak))
  });

  if (room.mode === 'classic') {
    room.currentQIndex += 1;
  }

  const gameEnds =
    (room.mode === 'classic' && room.currentQIndex >= room.questionOrder.length) ||
    (room.mode === 'endless' && !anyAlive(room));

  if (gameEnds) {
    room.nextTimer = setTimeout(() => finishGame(code), REVEAL_TIME_MS);
  } else {
    room.nextTimer = setTimeout(() => startQuestion(code), REVEAL_TIME_MS);
  }
}

function finishGame(code) {
  const room = rooms[code];
  if (!room) return;
  clearRoomTimers(room);
  room.state = 'finished';
  const players = publicPlayers(room)
    .sort((a, b) => (b.score - a.score) || (b.streak - a.streak));
  io.to(code).emit('gameOver', { players, mode: room.mode });
}

// ---------- Socket handlers ----------
io.on('connection', (socket) => {
  socket.on('createRoom', ({ name, mode }) => {
    const code = genCode();
    rooms[code] = {
      players: { [socket.id]: { name: (name || '').trim().slice(0, 16) || 'Player', score: 0, alive: true, streak: 0 } },
      hostId: socket.id,
      mode: mode === 'endless' ? 'endless' : 'classic',
      state: 'lobby',
      currentQIndex: 0,
      questionOrder: [],
      answersThisRound: {},
      qTimer: null,
      nextTimer: null,
      qCount: 0,
      recentQs: []
    };
    socket.join(code);
    socket.emit('roomCreated', { code, players: publicPlayers(rooms[code]), isHost: true, mode: rooms[code].mode });
  });

  socket.on('joinRoom', ({ code, name }) => {
    code = (code || '').toUpperCase().trim();
    const room = rooms[code];
    if (!room) return socket.emit('errorMsg', 'Room not found. Check the code and try again.');
    if (room.state !== 'lobby') return socket.emit('errorMsg', 'That game already started.');
    room.players[socket.id] = { name: (name || '').trim().slice(0, 16) || 'Player', score: 0, alive: true, streak: 0 };
    socket.join(code);
    io.to(code).emit('lobbyUpdate', { players: publicPlayers(room) });
    socket.emit('roomJoined', { code, players: publicPlayers(room), isHost: false, mode: room.mode });
  });

  // Single-player endless: server creates a private room + starts immediately.
  socket.on('startSolo', ({ name }) => {
    const code = genCode();
    rooms[code] = {
      players: { [socket.id]: { name: (name || '').trim().slice(0, 16) || 'You', score: 0, alive: true, streak: 0 } },
      hostId: socket.id,
      mode: 'endless',
      state: 'lobby',
      solo: true,
      currentQIndex: 0,
      questionOrder: [],
      answersThisRound: {},
      qTimer: null,
      nextTimer: null,
      qCount: 0,
      recentQs: []
    };
    socket.join(code);
    socket.emit('roomCreated', { code, players: publicPlayers(rooms[code]), isHost: true, mode: 'endless', solo: true });
    setTimeout(() => startQuestion(code), 400);
  });

  socket.on('setMode', ({ code, mode }) => {
    const room = rooms[code];
    if (!room || room.hostId !== socket.id || room.state !== 'lobby') return;
    room.mode = mode === 'endless' ? 'endless' : 'classic';
    io.to(code).emit('modeChanged', { mode: room.mode });
  });

  socket.on('startGame', (code) => {
    const room = rooms[code];
    if (!room || room.hostId !== socket.id || room.state !== 'lobby') return;
    Object.values(room.players).forEach(p => { p.score = 0; p.alive = true; p.streak = 0; });
    room.qCount = 0;
    room.recentQs = [];
    if (room.mode === 'classic') {
      room.questionOrder = shuffle(QUESTIONS.map((_, i) => i))
        .slice(0, Math.min(QUESTIONS_PER_GAME, QUESTIONS.length));
      room.currentQIndex = 0;
    }
    startQuestion(code);
  });

  socket.on('submitAnswer', ({ code, choice }) => {
    const room = rooms[code];
    if (!room || room.state !== 'question') return;
    const player = room.players[socket.id];
    if (!player || player.alive === false) return;
    if (room.answersThisRound[socket.id] !== undefined) return;

    const qData = room.currentQData;
    const elapsed = Date.now() - room.questionStartTime;
    room.answersThisRound[socket.id] = choice;

    const timeMs = room.mode === 'endless' ? ENDLESS_TIME_MS : ROUND_TIME_MS;
    let gained = 0;
    if (choice === qData.correct) {
      const speedBonus = Math.max(0, Math.round(500 * (1 - elapsed / timeMs)));
      gained = 500 + speedBonus;
      player.score += gained;
    }
    socket.emit('answerReceived', { correct: choice === qData.correct, gained, correctIndex: qData.correct, yourChoice: choice });

    // Advance early only when every eligible (alive) player has answered.
    const eligible = Object.entries(room.players).filter(([, p]) => p.alive !== false).map(([id]) => id);
    const allAnswered = eligible.every(id => room.answersThisRound[id] !== undefined);
    if (allAnswered) endQuestion(code);
  });

  socket.on('playAgain', (code) => {
    const room = rooms[code];
    if (!room || room.hostId !== socket.id) return;
    clearRoomTimers(room);
    Object.values(room.players).forEach(p => { p.score = 0; p.alive = true; p.streak = 0; });
    room.qCount = 0;
    room.recentQs = [];
    room.state = 'lobby';
    if (room.solo) {
      setTimeout(() => startQuestion(code), 400);
      return;
    }
    io.to(code).emit('backToLobby', { players: publicPlayers(room), mode: room.mode });
  });

  socket.on('disconnect', () => {
    for (const code of Object.keys(rooms)) {
      const room = rooms[code];
      if (!room.players[socket.id]) continue;
      delete room.players[socket.id];
      if (Object.keys(room.players).length === 0) {
        clearRoomTimers(room);
        delete rooms[code];
      } else {
        if (room.hostId === socket.id) room.hostId = Object.keys(room.players)[0];
        io.to(code).emit('lobbyUpdate', { players: publicPlayers(room) });
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Ajokortti Quiz running on port ${PORT} — ${QUESTIONS.length} questions loaded`));
