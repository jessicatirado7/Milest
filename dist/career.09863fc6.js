/*!
* Start Bootstrap - Creative v7.0.5 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/ //
// Scripts
window.addEventListener("DOMContentLoaded", (event)=>{
    // Navbar shrink function
    var navbarShrink = function() {
        const navbarCollapsible = document.body.querySelector("#mainNav");
        if (!navbarCollapsible) return;
        if (window.scrollY === 0) navbarCollapsible.classList.remove("navbar-shrink");
        else navbarCollapsible.classList.add("navbar-shrink");
    };
    // Shrink the navbar 
    navbarShrink();
    // Shrink the navbar when page is scrolled
    document.addEventListener("scroll", navbarShrink);
    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector("#mainNav");
    if (mainNav) new bootstrap.ScrollSpy(document.body, {
        target: "#mainNav",
        offset: 74
    });
    $(".navbar-collapse a:not(.dropdown-toggle)").click(function() {
        $(".navbar-collapse").collapse("hide");
    });
    //AOS
    AOS.init();
});

//# sourceMappingURL=career.09863fc6.js.map
