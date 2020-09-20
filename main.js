/*
  no of players
  board count
  position of snakes and ladders
  need from and to positions for both snakes and ladders
  starting logic of each player (roll 6)
  end game logic (one player reaches last position)
  game play: keep rolling when you get 6, unless you will go overboard
*/

const BOARD_COUNT = 100;
const NUM_PLAYERS = 4;
const NUM_SNAKES = 5;
const NUM_LADDERS = 5;
const MIN_SNAKE_AND_LADDER_POSITION = 5;
const MAX_SNAKE_AND_LADDER_POSITION = BOARD_COUNT - 2;
const COLORS = ['red', 'green', 'blue', 'yellow'];
const BOARD = document.getElementById('board');
const PLAYER_BOX = document.getElementById('playerBox');

let snakes = [], ladders = [];
let snakeHeads, ladderFoots;
let players = new Array(NUM_PLAYERS).fill(-1);
let pins = [];
let currPlayer = 0;
let snakesAndLaddersSet = new Set();

function createPin(color) {
  const pin = document.createElement('div');
  pin.classList.add('pin', color);
  return pin;
}

function resetGame() {
  snakes = [];
  ladders = [];
  players = new Array(NUM_PLAYERS).fill(-1);
  currPlayer = 0;
  snakesAndLaddersSet.clear();

  pins = COLORS.map(color => createPin(color));

  PLAYER_BOX.innerHTML = '';
  createPlayers();
  initSnakes();
  initLadders();

  snakeHeads = snakes.map(snake => snake[0]);
  ladderFoots = ladders.map(snake => snake[0]);

  BOARD.innerHTML = '';
  createBoard();
  addSnakesAndLadders(snakes, 'snake');
  addSnakesAndLadders(ladders, 'ladder');
  activateNextPlayer();
}

function createPlayers() {
  for (let i=0; i<NUM_PLAYERS; i++) {
    const btn = document.createElement('button');
    btn.classList.add('player-btn');
    btn.style.backgroundColor = COLORS[i];
    btn.dataset.num = i + 1;
    btn.textContent = `Player ${i+1}`;
    btn.addEventListener('click', () => rollDice(i+1));
  
    document.querySelector('.player-box').appendChild(btn);
  }
}

function initSnakes() {
  for (let i=0; i<NUM_SNAKES; i++) {
    let rndm1 = MIN_SNAKE_AND_LADDER_POSITION + Math.ceil(Math.random() * (MAX_SNAKE_AND_LADDER_POSITION - MIN_SNAKE_AND_LADDER_POSITION));
    let rndm2 = rndm1 + 1 + Math.ceil(Math.random() * (MAX_SNAKE_AND_LADDER_POSITION - rndm1));
    if (snakesAndLaddersSet.has(rndm1) || snakesAndLaddersSet.has(rndm2)) {
      i--;
      continue;
    }
    snakesAndLaddersSet.add(rndm1);
    snakesAndLaddersSet.add(rndm2);
  
    snakes.push([rndm2, rndm1]);
  }
}

function initLadders() {
  for (let i = 0; i < NUM_LADDERS; i++) {
    let rndm1 = MIN_SNAKE_AND_LADDER_POSITION + Math.ceil(Math.random() * (MAX_SNAKE_AND_LADDER_POSITION - MIN_SNAKE_AND_LADDER_POSITION));
    let rndm2 = rndm1 + 1 + Math.ceil(Math.random() * (MAX_SNAKE_AND_LADDER_POSITION - rndm1));
    if (snakesAndLaddersSet.has(rndm1) || snakesAndLaddersSet.has(rndm2)) {
      i--;
      continue;
    }
    snakesAndLaddersSet.add(rndm1);
    snakesAndLaddersSet.add(rndm2);
  
    ladders.push([rndm1, rndm2]);
  }
}

