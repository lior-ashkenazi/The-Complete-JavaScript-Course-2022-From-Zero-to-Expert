'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector("#section--1");
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});


// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
    section1.scrollIntoView({behavior: "smooth"});
});

///////////////////////////////////////
// Page navigation

/*document.querySelectorAll('.nav__link').forEach(function (elem) {
    elem.addEventListener('click', function (ev) {
        ev.preventDefault();
        const id = this.getAttribute('href');
        document.querySelector(id).scrollIntoView({behavior: "smooth"});
    });
});*/

// Event Delegation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector(".nav__links").addEventListener('click', function (ev) {
    ev.preventDefault();

    // Matching strategy
    if (ev.target.classList.contains('nav__link')) {
        const id = ev.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({behavior: "smooth"});
    }
});

// Tabbed component

tabsContainer.addEventListener('click', function (ev) {
    const clicked = ev.target.closest('.operations__tab');

    // Guard clause
    if (!clicked) return;

    // Remove active classes
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    tabsContent.forEach(t => t.classList.remove('operations__content--active'));
    clicked.classList.add('operations__tab--active');

    // Active content area
    document.querySelector(`.operations__content--${clicked.dataset.tab}`)
            .classList.add('operations__content--active');
});

// Menu fade animation
// Mouseenter is similar but for that it doesn't bubble-up
// we want to use delegation therefore we 'mouseover' instead

const handleHover = function (ev) {
    if (ev.target.classList.contains('nav__link')) {
        const link = ev.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(el => {
            if (el !== link) el.style.opacity = this;
        });
        logo.style.opacity = this;
    }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

// the opposite of 'mouseover'
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation
const initCoords = section1.getBoundingClientRect();

// not efficient! DO NOT USE
window.addEventListener('scroll', function (ev) {
    if (window.scrollY > initCoords.top) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
});

// Sticky navigation: Intersection Observer API

/*const obsCallback = function(entries, observer){
    entries.forEach(entry => )
}

const obsOptions = {
    root:null, // null means that intersecting the entire viewport
    threshold: [0, 0.2]
}

const observer = new IntersectionObserver(obsCallback,obsOptions);
observer.observe(section1)*/

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav,
                                                {
                                                    root: null,
                                                    threshold: 0,
                                                    rootMargin: `-${navHeight}px`
                                                });
headerObserver.observe(header);

// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSections = function (entries, observer) {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('section--hidden');
        observer.unobserve(entry.target);
    });
};

const sectionObserver = new IntersectionObserver(revealSections,
                                                 {
                                                     root: null,
                                                     threshold: 0.15
                                                 });
allSections.forEach(section => {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});

// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImages = function (entries, observer) {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.src = entry.target.dataset.src;

        entry.target.addEventListener('load',
                                      () => entry.target.classList.remove(
                                          'lazy-img'));
        observer.unobserve(entry.target);
    });
};

