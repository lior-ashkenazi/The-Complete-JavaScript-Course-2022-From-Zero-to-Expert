'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function(movements, sort = false) {
  containerMovements.innerHTML = '';
  // .textContext = 0

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function(mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class='movements__row'>
          <div class='movements__type movements__type--${type}'>${i + 1} ${type}</div>
          <div class='movements__value'>${mov}€</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function(acc) {
  const incomes = acc.movements.filter(mov => mov > 0)
                     .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const outcomes = acc.movements.filter(mov => mov < 9)
                      .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes)}€`;

  const interest = acc.movements.filter(mov => mov > 0)
                      .map(deposit => deposit * acc.interestRate / 100)
                      .filter(interest => interest >= 1)
                      .reduce((acc, interest) => acc + interest, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function(accs) {
  accs.forEach(function(acc) {
    acc.username = acc.owner.toLowerCase()
                      .split(' ')
                      .map(name => name[0])
                      .join('');
  });
};

createUsernames(accounts);

const updateUI = function(acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

let curAcc;

btnLogin.addEventListener('click', function(e) {
  // Prevent form from submitting
  e.preventDefault();

  curAcc = accounts.find(acc => acc.username === inputLoginUsername.value);

  // Optional Chaining
  if (curAcc?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${curAcc.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // Update UI
    updateUI(curAcc);
  }
});

btnTransfer.addEventListener('click', function(e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.username === inputTransferTo.value);
  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 &&
    receiverAcc &&
    curAcc.balance >= amount &&
    receiverAcc?.username !== curAcc.username) {
    // Doing the transfer
    curAcc.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(curAcc);
  }
});

btnLoan.addEventListener('click', function(e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && curAcc.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    curAcc.movements.push(amount);

    // Update UI
    updateUI(curAcc);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function(e) {
  e.preventDefault();

  if (inputCloseUsername.value === curAcc &&
    Number(inputClosePin) === curAcc.pin) {
    const index = accounts.findIndex(acc => acc.username === curAcc.username);

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function(e) {
  e.preventDefault();
  displayMovements(curAcc.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling']
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const euroToUsd = 1.1;

/*const movementsUSD = movements.map(mov => mov * euroToUsd);

const movementsDescriptions = movements.map((mov, i) => `Movement: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`);
console.log(movementsDescriptions);*/

// const deposits = movements.filter(mov => mov > 0);
// const withdrawals = movements.filter(mov => mov < 0);
// console.log(movements);
// console.log(deposits);
// console.log(withdrawals);

// Print Movements
// console.log(movements);

// accumulator -> SNOWBALL
// Second argument for reduce is the INITIAL VALUE of the accumulator
/*const balance = movements.reduce((acc, mov) => acc += mov, 0);
console.log(balance);*/

// Maximum Value
/*const max = movements.reduce((acc, mov) => mov > acc ? mov : acc, movements[0]);
console.log(max);*/

// PIPELINE
// const totalDepositUSD = movements.filter(mov => mov > 0)
//                                  .map(mov => mov * euroToUsd)
//                                  .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositUSD);

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawal);
//
// console.log(accounts);
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// EQUALITY
/*console.log(movements);
console.log(movements.includes(-130));*/

// SOME: CONDITION
// some ~ any (like in python kind of)
/*const anyDeposits = movements.some(mov => mov > 1500);
console.log(anyDeposits);*/

// EVERY: CONDITION
// every ~ all (again, like in python kind of)
/*console.log(movements.every(mov => mov > 0));*/

/*const arr = [[1, 2, 3], [4, 5, 6], 7, 8];*/
// flat level default is 1, we can indeed increase that
/*console.log(arr.flat());*/

// flat
/*const overallBalance = accounts.map(acc => acc.movements)
                               .flat()
                               .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);*/

// flatMap
// we can't change here the depth of the flattening
/*const overallBalance2 = accounts.flatMap(acc => acc.movements)
                                .reduce((acc, mov) => acc + mov, 0);*/

// Sorting
// sorting is by default for strings!

// Strings
/*const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);*/

// Numbers
/*console.log(movements);*/
// return < 0 a, b
// return > 0 b, a
// ascending a - b
// descending b - a

// Ascending
/*movements.sort((a, b) => a - b);
console.log(movements);*/

// Descending
/*movements.sort((a, b) => b - a);
console.log(movements);*/

// Empty array + fill method
/*const arr1 = new Array(7);
console.log(arr1);
arr1.fill(1);
console.log(arr1);*/

// Array.from
/*
const arr2 = Array.from({ length: 7 }, () => 1);
console.log(arr2);

const arr3 = Array.from({ length: 7 }, (_, i) => i + 1);
console.log(arr3);
*/

/*labelBalance.addEventListener('click', function() {
  // 1. document.querySelectorAll returns a NodeList which can be converted
  // to an Array
  // 2. We also used mapping in the Array.from() function
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', '')));
  console.log(movementsUI);

  // Also returns an array of elements in the DOM which belong to certain class
  // const movementsUI2 = [...document.querySelectorAll('.movements__value')]
});*/
