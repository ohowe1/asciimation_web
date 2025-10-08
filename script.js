const SPRITES_CONFIG = [
  {
    url: "spriteImages/stars.tsprite",
    x: 0,
    y: 0,
    velX: 2,
    velY: 0,
  },
  {
    url: "spriteImages/stars.tsprite",
    x: 84,
    y: 0,
    velX: 2,
    velY: 0,
  },
  {
    url: "spriteImages/stars.tsprite",
    x: 42,
    y: 11,
    velX: 2,
    velY: 0,
  },
  {
    url: "spriteImages/stars.tsprite",
    x: -42,
    y: 11,
    velX: 2,
    velY: 0,
  },
  {
    url: "spriteImages/saturn.tsprite",
    x: 0,
    y: 0,
    velX: 3,
    velY: 1,
  },
  {
    url: "spriteImages/surface.tsprite",
    x: 0,
    y: 19,
    velX: 0,
    velY: 0,
  },
];

const WIDTH = 84;
const HEIGHT = 26;

const TRANSPARENT_CHAR = "@";

let animationP = document.getElementById("animation");

const sprites = [];

async function loadSprite(spriteConfig) {
  const content = await fetch(spriteConfig.url).then((res) => res.text());
  const lines = content.split('\n');
  const width = parseInt(lines[0]);
  const height = parseInt(lines[1]);
  const spriteContent = lines[2];

  let asArray = [];
  for (let i = 0; i < height; i++) {
    asArray.push(spriteContent.slice(i * width, (i + 1) * width).split(""));
  }

  const sprite = {
    x: spriteConfig.x,
    y: spriteConfig.y,
    velX: spriteConfig.velX,
    velY: spriteConfig.velY,
    width: width,
    height: height,
    content: asArray,
  };

  return sprite;
}

function drawSprite(sprite, textBuffer) {
  for (let i = 0; i < sprite.height; i++) {
    for (let j = 0; j < sprite.width; j++) {
      const char = sprite.content[i][j];
      console.log(char, TRANSPARENT_CHAR, char !== TRANSPARENT_CHAR);
      if (char !== TRANSPARENT_CHAR) {
        const x = sprite.x + j;
        const y = sprite.y + i;
        if (x >= 0 && x < WIDTH && y >= 0 && y < HEIGHT) {
          textBuffer[y][x] = char;
        }
      }
    }
  }
}

function updateSpritePosition(sprite) {
  sprite.x += sprite.velX;
  sprite.y += sprite.velY;

  // Wrap around logic for x-axis
  if (sprite.x >= WIDTH) {
    sprite.x = -sprite.width;
  } else if (sprite.x < -sprite.width) {
    sprite.x = WIDTH;
  }

  // Wrap around logic for y-axis
  if (sprite.y >= HEIGHT) {
    sprite.y = -sprite.height;
  } else if (sprite.y < -sprite.height) {
    sprite.y = HEIGHT;
  }
}

function render() {
  let textBuffer = [];
  for (let i = 0; i < HEIGHT; i++) {
    textBuffer.push(new Array(WIDTH).fill(" "));
  }

  for (let sprite of sprites) {
    drawSprite(sprite, textBuffer);
    updateSpritePosition(sprite);
  }

  let finalText = textBuffer.map((line) => line.join("")).join("\n");
  animationP.textContent = finalText;
}

let lastTick = 0;
const intervalMs = 150;

function loop(ts) {
  if (ts - lastTick >= intervalMs) {
    render(); // synchronous
    lastTick = ts;
  }
  requestAnimationFrame(loop);
}

async function init() {
  for (let spriteConfig of SPRITES_CONFIG) {
    const sprite = await loadSprite(spriteConfig);
    sprites.push(sprite);
  }
  
  // request initial frame
  requestAnimationFrame(loop);
}

init();
