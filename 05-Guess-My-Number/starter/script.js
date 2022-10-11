'use strict';

let secretNumber;
let score;
initializeVariables();

let highScore = 0;

function initializeVariables() {
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  score = 20;
}

const displayMessage = function(message) {
  document.querySelector('.message').textContent = message;
};

document.querySelector('.check').addEventListener('click',
  function() {
    const guess = Number(document.querySelector('.guess').value);

    // When there is no input
    if (!guess) {
      displayMessage('⛔ No Number!');

      // When player wins
    } else if (guess === secretNumber) {
      displayMessage('🎉 Correct Number!');
      document.querySelector('.number').textContent = secretNumber.toString();

      document.querySelector('body').style.backgroundColor = '#60b347';
      document.querySelector('.number').style.width = '30rem';

      if (score > highScore) {
        highScore = score;
        document.querySelector('.highscore').textContent = highScore.toString();
      }

      // When guess is wrong
    } else if (guess !== secretNumber) {
      if (1 < score) {
        displayMessage(guess > secretNumber ? '📈 Too High' : '📉 Too Low');
        score--;
        document.querySelector('.score').textContent = score.toString();
      } else {
        displayMessage('💥 You Lost the Game!');
        document.querySelector('.score').textContent = 0;
      }
    }
  });

document.querySelector('.again').addEventListener('click', function() {
  initializeVariables();

  displayMessage('Start Guessing...');
  document.querySelector('.score').textContent = score;
  document.querySelector('.number').textContent = '?';
  document.querySelector('.guess').value = '';

  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
});