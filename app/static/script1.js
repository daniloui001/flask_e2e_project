let map;

function initializeMapWithLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                initializeMap(latitude, longitude);
            },
            (error) => {
                console.error('Error getting user location:', error);
                initializeMap(0, 0);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
        initializeMap(0,0);
    }
}

function initializeMap(latitude, longitude) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: latitude, lng: longitude },
        zoom: 12,
    });
}

function startTypingEffect() {
    const yourElement = document.getElementById("typing-text");

    const sequences = ["First Place? ", "Second Place? ", "Find Your Third Place!"];
    let sequenceIndex = 0;

    function typeText(element, text, speed = 100) {
        let index = 0;

        const interval = setInterval(() => {
            element.textContent += text[index];
            index++;

            if (index === text.length) {
                clearInterval(interval);

                if (sequenceIndex < sequences.length) {
                    setTimeout(() => {
                        startNextSequence();
                    }, 500);
                }
            }
        }, speed);
    }

    function startNextSequence() {
        const text = sequences[sequenceIndex];
        typeText(yourElement, text, 100);
        sequenceIndex++;
    }

    startNextSequence();
}

function getNearbyLocations() {
    const category = document.getElementById('category').value;

    function addMarker(map, location) {
        new google.maps.Marker({
            position: { lat: location.latitude, lng: location.longitude },
            map: map,
            title: location.name,
        });
    }

    // Check if the Geolocation API is supported by the browser
    if (navigator.geolocation) {
        // Get the user's current location
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                // Call the API with the retrieved location
                fetch(`/api/nearby-locations?category=${category}&lat=${latitude}&lng=${longitude}`)
                    .then(response => response.json())
                    .then(data => {
                        const resultDiv = document.getElementById('result');
                        resultDiv.innerHTML = JSON.stringify(data, null, 2);

                        // Add markers for each location on the map
                        data.locations.forEach(location => {
                            addMarker(map, location);
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching nearby locations:', error);
                    });
            },
            (error) => {
                console.error('Error getting user location:', error);
            }
        );
    } else {
        console.error('Geolocation is not supported by this browser.');
    }
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

window.onload = function () {
    startTypingEffect();
};
