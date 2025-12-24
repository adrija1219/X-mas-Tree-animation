const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particleCount = 400;
const treeHeight = 350;
const treeWidth = 200;
const rotationSpeed = 0.02;
const colors = ['#FF0000', '#00FF00', '#00BFFF', '#FFD700', '#FFFFFF'];

let angleOffset = 0;
let textPulse = 0; // For text animation

const particles = [];
for (let i = 0; i < particleCount; i++) {
  const p = i / particleCount;
  const y = -treeHeight / 2 + p * treeHeight;
  const radius = (p) * treeWidth;
  const angle = i * 0.5;

  particles.push({
    y: y,
    originalX: Math.cos(angle) * radius,
    originalZ: Math.sin(angle) * radius,
    color: colors[Math.floor(Math.random() * colors.length)],
    radius: Math.random() * 2 + 1.5
  });
}
function drawSnow() {
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.shadowBlur = 5;
    ctx.shadowColor = "#FFFFFF";

    snowflakes.forEach(s => {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();

        // movement
        s.y += s.speed;
        s.x += s.drift;

        // reset when snow goes out
        if (s.y > canvas.height) {
            s.y = -5;
            s.x = Math.random() * canvas.width;
        }
        if (s.x > canvas.width || s.x < 0) {
            s.x = Math.random() * canvas.width;
        }
    });

    ctx.restore();
}


function drawStar(ctx, x, y, r, p, m) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.fillStyle = "#FFD700";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#FFD700";
  ctx.moveTo(0, 0 - r);
  for (let i = 0; i < p; i++) {
    ctx.rotate(Math.PI / p);
    ctx.lineTo(0, 0 - (r * m));
    ctx.rotate(Math.PI / p);
    ctx.lineTo(0, 0 - r);
  }
  ctx.fill();
  ctx.restore();
}

// --- NEW TEXT FUNCTION ---
function drawMerryChristmas(centerX, centerY) {
  textPulse += 0.05; // Speed of the pulsing glow
  const glow = Math.sin(textPulse) * 10 + 15; // Oscillation for shadowBlur

  ctx.save();
  ctx.font = "bold 50px 'Brush Script MT', cursive"; // Fancy holiday font
  ctx.textAlign = "center";

  // Create a gradient for the text
  const gradient = ctx.createLinearGradient(centerX - 100, 0, centerX + 100, 0);
  gradient.addColorStop(0, "#FFD700"); // Gold
  gradient.addColorStop(0.5, "#FFF");    // White shimmer
  gradient.addColorStop(1, "#FFD700"); // Gold

  // Apply Glow effect
  ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
  ctx.shadowBlur = glow;

  ctx.fillStyle = gradient;
  // Positioned 100px below the tree's center anchor
  ctx.fillText("Merry Christmas", centerX, centerY + treeHeight / 2 + 100);
  ctx.restore();
}

function animate() {
  
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawSnow();
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2 - 80; // Tree is shifted UP
  
  // 1. Draw Star
  drawStar(ctx, centerX, (centerY - treeHeight / 2) + 90, 15, 5, 0.5);

  angleOffset += rotationSpeed;

  // 2. Project and Draw Particles
  const projected = particles.map(p => {
    const rotX = p.originalX * Math.cos(angleOffset) - p.originalZ * Math.sin(angleOffset);
    const rotZ = p.originalX * Math.sin(angleOffset) + p.originalZ * Math.cos(angleOffset);
    const scale = 300 / (300 + rotZ + 400);
    return {
      x: rotX * scale + centerX,
      y: p.y * scale + centerY,
      scale, z: rotZ, color: p.color, size: p.radius
    };
  });

  projected.sort((a, b) => b.z - a.z);

  projected.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * p.scale, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = p.color;
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // 3. Draw the animated Text
  drawMerryChristmas(centerX, centerY);

  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

animate();