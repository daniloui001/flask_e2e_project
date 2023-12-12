document.addEventListener('DOMContentLoaded', function() {
    const lines = document.querySelectorAll('.line');

    gsap.set(lines, { opacity: 0, y: 20 });

    function checkVisibility() {
        lines.forEach((line, index) => {
            const rect = line.getBoundingClientRect();
            const isVisible = rect.top <= window.innerHeight / 1.5;

            if (isVisible) {
                gsap.to(line, { opacity: 1, y: 0, duration: 1, ease: 'power4.out' });
            }
        });
    }

    window.addEventListener('scroll', checkVisibility);
    checkVisibility(); // Check visibility on page load
});
