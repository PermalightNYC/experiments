var x, y, z;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  background(0);
  x = width/2;
  y = height/2;
  z = 0;
}

function draw() {
  orbitControl();
  background(0);
  translate(0, 0, 0);
  // noStroke();
  fill(255);
  torus(height/4, height/32);
}


/*****************
* Helpers
******************/

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
