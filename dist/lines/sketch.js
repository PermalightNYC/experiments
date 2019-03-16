const fps = 10;
let gridSize;
let colors;
let grid = [];


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  drawGrid();
  redraw();
}

function setup() {
  background(0);
  createCanvas(windowWidth, windowHeight);
  pixelDensity(2);
  frameRate(fps);
  colors = [color('#ffe74c'), color('#ff5964'), color('#6bf178'), color('#35a7ff'), color('#ffffff')];

  drawGrid();
  noLoop();
}

function draw() {
  drawGrid();
}

function mousePressed() {
  redraw();
}

function drawGrid() {
  background(0);
  gridSize = width / random(1, 45);
  for (var x = gridSize; x <= width - gridSize; x += gridSize) {
    for (var y = gridSize; y <= height - gridSize; y += gridSize) {
      noStroke();
      stroke(255, 50);
      line(x, y, random(0, windowWidth), random(0, windowHeight));
    }
  }
}

//*****************************
// helpers
//*****************************

function getRandomColor() {
  return colors[int(random(0, colors.length))];
}