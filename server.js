const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));

// ---------- Question bank: Finnish driving theory (B-license) ----------
const QUESTIONS = [
  { q: "What is the default speed limit in built-up areas in Finland?", options: ["30 km/h", "40 km/h", "50 km/h", "60 km/h"], correct: 2 },
  { q: "What is the default speed limit outside built-up areas (no sign posted)?", options: ["60 km/h", "70 km/h", "80 km/h", "100 km/h"], correct: 2 },
  { q: "On motorways, what is the general speed limit in summer?", options: ["100 km/h", "110 km/h", "120 km/h", "130 km/h"], correct: 2 },
  { q: "What does a solid yellow line in the middle of the road mean?", options: ["Passing allowed both directions", "No passing allowed", "Bus lane only", "Parking allowed"], correct: 1 },
  { q: "When must you use headlights while driving in Finland?", options: ["Only at night", "Only in fog", "At all times, day and night", "Only on motorways"], correct: 2 },
  { q: "What is the legal blood alcohol limit for driving in Finland?", options: ["0.0 per mille", "0.2 per mille", "0.5 per mille", "0.8 per mille"], correct: 2 },
  { q: "At a yield (give way) sign, you must:", options: ["Stop completely always", "Give way to traffic on the priority road", "Speed up to merge", "Only yield to buses"], correct: 1 },
  { q: "What does a triangular road sign with a red border generally indicate?", options: ["Mandatory action", "Warning of danger ahead", "Prohibition", "Information"], correct: 1 },
  { q: "How many hours of supervised practice driving are typically required before the B-license driving test in Finland?", options: ["10 hours", "18 hours", "25 hours", "40 hours"], correct: 1 },
  { q: "What is the minimum age to start driving lessons for a car license (B) in Finland?", options: ["15 years", "16 years", "17 years", "18 years"], correct: 2 },
  { q: "A round blue sign with a white arrow pointing up means:", options: ["No entry", "Mandatory direction: straight ahead", "Parking permitted", "One-way street ends"], correct: 1 },
  { q: "When approaching a pedestrian crossing without traffic lights, you must:", options: ["Always stop", "Give way to pedestrians already on or clearly about to cross", "Only slow down if pedestrians wave", "Ignore unless a policeman is present"], correct: 1 },
  { q: "What does a flashing yellow traffic light mean?", options: ["Stop completely", "Proceed with caution, no one has right of way automatically", "Right of way is yours", "Signal malfunction, wait for green"], correct: 1 },
  { q: "In winter, when are winter tires mandatory in Finland?", options: ["November to March, always", "December 1 to end of February at minimum, and whenever conditions require", "Never mandatory", "Only for trucks"], correct: 1 },
  { q: "What is the minimum tread depth for winter tires in Finland?", options: ["1.0 mm", "1.6 mm", "3.0 mm", "5.0 mm"], correct: 2 },
  { q: "At an unmarked intersection with no signs, who has right of way?", options: ["The faster vehicle", "Vehicle coming from the right", "Vehicle coming from the left", "Whoever arrives first"], correct: 1 },
  { q: "What does a red circular sign with a white horizontal bar mean?", options: ["No stopping", "No entry for all vehicles", "Speed limit ends", "Roundabout ahead"], correct: 1 },
  { q: "When driving in a roundabout, who generally has priority?", options: ["Vehicles entering the roundabout", "Vehicles already in the roundabout", "Whichever vehicle is bigger", "Vehicles on the right"], correct: 1 },
  { q: "What should you do if an ambulance approaches with sirens and lights on?", options: ["Speed up to get out of the way", "Ignore it if you have a green light", "Give way and let it pass safely, pulling aside if needed", "Stop in the middle of the lane"], correct: 2 },
  { q: "What is the seatbelt rule for passengers in a car in Finland?", options: ["Only front seat passengers must wear one", "All passengers must wear seatbelts if available", "Only required outside cities", "Only the driver must wear one"], correct: 1 },
  { q: "What does a blue rectangular sign with a white 'P' indicate?", options: ["Prohibited zone", "Parking allowed", "Petrol station", "Pedestrian zone"], correct: 1 },
  { q: "When two vehicles meet on a narrow road with a passing place, who should use it?", options: ["The vehicle nearest to it, or the smaller/more maneuverable one", "Always the one going uphill", "Always the one going downhill", "Neither, both must stop"], correct: 0 },
  { q: "What does a triangular sign showing a deer mean?", options: ["Zoo ahead", "Risk of wild animals crossing the road", "Hunting area", "No wildlife allowed"], correct: 1 },
  { q: "How close behind another vehicle should you follow on a highway (safe following distance) at higher speeds?", options: ["As close as possible to save fuel", "About a 3-second gap or more", "Exactly 1 meter", "It doesn't matter"], correct: 1 },
  { q: "What must you do before overtaking another vehicle?", options: ["Just flash your lights", "Ensure the way ahead is clear and it's safe and legal to do so", "Only check your mirror once", "Sound your horn and go"], correct: 1 },
  { q: "A sign showing a red triangle with an exclamation mark generally means:", options: ["General danger warning, details often on a sub-plate", "Give way", "No overtaking", "End of restriction"], correct: 0 },
  { q: "What is the rule about using a mobile phone while driving in Finland?", options: ["Fully allowed anytime", "Only hands-free / mounted use without holding it is allowed", "Only allowed at red lights", "No rule exists"], correct: 1 },
  { q: "When can you cross a solid single white line in the middle of the road?", options: ["Anytime it's safe", "Never, unless avoiding an obstacle or in an emergency", "Only during the day", "Only on motorways"], correct: 1 },
  { q: "What does it mean if a school zone sign is posted?", options: ["No cars ever allowed", "Reduced speed and extra caution needed, children may be nearby", "Only buses may pass", "Sign is purely decorative"], correct: 1 },
  { q: "What should you do at a railway level crossing when lights start flashing?", options: ["Speed across before the train arrives", "Stop and wait, do not cross", "Only stop if you see the train", "Sound horn and proceed"], correct: 1 }
];

