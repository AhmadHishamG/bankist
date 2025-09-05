'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Omar youssef',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'salah ali ',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Abdullah hassan mohamed',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Younas ismail',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
let sort = false;
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
//It is always good practice to create a function whenever we try to do a certain function like in this case looping over the movements and displaying them and since its called a movement row in the html we will copy it and place it there
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, val) => acc + val);
  labelBalance.textContent = `${acc.balance}€`;
};
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);
  labelSumIn.textContent = `${incomes}€`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => Math.abs(mov) + acc, 0); //be carefule accumla
  labelSumOut.textContent = `${out}€`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1; //however we should not abuse chaining as chaining we should optimize its use as chaining can cause huge prefromance issues if we have large arrays so when chaining always look for methods to keep up your code's preformnace and you should not chain methods like the splice or reverse method can work for small applications that have small arrays but when dealing with large arrays you should not use them
    })
    .reduce((acc, int) => int + acc, 0);
  labelSumInterest.textContent = `${interest}€`;
};
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; //this step clears the current balance at the start

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements; // here we used slice to get a copy of the array so we dont sort the actual array and sort just a copy so when we want to return to orginal array when we press sort again it just returns the original array as is

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal'; //be careful in syntax in dealing with dom any incorrect syntax leads to errors
    const html = `<div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i +
      1 /*here we display i+1 in order to know the order of which movement it was in the program*/
    } ${type}</div>
          <div class="movements__value">${
            mov /*This is mov as its the cureent element in the array that we are looping over and in each iteration it will be one of the elements in the array*/
          }</div>
        </div>`; //here we are doing this to create a movement row for each iteration and template literals are amazing for creating html template literals as its really easy to create a multi line string
    containerMovements.insertAdjacentHTML('afterbegin', html); //the insertAdjacentHTML accepts 2 arguments the first argument is the position in which we want to attach the HTML we usually use afterbegin or beforeend here we used after begin so that they can be after each other in the correct order and here it places them from bottom to top and if we used before end it would be reversed and we want the newest movement to be at the top(before begin and afterend insert outside element )(after begin and before end insert inside element
  }); //now what we need to do is attach this html somehow into this container so into this movement element we will use a method called insertAdjacentHtml
}; // we also need to empty the entire container first and then add new elements
//console.log(containerMovements.innerHTML);
//Using the map and for each method to compute usernames for each account owner in our application
//in our appliacation we have 4 accounts and we want to compute a username
//The user Name is the initals of each user in lower case
//we will start with one account and generalize it for all accounts
//we want it to be stw

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner //like this we are creating a new attribute called usrname for each account
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);
//console.log(accounts);
//we will do it outside a function just to see how it works and then make it inside a function
//before doing it inside a function
// const username = user.toLowerCase().split(' '); //here will divide by spaces so we can divide the string into words and lets discuss what we have now so
// console.log(username);
// //step 1:looping over the array
// //step 2: taking the first letter from each
// //step3: concateinating all 3 letters into one array
// const iUsername = username.map(sname => sname.split('').slice(0, 1)).join(''); //instead of this we could do map but instead of split and slice just use name[0]
// console.log(iUsername);

//calcPrintBalance(movements);

//Event handlers

let currentAccount;
//The logging in process

