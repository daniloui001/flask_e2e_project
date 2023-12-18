document.getElementById('newGameBtn').addEventListener('click', navigateToRegister);
document.getElementById('continueGameBtn').addEventListener('click', navigateToLogin);
function navigateToRegister() {
    window.location.href = '/register';
}
function navigateToLogin() {
    window.location.href = '/login';
}
function getNearbyLocations() {
    const category = document.getElementById('category').value;

    // Check if Geolocation is supported
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                fetch(`/api/nearby-locations?category=${category}&lat=${latitude}&lng=${longitude}`)
                    .then(response => response.json())
                    .then(data => {
                        const resultDiv = document.getElementById('result');
                        resultDiv.innerHTML = JSON.stringify(data, null, 2);
                    })
                    .catch(error => {
                        console.error('Error fetching nearby locations:', error);
                    });
            },
            error => {
                console.error('Error getting location:', error);
            }
        );
    } else {
        console.error('Geolocation is not supported by your browser.');
    }
}


document.addEventListener('DOMContentLoaded', function () {
    // Create custom easing functions
    gsap.config({
        customEase: {
            'bounceOut': function (p) {
                if (p < 6 / 11) {
                    return (121 * p * p) / 16;
                } else if (p < 8 / 11) {
                    return (363 / 40 * p * p) - (99 / 10 * p) + 17 / 5;
                } else if (p < 9 / 10) {
                    return (4356 / 361 * p * p) - (35442 / 1805 * p) + 16061 / 1805;
                } else {
                    return (54 / 5 * p * p) - (513 / 25 * p) + 268 / 25;
                }
            },
            'elasticOut': function (p) {
                return Math.pow(2, -10 * p) * Math.sin((p - 0.075) * (2 * Math.PI) / 0.3) + 1;
            }
        }
    });

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

    window.addEventListener('scroll', checkVisibility);
    checkVisibility();

    const plusSign = document.createElement('div');
    plusSign.classList.add('plus-sign');
    document.body.appendChild(plusSign);

    const trail = document.createElement('div');
    trail.classList.add('trail');
    plusSign.appendChild(trail);

    function animatePlusSign() {
        gsap.fromTo(plusSign, { y: window.innerHeight + 20, opacity: 0.5 }, { y: -20, opacity: 0.5, duration: 10, ease: 'linear', repeat: -1 });

        const wiggle = gsap.timeline({ repeat: -1 });
        wiggle.to(trail, { x: 10, duration: 0.2 });
        wiggle.to(trail, { x: -10, duration: 0.2 });
        wiggle.to(trail, { x: 0, duration: 0.2 });
    }

    animatePlusSign();
});