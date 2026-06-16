const group = document.getElementById('capillaryGroup');
const total = 40;
const capillaries = [];
const audio = document.getElementById('bg-audio');

for (let i = 0; i < total; i++) {
  const cap = document.createElement('div');
  cap.className = 'gold-capillary';
  const angle = Math.random() * 360;
  const radius = Math.random() * 40 + 20;
  const x = 50 + radius * Math.cos(angle * Math.PI / 180);
  const y = 50 + radius * Math.sin(angle * Math.PI / 180);
  cap.style.left = `${x}%`;
  cap.style.top = `${y}%`;
  cap.style.transform = `rotate(${angle}deg)`;
  cap.style.height = `${50 + Math.random() * 100}px`;
  cap.style.pointerEvents = 'auto';
  group.appendChild(cap);
  capillaries.push({ x, y });

  cap.addEventListener('mouseenter', () => {
    cap.style.transform += ' scaleY(1.7)';
    audio.volume = 1;
    if (audio.paused) audio.play();
  });

  cap.addEventListener('mouseleave', () => {
    audio.volume = 0.3;
  });
}

for (let i = 0; i < capillaries.length; i += 2) {
  if (capillaries[i + 1]) {
    const x1 = capillaries[i].x;
    const y1 = capillaries[i].y;
    const x2 = capillaries[i + 1].x;
    const y2 = capillaries[i + 1].y;

    const dx = x2 - x1;
    const dy = y2 - y1;

    const svgNS = "http://www.w3.org/2000/svg";
    const tetrapod = document.createElementNS(svgNS, "svg");
    tetrapod.setAttribute("class", "tetrapod flying");
    tetrapod.setAttribute("viewBox", "0 0 100 100");
    tetrapod.style.left = `${Math.random() * 100}%`;
    tetrapod.style.top = `${Math.random() * 100}%`;
    tetrapod.innerHTML = `
      <defs>
        <radialGradient id="gold-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffd700" />
          <stop offset="100%" stop-color="#b8860b" />
        </radialGradient>
      </defs>
      <path d="M50 5 L60 40 L95 50 L60 60 L50 95 L40 60 L5 50 L40 40 Z" fill="url(#gold-gradient)" />
    `;
    group.appendChild(tetrapod);

    tetrapod.addEventListener("click", () => {
      tetrapod.classList.toggle("sphere");
    });

    animateFlyingTetra(tetrapod);

    const fluid = document.createElement('div');
    fluid.className = 'fluid';
    fluid.style.left = `${x1}%`;
    fluid.style.top = `${y1}%`;
    fluid.style.setProperty('--dx', `${(dx * window.innerWidth) / 100}px`);
    fluid.style.setProperty('--dy', `${(dy * window.innerHeight) / 100}px`);
    fluid.style.animationDelay = `${Math.random() * 5}s`;
    group.appendChild(fluid);
  }
}

function animateFlyingTetra(tetra) {
  let x = parseFloat(tetra.style.left);
  let y = parseFloat(tetra.style.top);
  let vx = (Math.random() - 0.5) * 0.2;
  let vy = (Math.random() - 0.5) * 0.2;

  function move() {
    x += vx;
    y += vy;

    if (x < 0 || x > 100) vx *= -1;
    if (y < 0 || y > 100) vy *= -1;

    tetra.style.left = `${x}%`;
    tetra.style.top = `${y}%`;

    vx += (Math.random() - 0.5) * 0.01;
    vy += (Math.random() - 0.5) * 0.01;

    requestAnimationFrame(move);
  }

  move();
}
