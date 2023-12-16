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

startTypingEffect();
