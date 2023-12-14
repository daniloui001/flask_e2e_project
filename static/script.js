document.addEventListener('DOMContentLoaded', function() {
    // Create custom bounce.easeOut with increased amplitude
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
            }
        }
    });

    // Create custom elastic.easeOut with increased amplitude
    gsap.config({
        customEase: {
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
});