const updateUi = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display balance
  calcDisplayBalance(acc);
  //Display Summary
  calcDisplaySummary(acc);
  //Start reset logout timer
};
btnLogin.addEventListener('click', function (e) {
  //prevent default prevents the submit button from reloading the page when pressed
  e.preventDefault();
  //console.log(`login`); //this will make the word login appear and then dissapear as its a button in a form element and so in HTML the default behaviour when we click the submit button is for the page to reload and we need to stop that from happening sp we need to give this function here the event parameter another thing that is great about forms is whenever we click enter in any of the fields that we can write in it will register as a button click event and do the exact functions of a button click

  //To log the user actually in we need to find the account from the accounts array with the username that the user inputted
  currentAccount = accounts.find(
    acc =>
      acc.username ===
      inputLoginUsername.value /*here we need to get value of the html element as this will get the corresponding value written in it  */
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //what this question mark does after currentAccount before dot is that it will only check this condition if currentAccount exists and this is called optional chaining and like this it wont produce an error and will only tell you undefined

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = ''; //this simply clears the value of inputLoginUsername and inputLoginPin
    inputLoginPin.blur(); //this makes the cursor dissappear after logging in
    //Display UI and a welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`; //we used split here to only display the first name only
    containerApp.style.opacity = 1;
    updateUi(currentAccount);
  }
});
//Transfering money from 1 user to another user part
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault(); //as always to prevent it from reloading page whenever we press the button as its a form type
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  // console.log(amount, receiverAcc);
  inputTransferAmount.value = inputTransferTo.value = ''; //so we use .value whenever it is a text box and textContent whenever it is just someting to be displayed
  if (
    amount > 0 &&
    receiverAcc /*here we need to check on receiverAcc and do receiverAcc?.username as the first check what it does is it checks that this receiver exists and the 2nd check checks that the sender cannot send to himself*/ &&
    currentAccount.balance >= amount &&
    currentAccount.username !== receiverAcc?.username
  ) {
    // console.log('Transfer successfull');
    //Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUi(currentAccount); //we made a function for update UI so whenever we need to update the UI we call the function instead of having to call the three lines of code each time
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= 0.1 * amount)) {
    //  console.log('Succesfull loan');
    //add movement
    currentAccount.movements.push(amount);
    //Update UI
    updateUi(currentAccount);
    inputLoanAmount.value = '';
  }
});

//Deleting an account from the provided accounts using the new FINDINDEX method i implemnted this part it was only to delete my account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('Delete');
  const accountToDelete = accounts.find(
    acc => acc.username === inputCloseUsername.value
  );
  if (accountToDelete?.pin === Number(inputClosePin.value)) {
    //dont forget whenever we get a value from a textbox in JS we need to convert it first into a number as it will always return as a string using the Number() function
    //  console.log('Deleting account success');
    const indexOfAccToDelete = accounts.findIndex(
      acc => acc.username === accountToDelete.username
    );
    // console.log(indexOfAccToDelete);
    accounts.splice(indexOfAccToDelete, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputCloseUsername.value = inputClosePin.value = '';
  //Some imp notes both the find and the findIndex method get access to the currentindex and the entire array like all the other methods but they proably wont be useful and also both the find and the findindex were added to JS in ES6 SO THEY WONT WORK ON REALLY OLD BROWSERS IMP note but we will take a way to support really old browsers in the near future
});

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  if (sort === false) {
    sort = true;
    displayMovements(currentAccount.movements, sort);
  } else {
    sort = false;
    displayMovements(currentAccount.movements, sort);
  }
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

//let arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr.slice(2)); //it will extract from element 2 till the end of the array (we always start from index 0)
// console.log(arr.slice(2, 4)); //it extracts from 2 till just before element 4
// console.log(arr.slice(-2));
// console.log(arr.slice(1, -2)); //produces b and c as it extracts from 1 and ignores last 2
// //we can use the slice method to create a shallow copy of any array
// console.log(arr.slice()); //we do this by removing all arguments from the slice function
// console.log(...arr); //this is the spread operator and it gives the exact same result to create
//next up is the splice method and it almost works in the same way but the diffrence is that it mutates that original array so it extracts the element from the array for ex if we do in the example below
// console.log(arr.splice(2)); //produces c ,d,e
// console.log(arr); // c ,d and e have been extracted and deleted so what remains is a and b and they have been
//most of the time the value returned by splice dosent interest us what interests us is deleting the data from the array and one comman use case is removing the last element of the array
// arr.splice(-1); //like just the slice method when using negative it will remove from end if you want to learn more about splice just search in mdn documentation
// console.log(arr);
// arr.splice(1, 2); //the first argument here works like the slice method but the 2nd argument here represents the no of elements you want to remove
// console.log(arr);
// //REVERSE
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['f', 'g', 'h', 'i', 'j'];
// console.log(arr2.reverse()); //this will reverse order of array and it mutates it forever
// console.log(arr2);
// //VI to know which arrays mutate and which dont mutate as we may not need to mutate in some cases

// //CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log(...arr, ...arr2); //we can also use the spread opertor like this as well for concatentation and this dose not mutate any of the involved arrays and the spread operator is used for concatentation
// //JOIN
// console.log(letters.join('-')); //this seprates the array with the symbol that we specified

