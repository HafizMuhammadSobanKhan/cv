document.addEventListener('DOMContentLoaded', () => {
    // Typing Effect for Name
    const text = "Hafiz Muhammad Soban Khan";
    let index = 0;
    function typeWriter() {
        if (index < text.length) {
            document.getElementById("name").innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, 100);
        }
    }
    typeWriter();

    // Set up the scene for particle background
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('background').appendChild(renderer.domElement);

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: 0x3498db
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    camera.position.z = 2;

    // Animation loop for particles
    const clock = new THREE.Clock();
    const animateParticles = () => {
        const elapsedTime = clock.getElapsedTime();
        particlesMesh.rotation.y = -0.1 * elapsedTime;
        renderer.render(scene, camera);
        requestAnimationFrame(animateParticles);
    };
    animateParticles();

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add parallax effect to background
    document.addEventListener("scroll", function () {
        let scrollPos = window.scrollY;
        document.getElementById("background").style.transform = `translateY(${scrollPos * 0.3}px)`;
    });

    // Scroll-triggered animations
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('section').forEach((section) => {
        gsap.from(section, {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Hover effect on particles (Mouse Follow)
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    const tick = () => {
        particlesMesh.rotation.x += mouseY * 0.0001;
        particlesMesh.rotation.y += mouseX * 0.0001;
        renderer.render(scene, camera);
        requestAnimationFrame(tick);
    };

    tick();
});
