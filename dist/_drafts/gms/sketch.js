const fps = 30;
var x, y, z;

function windowResized() {
  resizeCanvas(windowHeight, windowHeight, WEBGL);
}

function setup() {
  createCanvas(windowHeight, windowHeight, WEBGL);
  pixelDensity(2);
  frameRate(fps);
  background(0);
}

function draw() {
  // orbitControl();
  background(0);
  // rotateY(millis() / 5000);
  // rotateZ(millis() / 5000);
  // rotateX(millis() / 5000);
  directionalLight(255, width / 2, height / 2, -(frameCount * 2));
  noStroke();
  ambientLight(50);
  ambientMaterial(color('#46bf61'));
  sphere(300);
}

//*****************************
// helpers
//*****************************

function getRandomColor() {
  return colors[int(random(0, colors.length))];
}