// //the new at method in ES 2022
// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0)); //this does the same thing as selecting element 0 from the array
// //how is the new at method useful
// console.log(arr[arr.length - 1]); //we would have to do that normally if we wanted to get the last element of the array if we dont know the array's length
// //this is another method of getting the last array element using the slice function we learned
// console.log(arr.slice(-1)[0]);//the 0 here means that we select only 1 element and its in square brackets as its not part of slice method its part of normal array
// //the new at method makes this process even easier
// console.log(arr.at(-1)); //that is what we only have to do using at method to get the last element which we are usually interested in
// //when should you use the at and when to use the bracket notation you should use the bracket notation when you start from the start while the at method when you when to start using the back elements of the array and if you want to do something called method chaining then the at method is also perfect for that and the at method also works on strings
// console.log('jonas'.at(-1)); //that is how to use it in strings
// let t = 'jonas'.at(0);
// console.log(t);

// //Looping over an array using the forEach method
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300]; // we wanted to loop for each movement in this array in order to print the movment in this bank account positive values are deposits and negative values are withdrawls
// // for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   //the movement.entries is a method that returns an array the first element is the index and the 2nd element is the element itself and this is how we access the counter variable in the for of loop if we need it
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`); //the math.abs function removes the negative sign from the number
//   }
// }
// console.log(`---FOREACH---`);
// //this will be a lot simpler using the foreach method
// movements.forEach(function (mov, i, arr) {
//   //what the forEach function passes in to the call back function is the element and the index and the entire array and it must be in that order and if i dont need index or array i can not use them if i want to so it is easier to use the count here then using it in the normal for loop
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`); //the math.abs function removes the negative sign from the number
//   }
// }); //remember forEach must have  A CAPITAL E VERY IMPORTANT since for each is a higher order function it requires a callback function in order to tell it what to do so its the forEach method here that will call the callback function we are not calling it ourselves when will it call the callback function what the forEach method does is to loop over the array and in each iteration it will execute this callback function also as the for each calls the call back function in each iteration it will pass in the current element of the array as an argument
// //THIS is how it works in the background the forEachmethod is simpler what it basically does is that for each element in the array it will do the function that you specify
// //0: function(200)
// //1: function(450)
// //2: function(400)
// //...
// //The problem with forEach is that the break and continue functions dont work on it so it will have to loop over the entire array and there is nothing you can do about it so if you really need to break out of the loop then you will have to use the for of loop O.W you should use forEach method for arrays

// //foreach also works with maps and sets
// //This is with a map
// const currencies = new Map([
//   //maps are arrays of arrays where the first element is the key and the 2nd element is the value
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
// currencies.forEach(function (value, key, map) {
//   //same exact divison first element is the value 2nd element is the key and third element is the entire array
//   console.log(`${key}: ${value}`);
// });

