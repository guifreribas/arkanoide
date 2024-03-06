const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const $sprite = document.querySelector("#sprite");

canvas.width = 500;
canvas.height = 600;

//ball variables
const ballRadius = 3;
//ball position
let x = canvas.width / 2;
let y = canvas.height - 30;
//ball movement
let dx = 4;
let dy = -4;

//paddle variables
const paddleHeight = 12;
const paddleWidth = 50;

let paddleX = (canvas.width - paddleWidth) / 2;
let paddleY = canvas.height - paddleHeight - 10;

let rightPressed = false;
let leftPressed = false;

//bricks variables
const brickRowCount = 6;
const brickColumnCount = 10;
const brickWidth = 40;
const brickHeight = 18;
const brickPadding = 1;
const brickOffsetTop = 60;
const brickOffsetLeft = 45;
const bricks = [];

const BRICK_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0,
};

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
    const random = Math.floor(Math.random() * 10);
    bricks[c][r] = {
      x: brickX,
      y: brickY,
      status: BRICK_STATUS.ACTIVE,
      color: random,
    };
  }
}

function drawBall() {
  // ctx.beginPath();
  // ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  // ctx.fillStyle = "#fff";
  // ctx.fill();
  // ctx.closePath();

  ctx.drawImage(
    $sprite,
    806, //clipX: cut the image from the x position
    550, //clipY: cut the image from the y position
    75, //clipWidth: cut the image from the width position
    75, //clipHeight: cut the image from the height position
    x - ballRadius, //x position to draw the image
    y - ballRadius, //y position to draw the image
    ballRadius * 3, //width of the image
    ballRadius * 3 //height of the image
  );
}

function drawPaddle() {
  ctx.drawImage(
    $sprite,
    570, //clipX: cut the image from the x position
    375, //clipY: cut the image from the y position
    220, //clipWidth: cut the image from the width position
    40, //clipHeight: cut the image from the height position
    paddleX, //x position to draw the image
    paddleY, //y position to draw the image
    paddleWidth, //width of the image
    paddleHeight //height of the image
  );
}
function drawBricks() {
  console.log({ bricks });
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      //ctx.fillStyle = "yellow";
      //ctx.rect(currentBrick.x, currentBrick.y, brickWidth, brickHeight);

      const clipY = currentBrick.color === 0 ? 15 : currentBrick.color * 75 + 18; //15
      ctx.drawImage(
        $sprite,
        15, //clipX: cut the image from the x position
        clipY, //clipY: cut the image from the y position
        174, //clipWidth: cut the image from the width position
        52, //clipHeight: cut the image from the height position
        currentBrick.x, //x position to draw the image
        currentBrick.y, //y position to draw the image
        brickWidth, //width of the image
        brickHeight //height of the image
      );

      // ctx.strokeStyle = "black";
      // ctx.stroke();
      ctx.fill();
    }
  }
}

function ballMovement() {
  //detect collision with lateral walls
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  //detect collision with top wall
  if (y + dy < ballRadius) {
    dy = -dy;
  }

  const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth;
  const isBallTouchingPaddle = y + dy > paddleY;

  //detect collision with bottom wall
  if (isBallSameXAsPaddle && isBallTouchingPaddle) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - 5) {
    console.log("game over");
    document.location.reload();
  }

  x += dx;
  y += dy;
}
function paddleMovement() {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 8;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 8;
  }
}
function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = bricks[c][r];
      if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

      const isBallSameXAsBrick = x > currentBrick.x && x < currentBrick.x + brickWidth;
      const isBallSameYAsBrick = y > currentBrick.y && y < currentBrick.y + brickHeight;
      if (isBallSameXAsBrick && isBallSameYAsBrick) {
        dy = -dy;
        currentBrick.status = BRICK_STATUS.DESTROYED;
      }
    }
  }
}
function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
function initEvents() {
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);

  function keyDownHandler(e) {
    const { key } = e;
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = true;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    const { key } = e;
    if (key === "Right" || key === "ArrowRight") {
      rightPressed = false;
    } else if (key === "Left" || key === "ArrowLeft") {
      leftPressed = false;
    }
  }
}

function draw() {
  cleanCanvas();

  //draw elements
  drawBall();
  drawPaddle();
  drawBricks();

  //detect collisions and move elements
  ballMovement();
  paddleMovement();
  collisionDetection();

  window.requestAnimationFrame(draw);
}

draw();
initEvents();
