'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTO = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

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

//Scrolling

btnScrollTO.addEventListener('click', e => {
  e.preventDefault();

  section1.scrollIntoView({ behavior: 'smooth' });
});

////////// page Navigation

// document.querySelectorAll('.nav__link').forEach(navLink =>
//   navLink.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// );

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//Tabbed Component

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// tabs.forEach(tab =>
//   tab.addEventListener('click', e => {
//     console.log('tab');
//   })
// );

tabsContainer.addEventListener('click', e => {
  const clicked = e.target.closest('.operations__tab');

  // Guard Cluse
  if (!clicked) return;

  // Remove Active Class
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  tabsContent.forEach(tab =>
    tab.classList.remove('operations__content--active')
  );

  // Activate Tab
  clicked.classList.add('operations__tab--active');

  // Activate Content Area

  console.log(clicked.dataset.tab);
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Handler Opacity Nav Links

const nav = document.querySelector('.nav');

const handlerHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handlerHover.bind(0.5));
nav.addEventListener('mouseout', handlerHover.bind(1));

// Sticky Navigation

// const initialCoords = section1.getBoundingClientRect();

// window.addEventListener('scroll', () => {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const obsHeader = entries => {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const observer = new IntersectionObserver(obsHeader, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
observer.observe(header);

// Reveal Section

const allSections = document.querySelectorAll('.section');

const revealSection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.1,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

//Lazy Loading Images

const imgTarget = document.querySelectorAll('img[data-src]');
const loadingImg = (entries, observer) => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadingImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTarget.forEach(img => imgObserver.observe(img));

// slide

const slides = document.querySelectorAll('.slide');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');
const containerDots = document.querySelector('.dots');

const createDots = () => {
  slides.forEach((_, i) => {
    containerDots.insertAdjacentHTML(
      'beforeend',
      `<button class='dots__dot' data-slide='${i}'></button>`
    );
  });
};
createDots();

const activatedDot = slide => {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide='${slide}']`)
    .classList.add('dots__dot--active');
};
activatedDot(0);

let curSlide = 0;

const goToSlide = slide => {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slide)}%)`;
  });
};
goToSlide(0);

const nextSlide = () => {
  if (curSlide === slides.length - 1) curSlide = 0;
  else curSlide++;

  goToSlide(curSlide);
  activatedDot(curSlide);
};

const prevSlide = () => {
  if (curSlide === 0) curSlide = slides.length - 1;
  else curSlide--;
  goToSlide(curSlide);
  activatedDot(curSlide);
};

btnRight.addEventListener('click', nextSlide);

btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
  e.key === 'ArrowRight' && nextSlide();
  e.key === 'ArrowLeft' && prevSlide();
});

containerDots.addEventListener('click', e => {
  if (e.target.classList.contains('dots__dot')) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
    activatedDot(slide);
    curSlide = +slide;
  }
});