// //This is with a set
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, value2, map) {
//   //in sets the first element and 2nd element are both values and the third element is the full set we can use the underscore to show that this is a throw away variable so just skip it and go to the next variable currenciesUnique.forEach(function (value, value2, map) {
//   console.log(`${value2}: ${value}`);
// });

//LEC CHALLENGE
// Coding Challenge #1

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
GOOD LUCK 😀*/
// const juliasDogAges = [9, 16, 6, 8, 3];
// const katesDogAges = [10, 5, 6, 1, 4];
// const checkDogs = function (juliasDogAges, katesDogAges) {
//   const juliasDogAgesCorrected = juliasDogAges.slice(1, 3);
//   const dogAges = juliasDogAgesCorrected.concat(katesDogAges);
//   //console.log(dogAges);
//   dogAges.forEach(function (value, i) {
//     if (value >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${value} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy 🐶`); //always add 1 to i so it makes sense in real life
//     }
//   });
// };
// checkDogs(juliasDogAges, katesDogAges);
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// //The map method
// const eurToUsd = 1.1;
// //basically what the map method does is that it takes an array and does an operation on each element of the array and the diffrence from forEach is that it returns a new array with the new operation done on each element
// //This is more line with functional programming and is better then using loops now a days and in modern JS there is more of a push for functional programming so its the way to go(the new and modern way of doing stuff)
// const movementsUSD = movements.map(mov => mov * eurToUsd); //if we place an arrow function inside an array method that needs a call back we start from the parameters directly we cant declare a function inside a method
// // //like this we have a one liner callback function using the arrow function which makes this whole function very small
// console.log(movements);
// console.log(movementsUSD);
// const movementUSDfor = [];
// for (const mov of movements) movementUSDfor.push(mov * eurToUsd);
// console.log(movementUSDfor); //we here loop over 1 array and manually create a new one and can do it like this but its better to do it the way above

// //just like the for each method the map has access to thr current index as well as the whole array
// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposisted' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescriptions);

//The filter method
//as we said its used to filter for elements that satisfy a certain condition and we use a callback function to specify the condition
//functional programming and this is better here as well for a practical reason where we can chain several functions after each other in one single line similar to what we did in the application
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const deposits = movements.filter(function (mov) {
//   return mov > 0; //how this works it will return only the elements that satisfy this condition to the array
// });
// console.log(movements);
// console.log(deposits);

// //This is doing it using for loops instead of functions
// const depositsFor = [];
// for (const mov of movements) if (mov > 0) depositsFor.push(mov); //this is the way
// console.log(depositsFor);
// const withdrawls = movements.filter(mov => mov < 0);
// console.log(withdrawls); //in the filter method we also get access to current index and whole array but they will proably be rarley used in the filter method

// //finally the reduce method
// const globalBalance = movements.reduce((acc, val) => acc + val, 0); //here there is an extra parameter on the left called the accumlator which represents the value being combined into and then the normal order of parameters with the value then the index and then the entire array and the accumlar is a value that each time we call the call back function is updated based on the old value and the accumlator has another paramter not just the callback function which is the inital value of the accumlator and its default is 0
// console.log(globalBalance);

// //reduce using for loop
// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// //we can use reduce to get maximum value and a lot more the reduce method is a very powerful array method and because of that it can be the harderst one to use we also want to think what the accumlator should be and current value and how they interact
// const max = movements.reduce((acc, val) => {
//   if (acc > val) return acc;
//   else return val;
// }, movements[0]);
// console.log(max);
// // Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
// 3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
// 4. Run the function for both test datasets

// TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
// TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

// GOOD LUCK 😀
// */
// const dogAges = [5, 2, 4, 1, 15, 8, 3];
// const calcAverageHumanAge = function (ages) {
//   // const humanAgeEq = ages.map(age => {
//   //   if (age <= 2) return age * 2;
//   //   else return 16 + age * 4;
//   // });
//   // a better method to do this is with ? instead of if
//   const humanAgeEq = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log(humanAgeEq);
//   const filteredhumanages = humanAgeEq.filter(age => age >= 18);
//   console.log(filteredhumanages);
//   const sumHumanAge = filteredhumanages.reduce((acc, val) => acc + val);
//   console.log(sumHumanAge);
//   const avgHumanAge = sumHumanAge / filteredhumanages.length;
//   console.log(avgHumanAge);
// };
// calcAverageHumanAge(dogAges);

// //Chaining the methods one after another
// //we can chain the map,filter and reduce methods together
// const eurToUsd = 1.1;
// const totalDepositsUsd = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
//     console.log(arr);
//     return mov * eurToUsd;
//   })
//   .reduce((acc, mov) => acc + mov, 0); //this is what we call chaining you can imagine this like a pipeliene where we put data in the beggining and then it goes through all these steps and comes processed out at the end of the pipeline but the problem is its diffcult to debug thats why we can use the array inside all 3 methods to see if the outpututed array of each part is correct or not
// console.log(totalDepositsUsd);
// // Coding Challenge #3

// /*
// Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

// TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
// TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

// GOOD LUCK 😀
// */
// const dogAges_2 = [5, 2, 4, 1, 15, 8, 3];
// const calcAverageHumanAgeUsingChaining = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, val, i, arr) => acc + val / arr.length, 0); //here this was the only way to calcalute the average as we didnt have anywhere to store the adults so the only place to get its length was from the reduce producing the array
// console.log(calcAverageHumanAgeUsingChaining(dogAges));

// //The find method
// //The find method like all the other methods has a condition and accepts a call back function and what it does diffrently from the other methods is it finds a certain element in the array
// const firstWithdrawl = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(firstWithdrawl); //The diffrence from the filter method is that it returns only the first element that satisfies the condition not all the elements that satisfy the condition and an even more important diffrence is that the filter method returns a new array while the find method only returns the element itself
// console.log(accounts);
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account); //this is a really powerful way to get a single object from an array of objects
// //we will use this in the next couple of lectures to implement the login feature and also some other features

//The new find Last and findLastIndex method in ES6 works exactly the same way as find and findindex but finds the last one achieving this condition not the first element
//console.log(movements);
// const lastWithdrawl = movements.findLast(mov => mov < 0);
// // console.log(lastWithdrawl);
// //('Your latest large movement was X movements ago');

// const latestLargeMovement = movements.findLastIndex(mov =>
//   Math.abs(mov > 1000)
// );
// console.log(
//   `Your latest large movement was ${
//     movements.length - latestLargeMovement
//   } movements ago`
// );

//We will now talk about the some and every methods
// console.log(movements);
// console.log(movements.includes(-130)); //what the includes method does is it displays true if the value i stated is within the array and displays false O.W (EQUALITY)
//what the some method does is that it checks whether the array contains any numbers that satisfy a certain condition or not and if it does it returns true O.W it will return false(CONDITION) we could also do the function of includes in some however using include is a lot more simpler and it is already used for that functionality
// console.log(movements.some(mov => mov === -130));
const anyDeposits = movements.some(mov => mov > 5000);
// console.log(anyDeposits);

//EVERY what it does diffrently then some method is that it returns true if every element in the array satisfies the condition
// console.log(movements.every(mov => mov > 0)); // will return false as some are negative

//We can do a seprate callback instead of writing it every time inside the function like this
const deposit = mov => mov > 0; //this is a normal arrow function
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));
//This helps with the DRY principle (dont repeat yourself principle) in some situations