const imgObserver = new IntersectionObserver(loadImages, {
    root: null,
    threshold: 0,
    rootMargin: '200px'
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');

    const maxSlide = slides.length - 1;
    let curSlide = 0;

// const slider = document.querySelector('.slider');
// slider.style.transform = 'scale(0.5';
// slider.style.overflow = 'scale(0.5)';

    const createDots = function () {
        slides.forEach((_, i) => {
            dotContainer.insertAdjacentHTML('beforeend',
                                            `<button class="dots__dot" data-slide="${i}"></button>`
            );
        });
    };

    const activateDot = function (slide) {
        document.querySelectorAll('.dots__dot')
                .forEach(dot => dot.classList.remove('dots__dot--active'));

        document.querySelector(`.dots__dot[data-slide="${slide}"]`)
                .classList
                .add('dots__dot--active');
    };

    const goToSlide = function (slide = 0) {
        slides.forEach((s, i) => s.style.transform =
            `translateX(${100 * (i - slide)}%)`);
        activateDot(slide);
    };

    const prevSlide = function () {
        curSlide = !curSlide ? maxSlide : --curSlide;
        goToSlide(curSlide);
    };

    const nextSlide = function () {
        curSlide = curSlide === maxSlide ? 0 : ++curSlide;
        goToSlide(curSlide);
    };

    const init = function () {
        createDots();
        goToSlide();
    };
    init();

// Event handlers
// Previous slide
    btnLeft.addEventListener('click', prevSlide);

// Next slide
    btnRight.addEventListener('click', nextSlide);

    document.addEventListener('keydown', function (ev) {
        // short-circuiting!
        ev.key === 'ArrowLeft' && prevSlide();
        ev.key === 'ArrowRight' && nextSlide();
    });

    dotContainer.addEventListener('click', function (ev) {
        if (ev.target.classList.contains('dots__dot')) {
            curSlide = Number(ev.target.dataset.slide);
            goToSlide(curSlide);
        }
    });
};
slider();

///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

/*// Selecting elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

// otherwise
const header = document.querySelector('.header'); // first element
const allSections = document.querySelectorAll('.section'); // all elements
console.log(allSections);

// we don't need a selector here, namely '#' before writing
// the element ID - that's for the querySelector methods
document.getElementById('section--1');
// returns HTML collection
// HTML collection updates automatically, unlike NodeList (returned from querySelectorAll())
const allButtons = document.getElementsByTagName('button');
console.log(allButtons);

// also returns HTML collection
document.getElementsByClassName('btn');

// Creating and inserting elements
const msg = document.createElement('div');
msg.classList.add('cookie-message');
// msg.textContent = "We use cookies for improves functionality and analytics.";
msg.innerHTML = 'We use cookies for improves functionality and analytics. ' +
                '<button class="btn btn--close-cookie">Got it!</button>';

// We move elements, msg is unique!
// header.prepend(msg);
header.append(msg);

// header.before(msg);
// header.after(msg);

// Delete elements
document.querySelector('.btn--close-cookie').addEventListener('click', function () {
    msg.remove();
    // msg.parentElement.removeChild(msg) DOM traversing
});

// Styles
msg.style.backgroundColor = '#37383d';
msg.style.width = '120%';

console.log(msg.style.height); // doesn't work
console.log(msg.style.backgroundColor); // works

console.log(getComputedStyle(msg).color);
console.log(getComputedStyle(msg).height);

msg.style.height = Number.parseFloat(getComputedStyle(msg).height) + 30 + 'px';

document.documentElement.style.setProperty('--color-primary', 'orangered');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo';

// Non-standard
console.log(logo.designer); // doesn't work
console.log(logo.getAttribute('designer'));
logo.setAttribute('company', 'Bankist');

console.log(logo.src);
console.log(logo.getAttribute('src')); // use this one

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data attributes
// Store data in the HTML code - it can be useful
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c', 'j');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes

// Don't use - overrides all the exiting classes
logo.className = 'jonas';*/

/*
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector("#section--1");

btnScrollTo.addEventListener('click', function (e) {
    const s1coords1 = section1.getBoundingClientRect();


    // Scrolling
    /!*window.scrollTo(s1coords1.left + window.scrollX,
                    s1coords1.top + window.scrollY);*!/

    /!*   window.scrollTo({
                           left: s1coords1.left + window.scrollX,
                           top: s1coords1.top + window.scrollY,
                           behavior: "smooth"
                       });*!/

    // more modern way
    section1.scrollIntoView({behavior: "smooth"});
});
*/

/*const alertH1 = function (ev) {
    alert("addEventListener: Great! You are reading the heading :D");

    // listen to an event once - first way
    h1.removeEventListener('mouseenter', alertH1);
};

const h1 = document.querySelector('h1');
h1.addEventListener(
    'mouseenter', alertH1
);

// listen an event once - second way (depends on time)
setTimeout(() => removeEventListener('mouseenter', alertH1), 3000);

// equivalent way to assign an event a function
/!*h1.onmouseenter = function (ev) {
    alert("Jonas unfortunately has a weird smile");
};*!/

// first way is better:
//      1. can append functions
//      2. we can remove a function from an event

// rgb(255, 255, 255)
const randomInt = (min, max) => Math.floor((Math.random() * (max - min + 1) + min));
const randomColor = () => `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (ev) {
    this.style.backgroundColor = randomColor();
    console.log('LINK', ev.target, ev.currentTarget);
    // ev.currentTarget === this

    // Stop propagation
    ev.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (ev) {
    this.style.backgroundColor = randomColor();
    console.log('CONTAINER', ev.target, ev.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (ev) {
    this.style.backgroundColor = randomColor();
    console.log('NAV', ev.target, ev.currentTarget);
});*/

/*
const h1 = document.querySelector('h1');

// Going downwards: child
// It doesn't have to be *direct* children!
console.log(h1.querySelectorAll('.highlight'));
// Nodes of "everything" - of every single type that exists
console.log(h1.childNodes);
// HTML collection ("live collection") of *direct* child *elements*
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards: parents
console.log(h1.parentNode);
// Usually the one we interested in
console.log(h1.parentElement);

// the closest ancestor of that class type
h1.closest('.header').style.background = 'var(--gradient-secondary)';
// you can be an ancestor of yourself
h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

// a trick to get all the siblings of an element
console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (elem) {
    if (elem !== h1) elem.style.transform = 'scale(0.5)';
});
*/
