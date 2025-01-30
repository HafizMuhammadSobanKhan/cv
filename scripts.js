<!DOCTYPE
html >
  <html>
<head>
<title>Three.js Particles</title>
<style>
body { margin: 0; overflow: hidden; }
canvas { display: block; }
</style>
</head>
<body>
<div id="background"></div>
<nav>
  <a href="#section1">Section 1</a>
  <a href="#section2">Section 2</a>
</nav>
<section id="section1">
  <h1>Section 1</h1>
  <p>Some content for section 1.</p>
</section>
<section id="section2">
  <h1>Section 2</h1>
  <p>Some content for section 2.</p>
</section>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.5/ScrollTrigger.min.js"></script>
<script>
document.addEventListener('DOMContentLoaded', () => {
    // Set up the scene
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

    // Animation
    //const animate = () => {
    //    requestAnimationFrame(animate);
    //    particlesMesh.rotation.x += 0.0005;
    //    particlesMesh.rotation.y += 0.0005;
    //    renderer.render(scene, camera);
    //};

    //animate();

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

    // Add hover effect to particles
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Update particles
        particlesMesh.rotation.y = -0.1 * elapsedTime;
        if (mouseX > 0) {
            particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008);
            particlesMesh.rotation.y = -mouseX * (elapsedTime * 0.00008);
        }

        // Render
        renderer.render(scene, camera);

        // Call tick again on the next frame
        window.requestAnimationFrame(tick);
    };

    tick();

    // Add animations to sections
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('section').forEach((section, i) => {
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
});
</script>
</body>
</html>
