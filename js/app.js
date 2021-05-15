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

/**
 * Define Global Variables
 *
 */
const navBarListElement = document.getElementById('navbar__list');

/**
 * End Global Variables
 * Start Helper Functions
 *
 */
const createNavMenuItem = (params) => {
  const navMenuItem = document.createElement('li');
  navMenuItem.innerHTML = `<a class ="menu__link" data-section-id="${params.sectionId}">${params.navLabel}</a>`;
  return navMenuItem;
};

/**
 * End Helper Functions
 * Begin Main Functions
 *
 */

// build the nav
const buildNavMenu = () => {
  const sectionList = Array.from(document.querySelectorAll('section'));

  const navMenuFragment = sectionList.reduce((fragment, section) => {
    const sectionId = section.id;
    const navLabel = section.dataset.nav;
    const navMenuItem = createNavMenuItem({ navLabel, sectionId });
    fragment.append(navMenuItem);
    return fragment;
  }, new DocumentFragment());

  navBarListElement.appendChild(navMenuFragment);
};

// Add class 'active' to section when near top of viewport

// Scroll to anchor ID using scrollTO event

/**
 * End Main Functions
 * Begin Events
 *
 */

// Build menu
buildNavMenu();

// Scroll to section on link click

// Set sections as active