// ---------- Room management ----------
const rooms = {}; // code -> { players: {id: {name, score}}, hostId, state, currentQ, questionOrder, answersThisRound, timer }

const QUESTIONS_PER_GAME = 10;
const ROUND_TIME_MS = 15000;

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
  return Object.entries(room.players).map(([id, p]) => ({ id, name: p.name, score: p.score }));
}

function startQuestion(code) {
  const room = rooms[code];
  if (!room) return;
  if (room.currentQIndex >= room.questionOrder.length) {
    room.state = 'finished';
    const players = publicPlayers(room).sort((a, b) => b.score - a.score);
    io.to(code).emit('gameOver', { players });
    return;
  }
  const qData = QUESTIONS[room.questionOrder[room.currentQIndex]];
  room.answersThisRound = {};
  room.questionStartTime = Date.now();
  room.state = 'question';

  io.to(code).emit('question', {
    index: room.currentQIndex + 1,
    total: room.questionOrder.length,
    q: qData.q,
    options: qData.options,
    timeMs: ROUND_TIME_MS
  });

  clearTimeout(room.timer);
  room.timer = setTimeout(() => endQuestion(code), ROUND_TIME_MS);
}

function endQuestion(code) {
  const room = rooms[code];
  if (!room || room.state !== 'question') return;
  room.state = 'reveal';
  const qData = QUESTIONS[room.questionOrder[room.currentQIndex]];

  io.to(code).emit('reveal', {
    correct: qData.correct,
    players: publicPlayers(room).sort((a, b) => b.score - a.score)
  });

  room.currentQIndex += 1;
  clearTimeout(room.timer);
  room.timer = setTimeout(() => startQuestion(code), 3500);
}

io.on('connection', (socket) => {
  socket.on('createRoom', (name) => {
    const code = genCode();
    rooms[code] = {
      players: { [socket.id]: { name: name?.trim().slice(0, 16) || 'Player', score: 0 } },
      hostId: socket.id,
      state: 'lobby',
      currentQIndex: 0,
      questionOrder: [],
      answersThisRound: {},
      timer: null
    };
    socket.join(code);
    socket.emit('roomCreated', { code, players: publicPlayers(rooms[code]), isHost: true });
  });

  socket.on('joinRoom', ({ code, name }) => {
    code = (code || '').toUpperCase().trim();
    const room = rooms[code];
    if (!room) {
      socket.emit('errorMsg', 'Room not found. Check the code and try again.');
      return;
    }
    if (room.state !== 'lobby') {
      socket.emit('errorMsg', 'That game already started.');
      return;
    }
    room.players[socket.id] = { name: name?.trim().slice(0, 16) || 'Player', score: 0 };
    socket.join(code);
    io.to(code).emit('lobbyUpdate', { players: publicPlayers(room) });
    socket.emit('roomJoined', { code, players: publicPlayers(room), isHost: false });
  });

  socket.on('startGame', (code) => {
    const room = rooms[code];
    if (!room || room.hostId !== socket.id || room.state !== 'lobby') return;
    const order = shuffle(QUESTIONS.map((_, i) => i)).slice(0, Math.min(QUESTIONS_PER_GAME, QUESTIONS.length));
    room.questionOrder = order;
    room.currentQIndex = 0;
    Object.values(room.players).forEach(p => p.score = 0);
    startQuestion(code);
  });

  socket.on('submitAnswer', ({ code, choice }) => {
    const room = rooms[code];
    if (!room || room.state !== 'question') return;
    if (room.answersThisRound[socket.id] !== undefined) return;
    const qData = QUESTIONS[room.questionOrder[room.currentQIndex]];
    const elapsed = Date.now() - room.questionStartTime;
    room.answersThisRound[socket.id] = choice;

    let gained = 0;
    if (choice === qData.correct) {
      const speedBonus = Math.max(0, Math.round(500 * (1 - elapsed / ROUND_TIME_MS)));
      gained = 500 + speedBonus;
      room.players[socket.id].score += gained;
    }
    socket.emit('answerReceived', { correct: choice === qData.correct, gained });

    const allAnswered = Object.keys(room.players).every(id => room.answersThisRound[id] !== undefined);
    if (allAnswered) endQuestion(code);
  });

  socket.on('playAgain', (code) => {
    const room = rooms[code];
    if (!room || room.hostId !== socket.id) return;
    room.state = 'lobby';
    Object.values(room.players).forEach(p => p.score = 0);
    io.to(code).emit('backToLobby', { players: publicPlayers(room) });
  });

  socket.on('disconnect', () => {
    for (const code of Object.keys(rooms)) {
      const room = rooms[code];
      if (room.players[socket.id]) {
        delete room.players[socket.id];
        if (Object.keys(room.players).length === 0) {
          clearTimeout(room.timer);
          delete rooms[code];
        } else {
          if (room.hostId === socket.id) {
            room.hostId = Object.keys(room.players)[0];
          }
          io.to(code).emit('lobbyUpdate', { players: publicPlayers(room) });
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Ajokortti Quiz running on port ${PORT}`));
