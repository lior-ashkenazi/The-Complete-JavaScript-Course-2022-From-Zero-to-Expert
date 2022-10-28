'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
    const html = `
        <article class='country ${className}'>
          <img class='country__img' src='${data.flag}' />
          <div class='country__data'>
            <h3 class='country__name'>${data.name}</h3>
            <h4 class='country__region'>${data.region}</h4>
            <p class='country__row'><span>👫</span>${(+data.population /
                                                     1000000).toFixed(1)}</p>
            <p class='country__row'><span>🗣️</span>${data.languages[0].name}</p>
            <p class='country__row'><span>💰</span>${data.currencies[0].name}</p>
          </div>
        </article>`;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
};

const renderError = function (msg) {
    countriesContainer.insertAdjacentText('beforeend', msg);
    countriesContainer.style.opacity = 1;
};

///////////////////////////////////////

/*const getCountryData = function(country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send();
  console.log(request.responseText);

  request.addEventListener('load', function() {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    const html = `
        <article class='country'>
          <img class='country__img' src="${data.flag}" />
          <div class='country__data'>
            <h3 class='country__name'>${data.name}</h3>
            <h4 class='country__region'>${data.region}</h4>
            <p class='country__row'><span>👫</span>${(+data.population / 1000000).toFixed(1)}</p>
            <p class='country__row'><span>🗣️</span>${data.languages[0].name}</p>
            <p class='country__row'><span>💰</span>${data.currencies[0].name}</p>
          </div>
        </article>`;
    countriesContainer.insertAdjacentHTML('beforeend', html)
    countriesContainer.style.opacity = 1;
  });
}*/

/*const getCountryAndNeighbour = function(country) {

  // AJAX call country 1
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v2/name/${country}`);
  request.send();

  request.addEventListener('load', function() {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    // Render country 1
    renderCountry(data);

    // Get neighbour country 2
    const neighbour = data.borders?.[0];

    if (!neighbour) return;

    // AJAX call country 2
    const request2 = new XMLHttpRequest();
    request2.open('GET', `https://restcountries.com/v2/alpha/${neighbour}`);
    request2.send();

    request2.addEventListener('load', function() {
      const data2 = JSON.parse(this.responseText);
      renderCountry(data2, 'neighbour');
    });
  });
};

getCountryAndNeighbour('israel');*/

const getJSON = function (url, errorMsg = `Something went wrong 💥💥💥`) {
    return fetch(url).then(response => {
        if (!response.ok) throw new Error(`${errorMsg} (${response.status})`);
        return response.json();
    });
};

/*const getCountryData = function(country) {
  // Country 1
  fetch(`https://restcountries.com/v2/name/${country}`)
    .then(response => {
      if(!response.ok) throw new Error(`Country not found (${response.status})`)

      return response.json()
    })
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];

      if (!neighbour) return;

      // Country 2
      return fetch(`https://restcountries.com/v2/alpha/${neighbour}`);
    })
    .then(response => {
      if(!response.ok) throw new Error(`Country not found (${response.status})`)
      return response.json()
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err=>{
      console.error(`${err} 💥💥💥`)
      renderError(`Something went wrong 💥💥💥 ${err.message}. Try again!`)
    })
    .finally(()=>{
      countriesContainer.style.opacity = 1
    });
};*/

/*
const getCountryData = function(country) {
  // Country 1
  getJSON(`https://restcountries.com/v2/name/${country}`,
          'Country not found.')
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders?.[0];

      if (!neighbour) throw new Error('No neighbour found.');

      // Country 2
      return getJSON(`https://restcountries.com/v2/alpha/${neighbour}`,
                     'Country not found.');
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => {
      console.error(`${err} 💥💥💥`);
      renderError(`Something went wrong 💥💥💥 ${err.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function() {
  getCountryData('israel');
});

getCountryData('fgdhjdfghgf');*/

/*const lotteryPromise = new Promise(function(resolve, reject) {
  console.log('Lottery draw is happening 🔮');
  setTimeout(function(){
    if (Math.random() >= 0.5) resolve('You WIN 💰');
    else reject(new Error('You lost your money 💩'));
  }, 2000)
});

lotteryPromise.then(res => console.log(res)).catch(err => console.error(err))

// Promisifying setTimeout
const wait = (seconds) =>new Promise(function(resolve){
    setTimeout(resolve, seconds * 1000)
  })

wait(2).then(()=>{
  console.log('I waited for 2 seconds')
  return wait(1)
}).then(()=>console.log('I waited for 1 second'))

Promise.resolve('abc').then(x=>console.log(x))
Promise.reject(new Error('abc')).catch(x=>console.error(x))*/


/*const getPosition = function() {
  return new Promise(function(resolve, reject) {
    // navigator.geolocation.getCurrentPosition(pos => resolve(pos),
    //                                          err => reject(err));
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// getPosition().then(pos=>console.log(pos)).catch(err=>console.error(err))

const whereAmI = function() {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;
      return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);
      return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);
      return res.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.error(`${err.message} 💥`));
};*/

// btn.addEventListener('click', whereAmI);

/*const wait = (seconds) => new Promise(function(resolve) {
  setTimeout(resolve, seconds * 1000);
});

const imgContainer = document.querySelector('.images');

const createImage = function(imgPath) {
  return new Promise(function(resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;
    img.addEventListener('load', function() {
      imgContainer.append(img);
      resolve(img);
    });

    img.addEventListener('error', function() {
      reject(new Error('Wrong image path.'));
    });
  });
};

let currentImg;

createImage('img/img-1.jpg')
  .then(img => {
    currentImg = img;
    console.log('Image 1 loaded');
    return wait(2);
  })
  .then(() => {
  currentImg.style.display = 'none';
  return createImage('img/img-2.jpg');
}).then(img => {
  currentImg = img;
  console.log('Image 2 loaded');
  return wait(2);
}).then(() => currentImg.style.display = 'none')
  .catch(err => console.error(err));*/

