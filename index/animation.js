const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let particles = [];
let hue = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const mouse = { x: canvas.width / 2, y: canvas.height / 2 };
// macami sp
canvas.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 4 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = `hsl(${hue}, 100%, 50%)`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.size *= 0.97; 
  }
  
  draw() {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    context.fill();
  }
}

function handleParticles() {
  particles.push(new Particle(mouse.x, mouse.y));
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
    if (particles[i].size < 0.3) {
      particles.splice(i, 1);
      i--;
    }
  }
}

function drawHeart(t) {
  const point = {
    x: 16 * Math.pow(Math.sin(t), 3),
    y:
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t),
  };
  return {
    x: point.x * 20 + canvas.width / 2,
    y: -point.y * 20 + canvas.height / 2,
  };
}

function drawHeartTrail() {
  for (let angle = 0; angle <= 2 * Math.PI; angle += 0.1) {
    const { x, y } = drawHeart(angle);
    particles.push(new Particle(x, y));
  }
}

function animate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  hue += 2; // macami sp
  handleParticles();
  drawHeartTrail();
  requestAnimationFrame(animate);
}
// macami sp
animate();