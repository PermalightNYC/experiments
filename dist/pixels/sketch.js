const fps = 10;
let gridSize = 150;
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
  pixelDensity(1.5);
  frameRate(fps);
  colors = [color('#ffe74c'), color('#ff5964'), color('#ffffff'), color('#6bf178'), color('#35a7ff')]

  noLoop();
  drawGrid();
}

function draw() {
  background(0);
  for (var b = 0; b < grid.length; b++) {
    grid[b].show();
  }
}

function mousePressed() {
  drawGrid();
  redraw();
}

function drawGrid() {
  background(0);
  for (var a = 0; a < width; a += windowWidth / gridSize) {
    for (var b = 0; b < height; b += windowWidth / gridSize) {
      //add the grid shapes to the array at x = a and y = b
      grid.push(new GridWrapper(a, b));
    }
  }
}

function GridWrapper(x, y) {
  this.x = x;
  this.y = y;
  this.size = {
    width: windowWidth / gridSize,
    height: windowWidth / gridSize,
  };
  this.fillColor = getRandomColor();

  this.show = function () {
    stroke(0);
    strokeWeight(0);
    fill(this.fillColor);
    rect(this.x, this.y, this.size.width, this.size.height);
  }

}



//*****************************
// helpers
//*****************************

function getRandomColor() {
  return colors[int(random(0, colors.length))];
}