const getPosition = function () {
    return new Promise(function (resolve, reject) {
        // navigator.geolocation.getCurrentPosition(pos => resolve(pos),
        //                                          err => reject(err));
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

const whereAmI = async function () {
    try {
        // Geolocation
        const pos = await getPosition();
        const {latitude: lat, longitude: lng} = pos.coords;

        // Reverse geocoding
        const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
        if (!resGeo.ok) throw new Error('Problem getting location data');
        const dataGeo = await resGeo.json();

        // Country data
        // Previous version
        // fetch(`https://restcountries.eu/rest/v2/name/${country}`)
        //   .then(res => console.log(res));
        // New version
        const res = await fetch(`https://restcountries.com/v2/name/${dataGeo.country}`);
        if (!res.ok) throw new Error('Problem getting country');
        const data = await res.json();
        renderCountry(data[0]);

        return `You are in ${dataGeo.city}, ${dataGeo.country}`;
    } catch (err) {
        console.error(err);
        renderError(`Something went wrong 💥 ${err.message}`);

        // Reject promise returned from async function
        throw err;
    }
};

console.log('1: Will get location');
// const city = whereAmI('israel');
// console.log(city);

// whereAmI()
//   .then(city => console.log(`2: ${city}`))
//   .catch(err => console.error(`2: ${err.message}`))
//   .finally(()=>console.log('3: Finished getting location'));

/*
(async function(){
  try{
    const city = await whereAmI();
    console.log(`2: ${city}`)
  } catch(err) {
    console.error(`2: ${err.message}`);
  }
  console.log('3: Finished getting location');
})();
*/

/*const get3Countries = async function(c1, c2, c3) {
  try {
    // const [data1] = await getJSON(`https://restcountries.com/v2/name/${c1}`);
    // const [data2] = await getJSON(`https://restcountries.com/v2/name/${c2}`);
    // const [data3] = await getJSON(`https://restcountries.com/v2/name/${c3}`);

    // console.log([data1.capital, data2.capital, data3.capital]);

    // Promise.all short-circuits if one promise rejects - meaning if
    // one promise "fails", all the other promises fail (reject) as well
    const data = await Promise.all([
                                     getJSON(`https://restcountries.com/v2/name/${c1}`),
                                     getJSON(`https://restcountries.com/v2/name/${c2}`),
                                     getJSON(`https://restcountries.com/v2/name/${c3}`)]);

    console.log(data.map(d => d[0].capital));
  } catch (err) {
  }
};
get3Countries('israel', 'peru', 'thailand');*/

/*// Promise.race
(async function () {
    const res = await Promise.race([getJSON(`https://restcountries.com/v2/name/italy`),
                                    getJSON(`https://restcountries.com/v2/name/egypt`),
                                    getJSON(`https://restcountries.com/v2/name/mexico`)]);
    console.log(res[0]);
})();

const timeout = function (sec) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error('Request took too long.'));
        }, sec * 1000);
    });
};

Promise.race([getJSON(`https://restcountries.com/v2/name/sweden`),
              timeout(0.2)])
       .then(res => console.log(res[0]))
       .catch(err => console.error(err));

// Promise.allSettled
Promise.allSettled([Promise.resolve('Success'),
                    Promise.reject('ERROR'),
                    Promise.resolve('Another Success')])
       .then(res => console.log(res))
       .catch(err => console.error(err));

// Promise.any [ES2021]
Promise.any([Promise.resolve('Success'),
                    Promise.reject('ERROR'),
                    Promise.resolve('Another Success')])
       .then(res => console.log(res))
       .catch(err => console.error(err));*/

const wait = (seconds) => new Promise(function(resolve) {
  setTimeout(resolve, seconds * 1000);
});

const imgContainer = document.querySelector('.images');

const createImage = function(imgPath) {
  return new Promise(function(resolve, reject) {
    const img = document.createElement('img');
    img.src = imgPath;
    img.addEventListener('load', function() {
      imgContainer.append(img);
      resolve(img);
    });
    img.addEventListener('error', function() {
      reject(new Error('Wrong image path.'));
    });
  });
};

/*let currentImg;

createImage('img/img-1.jpg')
  .then(img => {
    currentImg = img;
    console.log('Image 1 loaded');
    return wait(2);
  })
  .then(() => {
  currentImg.style.display = 'none';
  return createImage('img/img-2.jpg');
}).then(img => {
  currentImg = img;
  console.log('Image 2 loaded');
  return wait(2);
}).then(() => currentImg.style.display = 'none')
  .catch(err => console.error(err));*/


// Coding Challenge 3 (the only one I bothered to write a title to)
// PART 1
const loadNPause = async function(){
  try{
    // Load image 1
    let img = await createImage('img/img-1.jpg')
    console.log('Image 1 loaded');
    await wait(2)
    img.style.display = 'none'

    // Load image 2
    img = await createImage('img/img-2.jpg')
    console.log('Image 2 loaded');
    await wait(2)
    img.style.display = 'none'


  }catch(err){
    console.error(err);
  }
}
// loadNPause();

// PART 2
const loadAll = async function(imgArr){
  try{
    const imgs = imgArr.map(async img => await createImage(img))
    const imgsEl = await Promise.all(imgs)
    imgsEl.forEach(img=>img.classList.add('parallel'))
  } catch(err){
    console.error(err)
  }
}
loadAll(['img/img-1.jpg',
         'img/img-2.jpg',
         'img/img-3.jpg'])