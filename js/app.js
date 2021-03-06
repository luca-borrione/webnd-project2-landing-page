/**
 *
 * Manipulating the DOM exercise.
 * Exercise programmatically builds navigation,
 * scrolls to anchors from navigation,
 * and highlights section in viewport upon scrolling.
 *
 * Dependencies: None
 *
 * JS Version: ES2015/ES6
 *
 * JS Standard: ESlint
 *
 */

function myCustomEvent(event, params = { bubbles: false, cancelable: false, detail: undefined }) {
  const customEvent = document.createEvent('CustomEvent');
  customEvent.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
  return customEvent;
}
myCustomEvent.prototype = window.Event.prototype;

if (typeof window.CustomEvent !== 'function') {
  window.CustomEvent = myCustomEvent;
}

/**
 * Define Global Variables
 *
 */

const ACTIVE_CLASS = 'active';
const HIDDEN_CLASS = 'hidden';
const SCROLL_END = 'SCROLL_END';

const state = {
  navBarListElement: null,
  pageHeader: null,
  scrollTimeoutId: null,
  sectionList: null,
};

/**
 * End Global Variables
 * Start Helper Functions
 *
 */

function isScrollIntoViewSupported() {
  return 'scrollIntoView' in Element.prototype;
}

function isScrollToSupported() {
  return 'scrollTo' in window;
}

function isSmoothScrollSupported() {
  return 'scrollBehavior' in document.documentElement.style;
}

function isInViewport(element) {
  let top = element.offsetTop;
  let left = element.offsetLeft;
  const width = element.offsetWidth;
  const height = element.offsetHeight;

  let parentElement = element;
  while (parentElement.offsetParent) {
    parentElement = parentElement.offsetParent;
    top += parentElement.offsetTop;
    left += parentElement.offsetLeft;
  }

  return (
    top < window.pageYOffset + window.innerHeight &&
    left < window.pageXOffset + window.innerWidth &&
    top + height > window.pageYOffset &&
    left + width > window.pageXOffset
  );
}

function getSectionTitle(section) {
  return section.getElementsByTagName('h2')[0];
}

function getActiveSection() {
  return state.sectionList.find((section) => section.classList.contains(ACTIVE_CLASS));
}

function getActiveMenuLink() {
  return state.navBarListElement.getElementsByClassName(ACTIVE_CLASS)[0];
}

function getMenuLinkBySectionId(sectionId) {
  return state.navBarListElement.querySelector(`a[data-section-id=${sectionId}]`);
}

function getSectionInViewport() {
  const { sectionList } = state;
  let section;
  let sectionTitle;

  for (let i = 0; i < sectionList.length; i++) {
    section = sectionList[i];
    sectionTitle = getSectionTitle(section);
    if (isInViewport(sectionTitle)) {
      return section;
    }
  }

  return null;
}

function createNavMenuItem({ navLabel, sectionId }) {
  const navMenuItem = document.createElement('li');
  navMenuItem.innerHTML = `
    <a href="#${sectionId}" class="menu__link" data-section-id="${sectionId}">
      ${navLabel}</a>
  `;
  return navMenuItem;
}

function setActiveSection(section) {
  const activeSection = getActiveSection();
  if (activeSection && activeSection !== section) {
    activeSection.classList.remove(ACTIVE_CLASS);
  }
  if (!section.classList.contains(ACTIVE_CLASS)) {
    section.classList.add(ACTIVE_CLASS);
  }
}

function resetActiveSection() {
  const activeSection = getActiveSection();
  if (activeSection) {
    activeSection.classList.remove(ACTIVE_CLASS);
  }
}

function setActiveMenuLink(sectionId) {
  const activeMenuLink = getActiveMenuLink();
  if (activeMenuLink && activeMenuLink.dataset.sectionId !== sectionId) {
    activeMenuLink.classList.remove(ACTIVE_CLASS);
  }
  const menuLink = getMenuLinkBySectionId(sectionId);
  if (!menuLink.classList.contains(ACTIVE_CLASS)) {
    menuLink.classList.add(ACTIVE_CLASS);
  }
}

function resetActiveMenuLink() {
  const activeMenuLink = getActiveMenuLink();
  if (activeMenuLink) {
    activeMenuLink.classList.remove(ACTIVE_CLASS);
  }
}

function hidePageHeader() {
  const { pageHeader } = state;
  // pageHeader.style.display = 'none';
  pageHeader.classList.add(HIDDEN_CLASS);
}

function showPageHeader() {
  const { pageHeader } = state;
  // pageHeader.style.display = 'block';
  pageHeader.classList.remove(HIDDEN_CLASS);
}

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav
const buildNavMenu = () => {
  const { navBarListElement, sectionList } = state;
  const navMenuFragment = sectionList.reduce((fragment, section, index) => {
    const sectionId = section.id;
    const navLabel = section.dataset.nav;
    const active = index === 0;
    const navMenuItem = createNavMenuItem({ active, navLabel, sectionId });
    fragment.append(navMenuItem);
    return fragment;
  }, new DocumentFragment());

  navBarListElement.appendChild(navMenuFragment);
};

// Add class 'active' to section when near top of viewport
function setActiveElements() {
  const sectionInViewport = getSectionInViewport();
  if (sectionInViewport) {
    setActiveSection(sectionInViewport);
    setActiveMenuLink(sectionInViewport.id);
  } else {
    resetActiveSection();
    resetActiveMenuLink();
  }
}

// Scroll to anchor ID using scrollTO event
function scrollToSection(sectionId) {
  const targetSection = document.getElementById(sectionId);
  const behavior = 'smooth';

  if (isScrollIntoViewSupported() && isSmoothScrollSupported()) {
    targetSection.scrollIntoView({ behavior });
    return true;
  }

  if (isScrollToSupported()) {
    const top = targetSection.offsetTop;
    window.scrollTo({ top, behavior });
    return true;
  }

  return false;
}

/**
 * End Main Functions
 * Begin Events
 *
 */

function scrollEnded() {
  const scrollEndEvent = new Event(SCROLL_END);
  window.dispatchEvent(scrollEndEvent);
}

window.addEventListener(
  'scroll',
  () => {
    const { scrollTimeoutId } = state;
    clearTimeout(scrollTimeoutId);
    state.scrollTimeoutId = setTimeout(scrollEnded, 250);
    hidePageHeader();
  },
  false
);

// Build menu
window.addEventListener('DOMContentLoaded', () => {
  state.navBarListElement = document.getElementById('navbar__list');
  state.sectionList = [...document.getElementsByTagName('section')];
  state.pageHeader = document.querySelector('header.page__header');

  buildNavMenu();

  // Scroll to section on link click
  state.navBarListElement.addEventListener('click', (event) => {
    if (event.target.nodeName === 'A') {
      const { sectionId } = event.target.dataset;
      const scrolledToSection = scrollToSection(sectionId);
      if (scrolledToSection) {
        event.preventDefault();
      }
    }
  });
});

// Set sections as active
window.addEventListener(
  SCROLL_END,
  () => {
    setActiveElements();
    showPageHeader();
  },
  false
);
