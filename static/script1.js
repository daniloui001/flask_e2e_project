let map;

function initializeMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: YOUR_INITIAL_LATITUDE, lng: YOUR_INITIAL_LONGITUDE },
        zoom: 12,
    });
}

function addMarker(location) {
    new google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: map,
        title: location.name,
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

    document.addEventListener("DOMContentLoaded", () => {
        
        initializeMap();
    });
}

function getNearbyLocations() {
    const category = document.getElementById('category').value;

    fetch(`/api/nearby-locations?category=${category}&lat=${latitude}&lng=${longitude}`)
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = JSON.stringify(data, null, 2);
        })
        .catch(error => {
            console.error('Error fetching nearby locations:', error);
        });
}

window.onload = function () {
    startTypingEffect();
};
