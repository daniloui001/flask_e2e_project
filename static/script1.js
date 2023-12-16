function startTypingEffect() {
    console.log("startTypingEffect called");
    const text = "Find Your Third Place";
    const typingSpeed = 0.1;

    gsap.to("#typing-text", {
        text: { value: text, delimiter: "" },
        duration: text.length * typingSpeed,
        ease: "power1.inOut",
    });
}

// Call the typing effect function when the page loads
window.onload = startTypingEffect;
