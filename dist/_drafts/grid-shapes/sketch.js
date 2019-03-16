const fps = 10;
let gridSize = 5;
let colors;
let grid = [];


function windowResized() {
  resizeCanvas(windowHeight, windowHeight);
  drawGrid();
  redraw();
}

function setup() {
  background(0);
  createCanvas(windowHeight, windowHeight);
  pixelDensity(2);
  frameRate(fps);
  colors = [color('#ffe74c'), color('#ff5964'), color('#6bf178'), color('#35a7ff'), color('#ffffff')];

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
  let index = 0;
  for (var a = 0; a < width; a += width / gridSize) {
    for (var b = 0; b < height; b += height / gridSize) {
      //add the grid shapes to the array at x = a and y = b
      index++;
      grid.push(new GridWrapper(b, a, index));
    }
  }
}

function GridWrapper(x, y, index) {
  this.x = x;
  this.y = y;
  this.size = {
    width: width / gridSize,
    height: height / gridSize,
  };
  this.index = index;
  this.showIndex = false;
  this.fillColor = getRandomColor();

  this.show = function () {
    if (this.index % 2 === 1) {
      noStroke();
      fill(this.fillColor);
      rect(this.x, this.y, this.size.width, this.size.height);
      if (this.showIndex) {
        fill(0);
        text(this.index, this.x + (gridSize), this.y + (gridSize))
      }
    }
  }

}



//*****************************
// helpers
//*****************************

function getRandomColor() {
  return colors[int(random(0, colors.length))];
}