var typed = new Typed(".text", {
    strings: ["FullStack Developer", "Python Developer", "AI Enthusiast"],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
});
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('#navbar a'); // Select all nav links

    hamburger.addEventListener('click', function () {
        navbar.classList.toggle('active');
    });

    // Add click event to each nav link to hide the navbar
    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            navbar.classList.remove('active');
        });
    });
});

