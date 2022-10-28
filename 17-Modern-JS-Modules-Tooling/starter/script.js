// Importing module
// import { addToCart, totalPrice as price, tq } from './shoppingCart.js';
// console.log("Importing module");
// addToCart('bread', 5)
// console.log(price,tq);

console.log('Importing module');
// console.log(shippingCost);

// import * as ShoppingCart from './shoppingCart.js'
// ShoppingCart.addToCart('bread', 5);
// console.log(ShoppingCart.totalPrice);

// Avoid that
// import add, { addToCart, totalPrice as price, tq } from './shoppingCart.js'
// console.log(price);

import add, {cart} from './shoppingCart.js'
add('pizza', 2);
add('bread', 5);
add('apples', 4);

console.log(cart);

// Work outside async function! *Only in modules*
// Blocking
// console.log('Start fetching');
// const res = await fetch('https://jsonplaceholder.typicode.com/posts')
// const data = await res.json();
// console.log(data);
// console.log('Something');

const getLastPost = async function(){
  const res = await fetch('https://jsonplaceholder.typicode.com/posts')
  const data = await res.json();
  console.log(data);

  return {title:data.at(-1).title, text:data.at(-1).body}
}

// Returns a Promise - async function always return a Promise
const lastPost = getLastPost();
console.log(lastPost);

// Not very clean
lastPost.then(last=>console.log(last))

// Cleaner!
const lastPost2 = await getLastPost();
console.log(lastPost2);

// import cloneDeep from './node_modules/lodash-es/cloneDeep.js';
import cloneDeep from 'lodash-es'

const state = {
  cart:
    [{ product: 'bread', quantity: 5 },
      { product: 'pizza', quantity: 5 }],
  user: { loggedIn: true }
};
const stateClone = Object.assign({}, state)
const stateDeepClone = cloneDeep(state);

state.user.loggedIn = false;
console.log(stateClone);

console.log(stateDeepClone);

// Injecting changes within modules to the browser
// without reloading the page
if(module.hot){
  module.hot.accept()
}

console.log(cart.find(el=>el.quantity>=2));
Promise.resolve('TEST').then(x=>console.log(x))

import 'core-js/stable'
// import 'core-js/stable/array/find'
// import 'core-js/stable/promise'

// Polyfilling async functions
import 'regenerator-runtime/runtime'
