let map;

function initializeMap() {
    const initialCoordinates = { lat: YOUR_INITIAL_LATITUDE, lng: YOUR_INITIAL_LONGITUDE };
    
    map = new google.maps.Map(document.getElementById('map'), {
        center: initialCoordinates,
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

    window.onload = startNextSequence;
}

function getNearbyLocations(category, latitude, longitude) {
    fetch(`/api/nearby-locations?category=${category}&lat=${latitude}&lng=${longitude}`)
        .then(response => response.json())
        .then(data => {
            const resultDiv = document.getElementById('result');
            resultDiv.innerHTML = JSON.stringify(data, null, 2);

            // Clear existing markers on the map
            map && map.setZoom(12);
            map && map.setCenter({ lat: parseFloat(latitude), lng: parseFloat(longitude) });

            // Add markers for nearby locations
            data.forEach(location => addMarker(location));
        })
        .catch(error => {
            console.error('Error fetching nearby locations:', error);
        });
}

window.onload = function () {
    initializeMap();
    startTypingEffect();
};