//flat and flatMap method
//what the flat method does is that it flattens any nested array within an array so if an array contains nested arrays it will make it only one array and it also works on multiple levels
const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat()); //will produce [1,2,3,4,5,6,7,8]
const arrDeep = [[[1, 2], 3], [4, [(5, 6)]], 7, 8];
// console.log(arrDeep.flat(2)); //here we need to write 2 inside flat function as its 2 levels of array and by default it is 1 level

//what if we wanted to get the Total bank balance
const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);
const allMovements = accountMovements.flat();
let acc;
const TotalBankSum = allMovements.reduce((acc, mov) => mov + acc); //dont forget since we are placing 2 parameters inside reduce method we need to place brackets around them
// console.log(TotalBankSum);

//Lets try Doing This using chaining

const overBalanceChaining = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => mov + acc);
// console.log(overBalanceChaining);

//it turns out that mapping an array and Flatting it was used a lot so another function was introduced called Flatmap which maps an array then a flattens it and this is also better for preformance

//Using flatMap
const overBalanceChaining2 = accounts
  .flatMap(acc => acc.movements) //the flatMap receives the exact same callback a Map method needs to receive however the flatMap can only go one level deep so if you want to go deeper you will have to use the normal flat method unfortunatley
  .reduce((acc, mov) => mov + acc);
// console.log(overBalanceChaining);
// Coding Challenge #4

/*
This time, Julia and Kate are studying the activity levels of different dog breeds.

YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

TEST DATA:
*/

const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];
const huskyWeight = breeds
  .filter(breed => breed.breed === 'Husky')
  .map((breed, i, arr) => {
    // console.log(arr);
    return breed.averageWeight;
  });
// console.log(huskyWeight);

//The sort method (Strings)
// const owners = ['Jonas', 'Zach', 'Martha', 'Adam'];
// console.log(owners.sort()); //this function will sort the array alphabetically from A to z

//Numbers (incorrect way to sort)
// console.log(movements);
// console.log(movements.sort()); //this sort will sort these numbers as strings by converting them into asci unfortunately thats why to solve this we need to pass in a compare call back function into the sort method

//Numbers (correct way to sort)
//How the sort call back function works
//return <= 0, a,b (keep order)
//return > 0 b,a (switch order)
//the value itself dosent matter all it needs to be is greater or less then 0
//Ascending order
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   else return -1;
// }); //The a and b parameters here represent the first value and the 2nd value after each other in the array if we imagine the sort function looping over the

//Asceding order using improved logic
movements.sort(
  (a, b) => a - b //this is an improved version as a - b equates to a negative number if b > a which is where we dont want to switch so we return it as this works with the logic of the sort function return negative keeps order and when a > b it returns positive number where we want to switch which works with logic of sort function that when we return a positive number or a 0 switch order so we return it
);
// console.log(movements);

//Descending order
// console.log(movements);
movements.sort((a, b) => {
  if (a < b) return 1;
  else return -1;
});
// console.log(movements);

//Descinding using improved logic
movements.sort((a, b) => b - a); //here it will be b - a as it will be opposite logic
// console.log(movements);
//so always a - b for ascending and b - a for descending

//However if you have a mixed array of strings and numbers this will not work and i advise you not to use the sort method in this case as it will be easier to create a function
