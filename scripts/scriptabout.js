

document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.querySelector('.hamburger-menu');
    const menuNav = document.querySelector('.menu-nav');
    let lastScrollTop = 0;

    hamburger.addEventListener('click', () => {
        menuNav.classList.toggle('active');
    });
    
    window.addEventListener('scroll', () => {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop) {
            menuNav.classList.remove('active');
        } 
        lastScrollTop = scrollTop;
    });
});