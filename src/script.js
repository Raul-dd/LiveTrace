// ------------------ EFECTO RIPPLE ------------------
const btn = document.querySelector('.btn');
btn.addEventListener('click', function (e) {
  const rect = this.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  this.appendChild(ripple);
  setTimeout(() => ripple.remove(), 800);
});

// ------------------ EFECTO FOCUS EN INPUTS ------------------
const inputs = document.querySelectorAll('.form-control');
inputs.forEach(input => {
  input.addEventListener('focus', () => input.parentNode.classList.add('focused'));
  input.addEventListener('blur', () => {
    if (!input.value) input.parentNode.classList.remove('focused');
  });
});

// ------------------ SVG DEL TENIS ------------------
const sneakerElement = document.getElementById('sneaker');
sneakerElement.innerHTML = `
  <div class="sneaker-image-wrapper">
    <img src="images/tenis.png" alt="Tenis deportivo" class="sneaker-image" />
    <div class="sneaker-glow"></div>
  </div>
`;







// ------------------ EFECTO PARALAJE ------------------
const parallaxWrapper = document.getElementById('parallax-wrapper');
const sneaker = document.getElementById('sneaker');

document.addEventListener('mousemove', (e) => {
  if (window.innerWidth <= 768) return;

  const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
  const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

  sneaker.style.transform = `translateX(${xAxis}px) translateY(${yAxis}px) rotate(${xAxis / 2}deg)`;
});

// ------------------ ANIMACIÓN DE FLOTACIÓN ------------------
const sneakerKeyframes = [
  { transform: 'translateY(0) rotate(0.5deg)' },
  { transform: 'translateY(-5px) rotate(-0.5deg)' },
  { transform: 'translateY(0) rotate(0.5deg)' }
];
const sneakerTiming = {
  duration: 3000,
  iterations: Infinity,
  easing: 'ease-in-out'
};

sneaker.animate(sneakerKeyframes, sneakerTiming);
