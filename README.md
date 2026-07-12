# Ajokortti Quiz — Multiplayer Driving Theory Game

A real-time multiplayer quiz game for Finnish driving theory (B-license) practice. Players join a room, answer questions live, and race for the highest score.

## Run locally
```
npm install
npm start
```
Then open http://localhost:3000

## Deploy on Render
1. Push this folder to a GitHub repo.
2. On Render: **New > Web Service**, connect the repo.
3. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node
4. Render sets `PORT` automatically — `server.js` already reads `process.env.PORT`, so no changes needed.
5. Deploy. Share the Render URL with friends — one person creates a room, others join with the room code.

## How it works
- `server.js` — Express server + Socket.io handling rooms, questions, scoring, and a live timer.
- `public/index.html` — the game client (lobby, live question screen, reveal, podium + confetti finish).
- Scoring: 500 pts for a correct answer + a speed bonus (faster = more points), up to ~1000 pts per question.
- 10 random questions per game, pulled from a bank of 30 covering Finnish road signs, speed limits, right-of-way, and rules.

## Notes
- Question bank is hand-written for accuracy — always double-check current rules against [Traficom](https://www.traficom.fi) before your real test, since exact rules/limits can change.
