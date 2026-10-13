const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const menuToggle = document.querySelector(".menu-toggle");
const navList = document.querySelector(".nav-links");
const revealItems = document.querySelectorAll(".reveal");
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (menuToggle && navList) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
    threshold: 0
  }
);

sections.forEach((section) => sectionObserver.observe(section));

// Scroll progress bar and back-to-top button
const progressBar = document.querySelector(".scroll-progress");
const toTop = document.querySelector(".to-top");

const updateScrollState = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  if (progressBar) progressBar.style.setProperty("--progress", ratio.toFixed(4));
  if (toTop) toTop.classList.toggle("show", window.scrollY > 600);
};

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("resize", updateScrollState);
updateScrollState();

// Typed role line in the hero: types each phrase, then deletes it
const typedEl = document.querySelector("[data-typed]");
const typedPhrases = [
  "Post-quantum cryptography research",
  "AI-driven vulnerability detection",
  "Embedded and smart-grid security"
];

if (typedEl && !reduceMotion) {
  let phraseIndex = 0;
  let charIndex = typedPhrases[0].length;
  let deleting = true;

  const typeStep = () => {
    const phrase = typedPhrases[phraseIndex];
    charIndex += deleting ? -1 : 1;
    typedEl.textContent = phrase.slice(0, charIndex);

    let delay = deleting ? 35 : 70;
    if (!deleting && charIndex === phrase.length) {
      delay = 2200;
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % typedPhrases.length;
      delay = 400;
    }
    setTimeout(typeStep, delay);
  };

  setTimeout(typeStep, 2200);
}

// Cursor-following glow (fine pointers only)
const cursorGlow = document.querySelector(".cursor-glow");

if (cursorGlow && finePointer && !reduceMotion) {
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  window.addEventListener(
    "pointermove",
    (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursorGlow.classList.add("active");
    },
    { passive: true }
  );

  document.addEventListener("mouseleave", () => cursorGlow.classList.remove("active"));

  const followCursor = () => {
    currentX += (targetX - currentX) * 0.15;
    currentY += (targetY - currentY) * 0.15;
    cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(followCursor);
  };

  followCursor();
}

// Tilt and spotlight for interactive cards
document.querySelectorAll(".interactive").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);

    if (finePointer && !reduceMotion) {
      card.style.setProperty("--rx", `${(y / rect.height - 0.5) * -6}deg`);
      card.style.setProperty("--ry", `${(x / rect.width - 0.5) * 6}deg`);
    }
  });

  card.addEventListener("pointerleave", () => {
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  });
});

// Animated neural-network background: drifting nodes, linked when close,
// gently pushed away from the pointer
const canvas = document.getElementById("fx-canvas");

if (canvas && !reduceMotion) {
  const ctx = canvas.getContext("2d");
  const pointer = { x: -9999, y: -9999 };
  const linkDistance = 150;
  const pointerDistance = 140;
  let width = 0;
  let height = 0;
  let nodes = [];

  const createNodes = () => {
    const count = Math.min(90, Math.floor((width * height) / 16000));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3
    }));
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createNodes();
  };

  const drawFrame = () => {
    ctx.clearRect(0, 0, width, height);

    for (const node of nodes) {
      node.x += node.vx;
      node.y += node.vy;
      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      const dx = node.x - pointer.x;
      const dy = node.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance > 0 && distance < pointerDistance) {
        node.x += (dx / distance) * 1.2;
        node.y += (dy / distance) * 1.2;
      }
    }

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i];
        const b = nodes[j];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        if (distance < linkDistance) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${(1 - distance / linkDistance) * 0.55})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const node of nodes) {
      const distance = Math.hypot(node.x - pointer.x, node.y - pointer.y);
      if (distance < linkDistance * 1.3) {
        ctx.strokeStyle = `rgba(167, 139, 250, ${(1 - distance / (linkDistance * 1.3)) * 0.7})`;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(pointer.x, pointer.y);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(125, 211, 252, 0.95)";
      ctx.beginPath();
      ctx.arc(node.x, node.y, 2.4, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(drawFrame);
  };

  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }, { passive: true });

  window.addEventListener("pointerout", (event) => {
    if (!event.relatedTarget) {
      pointer.x = -9999;
      pointer.y = -9999;
    }
  });

  window.addEventListener("resize", resize);
  resize();
  drawFrame();
}
