'use strict';


class Workout {
  date = new Date();
  // + '' means converting to a string
  id = (Date.now() + '').slice(-10);

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
  }

  _setDescription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November',
                    'December'];

    this.description =
      `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevation = elevationGain;
    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    // km/h
    this.speed = this.distance / (this.duration / 60);
  }
}

// const run1 = new Running([39, -12], 5.2, 24, 178)
// const cycling1 = new Cycling([39, -12], 27, 95, 523)
// console.log(run1,cycling1);

///////////////////////////////////////////////////////////
// APPLICATION ARCHITECTURE

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class App {
  #map;
  #mapZoomLvl = 17;
  #mapEvent;
  #workouts = [];

  constructor() {
    // Get user's position
    this._getPosition();

    // Get data from local storage

    // Attach event handlers
    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField);
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),
                                               function() {
                                                 alert(
                                                   'Could not get your position');
                                               });
  }

  _loadMap(position) {
    // destructing
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(`https://www.google.com/maps/@${latitude},${longitude},15z`);

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#mapZoomLvl);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);


    // Handling clicks on map
    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => this._renderWorkoutMarker(work));
  }

  _showForm(ev) {
    this.#mapEvent = ev;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    // Empty inputs
    inputDistance.value =
      inputDuration.value = inputCadence.value = inputElevation.value = '';
    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => form.style.display = 'grid', 1000);
  }

  _toggleElevationField() {
    inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
    inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(ev) {
    const validInputs = (...inputs) => inputs.every(inp => Number.isFinite(inp));
    const allPositive = (...inputs) => inputs.every(inp => inp > 0);

    ev.preventDefault();

    // Get data from form
    const type = inputType.value;
    // Note that the '+' is for converting a string to an integer apparently
    const distance = +inputDistance.value;
    const duration = +inputDuration.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let workout;

    // If workout running, create running object
    if (type === 'running') {
      const cadence = +inputCadence.value;
      // Check if data is valid
      if (!validInputs(distance, duration, cadence) ||
          !allPositive(distance, duration, cadence)) {
        return alert('Invalid form input');
      }
      workout = new Running([lat, lng], distance, duration, cadence);
    }


    // If workout cycling, create cycling object
    if (type === 'cycling') {
      // Check if data is valid
      const elevation = +inputElevation.value;
      if (!validInputs(distance, duration, elevation) ||
          !allPositive(distance, duration)) {
        return alert('Invalid form input');
      }
      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    // Add new object to workout array
    this.#workouts.push(workout);

    // Render workout on map as marker
    // destructing
    this._renderWorkoutMarker(workout);

    // Render workout on list
    this._renderWorkout(workout);

    // Hide form + Clear input fields
    this._hideForm();

    // Set local storage to all workouts
    this._setLocalStorage();
  }

  _renderWorkoutMarker(workout) {
    L.marker(workout.coords).addTo(this.#map)
     .bindPopup(L.popup({
                          maxWidth: 250,
                          minWidth: 100,
                          autoClose: false,
                          closeOnClick: false,
                          className: `${workout.type}-popup`
                        }))
     .setPopupContent(`${workout.type === 'running' ? '🏃' :
                         '🚴'} ${workout.description}`)
     .openPopup();
  }

  _renderWorkout(workout) {
    let html = `
    <li class='workout workout--${workout.name}' data-id='${workout.id}'>
      <h2 class='workout__title'>${workout.description}</h2>
      <div class='workout__details'>
        <span class='workout__icon'>${workout.type === 'running' ? '🏃' : '🚴'}</span>
        <span class='workout__value'>${workout.distance}</span>
        <span class='workout__unit'>km</span>
      </div>
      <div class='workout__details'>
        <span class='workout__icon'>⏱</span>
        <span class='workout__value'>${workout.duration}</span>
        <span class='workout__unit'>min</span>
      </div>`;
    if (workout.type === 'running') html += `
    <div class='workout__details'>
        <span class='workout__icon'>⚡️</span>
        <span class='workout__value'>${workout.pace.toFixed(1)}</span>
        <span class='workout__unit'>min/km</span>
      </div>
      <div class='workout__details'>
        <span class='workout__icon'>🦶🏼</span>
        <span class='workout__value'>${workout.cadence}</span>
        <span class='workout__unit'>spm</span>
      </div>
    </li>`;
    if (workout.type === 'cycling') html += `
    <div class='workout__details'>
        <span class='workout__icon'>⚡️</span>
        <span class='workout__value'>${workout.speed.toFixed(1)}</span>
        <span class='workout__unit'>km/h</span>
      </div>
      <div class='workout__details'>
        <span class='workout__icon'>⛰</span>
        <span class='workout__value'>${workout.elevation}</span>
        <span class='workout__unit'>m</span>
      </div>
    </li>`;

    form.insertAdjacentHTML('afterend', html);
  }

  _moveToPopup(ev) {
    const workoutElem = ev.target.closest('.workout');

    if (!workoutElem) return;

    const workout = this.#workouts.find(work => work.id ===
                                                workoutElem.dataset.id);

    // more details about passing this options objects in Leaflet's setView
    // documentation
    this.#map.setView(workout.coords, this.#mapZoomLvl, {
      animate: true,
      pan: { duration: 1 }
    });
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data;
    this.#workouts.forEach(work => this._renderWorkout(work));
  }

  reset(){
    localStorage.removeItem('workouts');
    location.reload();
  }
}

const app = new App();