function createBoard() {
  for (let i = BOARD_COUNT - 1; i >= 0; i--) {
    let newPinsContainer = document.createElement('div');
    newPinsContainer.classList.add('pins-container');
  
    let posnNum = document.createElement('div');
    posnNum.classList.add('posn-num');
    posnNum.textContent = i+1;
  
    let newEl = document.createElement('div');
    newEl.classList.add('position');
    newEl.dataset.posn = i+1;
  
    newEl.appendChild(newPinsContainer);
    newEl.appendChild(posnNum);
  
    if (snakes.flat().includes(i+1)) {
      newEl.classList.add('snake');
    }
  
    if (ladders.flat().includes(i+1)) {
      newEl.classList.add('ladder');
    }
  
    BOARD.appendChild(newEl);
  }
}

function addSnakesAndLadders(arr, type) {
  arr.forEach(item => {
    const el1Rect = document.querySelector(`[data-posn='${item[0]}']`).getBoundingClientRect();
    const el2Rect = document.querySelector(`[data-posn='${item[1]}']`).getBoundingClientRect();
  
    const el1Center = [el1Rect.left + (el1Rect.right - el1Rect.left) / 2 - BOARD.offsetLeft, el1Rect.top + (el1Rect.bottom - el1Rect.top) / 2 - BOARD.offsetTop];
    const el2Center = [el2Rect.left + (el2Rect.right - el2Rect.left) / 2 - BOARD.offsetLeft, el2Rect.top + (el2Rect.bottom - el2Rect.top) / 2 - BOARD.offsetTop];
    
    const distance = Math.sqrt(
      Math.pow((el2Center[0] - el1Center[0]), 2) + 
      Math.pow((el2Center[1] - el1Center[1]), 2)
      );
  
    var angle = Math.atan2((el1Center[1] - el2Center[1]), (el1Center[0] - el2Center[0])) * (180 / Math.PI);
  
    const connector = document.createElement('div');
    connector.classList.add('connector', `${type}-conn`);
    connector.style.width = `${distance}px`;
    connector.style.left = `${el2Center[0]}px`;
    connector.style.top = `${el2Center[1]}px`;
    connector.style.transform = `rotate(${angle}deg)`
    BOARD.appendChild(connector);
  });
}

function activateNextPlayer() {
  const playerBtns = document.querySelectorAll('.player-btn');
  currPlayer = currPlayer === NUM_PLAYERS ? 1 : currPlayer + 1;

  playerBtns.forEach((playerBtn, index) => {
    if (index + 1 === currPlayer) {
      playerBtn.removeAttribute('disabled');
      playerBtn.focus();
    }
    else {
      playerBtn.setAttribute('disabled', false);
    }
  })
}

function rollDice() {
  const rndm = Math.ceil(Math.random() * 6);

  let posnBox;
  
  if (players[currPlayer - 1] + rndm > BOARD_COUNT) {
    activateNextPlayer();
    return
  };
  
  console.log(currPlayer, pins);

  if (players[currPlayer - 1] === -1) {
    if (rndm === 6) {
      players[currPlayer - 1] = 0;
      posnBox = document.querySelector('[data-posn="1"]').querySelector('.pins-container');
      posnBox.appendChild(pins[currPlayer - 1]);
    }
    else {
      activateNextPlayer();
    }
    return;
  }
  
  players[currPlayer - 1] += rndm;

  if (snakeHeads.includes(players[currPlayer - 1])) {
    players[currPlayer - 1] = snakes[snakeHeads.indexOf(players[currPlayer - 1])][1];
  }

  if (ladderFoots.includes(players[currPlayer - 1])) {
    players[currPlayer - 1] = ladders[ladderFoots.indexOf(players[currPlayer - 1])][1];
  }
  
  posnBox = document.querySelector(`[data-posn="${players[currPlayer - 1]}"]`).querySelector('.pins-container');
  posnBox.appendChild(pins[currPlayer - 1]);

  if (players[currPlayer - 1] === 100) {
    alert(`Player ${currPlayer} wins!`);
    resetGame();
  }
  
  if (rndm === 6) {
    return;
  }
  activateNextPlayer();
}

resetGame();
