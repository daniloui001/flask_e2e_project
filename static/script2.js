function navigateToNewGame() {
    window.location.href = '/newgame';
}

function createStars() {
    const colors = {
        'neon-blue': ['#0033ff', '#00ccff'],       // Blue gradient
        'neon-green': ['#00ff00', '#33ff33'],      // Green gradient
        'neon-purple': ['#800080', '#cc00cc'],     // Purple gradient
        'red': ['#ff0000', '#ff6600'],              // Red gradient
        'amber': [ '#FF5733' , '#FFC300']
    };

    const starsContainer = document.getElementById('stars');

    for (const color in colors) {
        const gradient = colors[color];
        const numStars = 50; // Adjust the number of stars in each color group as needed

        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('div');
            star.classList.add('star', color);

            // Calculate position based on color group
            let top, left;

            switch (color) {
                case 'neon-blue':
                    top = `${Math.random() * 50}%`;
                    left = `${Math.random() * 40}%`;
                    break;
                case 'neon-green':
                    top = `${Math.random() * 65}%`;
                    left = `${Math.random() * 65}%`;
                    break;
                case 'neon-purple':
                    top = `${85 + Math.random() * 75}%`;
                    left = `${Math.random() * 75}%`;
                    break;
                case 'red':
                    top = `${Math.random() * 80}%`;
                    left = `${70 + Math.random() * 80}%`;
                    break;
                case 'amber':
                    top = `${Math.random() * 90}%`;
                    left = `${Math.random() * 90}%`;
                    break;
                default:
                    break;
            }

            star.style.top = top;
            star.style.left = left;

            // Apply gradient
            star.style.background = `radial-gradient(circle, ${gradient[0]}, ${gradient[1]})`;

            starsContainer.appendChild(star);
        }
    }

    // Animate the stars
    gsap.to('.star', {
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        opacity: 0.5,
        scale: 1.2,
        stagger: 0.01,
        ease: 'power1.inOut',
    });
}

createStars();

const lines = document.querySelectorAll('.line');
gsap.set(lines, { opacity: 0, y: 3 });

const timeline = gsap.timeline({ defaults: { duration: 1.5 } });

lines.forEach((line, index) => {
    const easing = index % 2 === 0 ? 'bounceOut' : 'elasticOut';

    timeline.fromTo(line, { opacity: 0, y: 3 }, { opacity: 1, y: 0, ease: easing }, `<${index * 0.2}`);
});

function checkVisibility() {
    timeline.progress(window.scrollY / (document.body.scrollHeight - window.innerHeight));
}
checkVisibility();