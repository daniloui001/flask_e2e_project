function startTypingEffect() {
    const yourElement = document.getElementById("typing-text");

    gsap.to(yourElement, {
        duration: 1,
        text: {
            value: "Find Your Third Place",
            newClass: "class2",
            delimiter: " ",
        },
    });
}

window.onload = startTypingEffect;
