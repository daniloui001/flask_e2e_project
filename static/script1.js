function typeTextWithBackspace(element, text, speed = 100, backspaceSpeed = 50) {
    let index = 0;
    const interval = setInterval(() => {
        element.textContent += text[index];
        index++;

        if (index === text.length) {
            clearInterval(interval);

            setTimeout(() => {
                backspace(element, backspaceSpeed);
            }, 1000);
        }
    }, speed);
}

function backspace(element, speed) {
    const interval = setInterval(() => {
        const currentText = element.textContent;

        if (currentText.length > 0) {
            element.textContent = currentText.slice(0, -1);
        } else {
            clearInterval(interval);

            if (sequenceIndex < sequences.length) {
                setTimeout(() => {
                    startNextSequence();
                }, 500);
            }
        }
    }, speed);
}

let sequences = ["first?","second?", "third place!"];
let sequenceIndex = 0;

function startNextSequence() {
    const yourElement = document.getElementById("typing-text");

    if (sequenceIndex < sequences.length) {
        typeTextWithBackspace(yourElement, `Find your ${sequences[sequenceIndex]}`, 100, 50);
        sequenceIndex++;
    }
}

function startTypingEffect() {
    startNextSequence();
}

window.onload = startTypingEffect;

function startTypingEffect() {
    const yourElement = document.getElementById("typing-text");

    gsap.to(yourElement, {
        duration: 2,
        text: {
            value: "Find Your First Second Third Place",
            newClass: "class2",
            delimiter: " ",
        },
        onComplete: startNextSequence,
    });
}

function startNextSequence() {

    console.log("Typing completed. Starting next sequence...");
}

window.onload = startTypingEffect;
