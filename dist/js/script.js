// btn hamburger
const btnHamburger = document.querySelector('.btn');
const navbar = document.querySelector('.navbar__nav__ul');
// navbar
const nav = document.querySelector('.navbar-wrapper');
const scrollFromTop = document.querySelector('.navbar-wrapper').offsetHeight;

// topFooter
const topFooterDiv = document.querySelectorAll('.top-footer__column');
const topFooterUl = document.querySelectorAll('.top-footer__column__ul');
const topFooterIcon = document.querySelectorAll('.fa-angle-down');

btnHamburger.addEventListener('click', () => {
  btnHamburger.classList.toggle('btn-active');
  btnHamburger.classList.toggle('btn-not-active');
  navbar.classList.toggle('navbar-active');
});

topFooterDiv.forEach((div, i) => {
  div.addEventListener('click', function () {
    topFooterUl[i].classList.toggle('top-footer-active');
    topFooterIcon[i].classList.toggle('top-footer-icon-active');
  });
});

const transparentNavbar = () => {
  if (window.pageYOffset >= scrollFromTop) {
    nav.classList.add('navbar-wrapper-active');
    // nav.classList.add('navbar-wrapper-gradient');
  } else if (window.pageYOffset < scrollFromTop) {
    nav.classList.remove('navbar-wrapper-active');
  }
};

window.addEventListener('scroll', transparentNavbar);