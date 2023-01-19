const canvas = document.querySelector('canvas')

const ctx = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

//<----BackGround Road Image
const roadImg = '../images/road.png';
const bgImgRoad = new Image();
bgImgRoad.src = roadImg;
const bgImgRoad2 = new Image();
bgImgRoad2.src = roadImg;

let bgRoadX1 = 0;

//------->

//<----- Car Image
const car = new Image();
car.src = '../images/car.png';

let carY = canvasHeight - 120;
let carX = canvasWidth / 2 - 50;
let carSpeed = 6;

//------->

//<----- Obstacles Images
const rock1 = new Image();
rock1.src = '../images/rock.png';
let newRock;
const rocks = [];

const minX = 65;
const maxX = 240;
const maxWidth = 180;
const rockHeight = 56;
const rockGap = 400;
let rockY = 0;
let positionX = 65;
let rockWidth = 100;

//------->

//<----- Game Variables to reset at the end
let gameOver = false;
let isMovingLeft = false;
let isMovingRight = false;
let score = 0;
let count = 0;
let bgRoadY1 = 0;
let bgRoadY2 = -canvasHeight;
let roadSpeed = 1.5;
let rockSpeed = 1.5;
let gap = 3000;

//------->

//Render background
const drawBg = () => {
  ctx.drawImage(bgImgRoad, bgRoadX1, bgRoadY1, canvasWidth, canvasHeight);
  ctx.drawImage(bgImgRoad2, bgRoadX1, bgRoadY2, canvasWidth, canvasHeight);

  bgRoadY1 += roadSpeed;
  bgRoadY2 += roadSpeed;

  if(bgRoadY1 > canvasHeight) {
    bgRoadY1 = -canvasHeight;
    count = 0
  }
  if(bgRoadY2 > canvasHeight) {
    bgRoadY2 = -canvasHeight;
  }
}
//Render Car
const drawCar = () => {
  ctx.drawImage(car, carX, carY, 100, 100);

  if (isMovingLeft &&  carX > 65) {
    carX -= carSpeed
  }
  if (isMovingRight && carX < (canvasWidth - 160)) {
    carX += carSpeed
  }
}

//Creates a new obstacle given a dinamic time interval
const updateRock = () => {
  drawRockId = setInterval(() => {
    drawObstacle();
  }, gap)
}

//Randomize size of the obstacle
const drawObstacle = () => {
  positionX = Math.floor(Math.random() * (maxX - minX + 1) + minX);
  rockWidth = Math.floor(Math.random() * (maxWidth - minX + 1) + minX);
  newRock = new Rock(positionX, rockWidth);
  rocks.push(newRock);
}

//Rock class for each new obstacle
class Rock {
  constructor(positionX, rockWidth) {
    this.positionX = positionX;
    this.rockWidth = rockWidth;
    this.rockY = rockY;
    this.rockHeight = rockHeight;
    this.pattern = ctx.createPattern(rock1, 'repeat');
  }

  createRock = () => {
    ctx.fillStyle = this.pattern;
    ctx.fillRect(this.positionX, this.rockY, this.rockWidth, this.rockHeight, 20);
  }

}
//Eval if car crash / collision with the obstacle
const crash = (rock) => {
  const rockY = rock.rockY;
  const rockX = rock.positionX
  const rockWidth = rock.rockWidth
  if(rockY > carY -55 
    && carX < rockX + rockWidth 
    && carX + 55 > rockX
    ) {
    gameOver = true
  } else gameOver;
}


const animate = () => {
  drawBg();
  drawCar();

  //Display new obstacles in the canvas
  if (rocks[0]) {
    for(let i = 0; i < rocks.length; i++) {
      rocks[i].createRock()
      rocks[i].rockY += rockSpeed;
      crash(rocks[i])
      if (rocks[i].rockY > canvasHeight) {
        score += 1
        count += 1
        rocks.shift();
      }
    }
  }
  
  //INCREASE speed every 3 obstacles passed 
  if (count === 3) {
    rockSpeed += 0.5;
    roadSpeed += 0.5;
    count = 0;
    clearInterval(drawRockId);
    updateRock();
    if (gap > 700) {
      gap = gap - 500;
    }
  }

  if(!gameOver) {
    animateBgId = requestAnimationFrame(animate)
  } else {

    //Clear animation and interval
    cancelAnimationFrame(animateBgId);
    clearInterval(drawRockId);
    // document.getElementById('start-button').addEventListener('click', () => {
    //   startGame();  
    // });

    
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    
    //Changing canvas to display result of game
    
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, "green");
    gradient.addColorStop(0.5, "#76abcb");
    gradient.addColorStop(1, "#06316a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
    ctx.fillStyle = 'black'
    ctx.font = '60px Roboto';
    ctx.fillText(`GAME OVER`, canvasWidth/2 - 180, canvasHeight/2 - 80)
    ctx.fillText(`You Score ${score}`, canvasWidth/2 - 150, canvasHeight/2)
    
    //reset values to start
    gameOver = false;
    isMovingLeft = false;
    isMovingRight = false;
    score = 0;
    count = 0;
    bgRoadY1 = 0;
    bgRoadY2 = -canvasHeight;
    roadSpeed = 1.5;
    rockSpeed = 1.5;
    gap = 3000;
    rocks.splice(0,rocks.length)
  }
}


window.onload = () => {
 
  document.getElementById('start-button').addEventListener('click', () => {
    startGame();  
  });
  
  function startGame() {
 
    animate()
    drawObstacle()
    updateRock()

    document.addEventListener('keydown', event => {
    
      if (event.key === "ArrowLeft") {
        // move paddle to the left
        isMovingLeft = true
      }
      if (event.key === "ArrowRight") {
        // move paddle to the right
        isMovingRight = true
      }
    })
    document.addEventListener('keyup', () => {
      // Stop moving the paddle
      isMovingLeft = false
      isMovingRight = false
    })
    window.scrollBy(0, window.innerHeight);
    document.getElementById('start-button').removeEventListener('click')
  }

};
