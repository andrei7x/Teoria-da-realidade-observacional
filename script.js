const canvas = document.querySelector("#cosmos");
const context = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let width = 0;
let height = 0;
let particles = [];
let animationFrame = null;

// Sistema de partículas leve para criar profundidade sem bibliotecas externas.
function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * pixelRatio);
  canvas.height = Math.floor(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  createParticles();
}

function createParticles() {
  const density = width < 700 ? 34 : 72;
  particles = Array.from({ length: density }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.32,
    vy: (Math.random() - 0.5) * 0.32,
    radius: Math.random() * 1.7 + 0.6,
    hue: Math.random() > 0.72 ? "255, 209, 102" : "111, 255, 228",
  }));
}

function drawCosmos() {
  context.clearRect(0, 0, width, height);

  for (const particle of particles) {
    if (!reduceMotion.matches) {
      particle.x += particle.vx;
      particle.y += particle.vy;
    }

    if (particle.x < 0 || particle.x > width) particle.vx *= -1;
    if (particle.y < 0 || particle.y > height) particle.vy *= -1;

    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fillStyle = `rgba(${particle.hue}, 0.72)`;
    context.fill();
  }

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const first = particles[i];
      const second = particles[j];
      const distance = Math.hypot(first.x - second.x, first.y - second.y);

      if (distance < 132) {
        const opacity = (1 - distance / 132) * 0.22;
        context.beginPath();
        context.moveTo(first.x, first.y);
        context.lineTo(second.x, second.y);
        context.strokeStyle = `rgba(111, 255, 228, ${opacity})`;
        context.lineWidth = 1;
        context.stroke();
      }
    }
  }

  if (!reduceMotion.matches) {
    animationFrame = window.requestAnimationFrame(drawCosmos);
  }
}

function startCosmos() {
  window.cancelAnimationFrame(animationFrame);
  resizeCanvas();
  drawCosmos();
}

const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];

// Menu responsivo: abre no mobile e fecha após escolher uma seção.
navToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");
  });
});

// Revela os blocos conforme entram no campo de visão.
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

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

// Mantém o link ativo do menu sincronizado com a seção atual.
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
    rootMargin: "-35% 0px -52% 0px",
    threshold: 0,
  }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

const focusTitle = document.querySelector("#focus-title");
const focusText = document.querySelector("#focus-text");
const timelineCards = [...document.querySelectorAll(".timeline-card")];

// Cartões da linha do tempo atualizam o painel de leitura ativa.
timelineCards.forEach((card) => {
  card.addEventListener("click", () => {
    timelineCards.forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    focusTitle.textContent = card.dataset.title;
    focusText.textContent = card.dataset.text;
  });
});

let resizeTimer = null;
window.addEventListener("resize", () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(resizeCanvas, 160);
});

if (typeof reduceMotion.addEventListener === "function") {
  reduceMotion.addEventListener("change", startCosmos);
} else {
  reduceMotion.addListener(startCosmos);
}
startCosmos();
