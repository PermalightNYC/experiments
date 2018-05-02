p5.disableFriendlyErrors = true;
var debug = false;
var fps = 60;
var system;
var listOfColors = [];
var playing = true;
var fullLight = false;
var sphereDiameter = 10;

var mouseRadius = 20; //Repelling radius

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  listOfColors = [color('#b5c1cc'), color('#5b636a'), color('#66ffff'), color('#6600ff')];
  background(0);
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1.5);
  frameRate(fps);
  system = new ParticleSystem(createVector(width/2, height/2, 0));
}

function draw() {
  background(0);
  rotateY(millis() / 2500);
  rotateZ(millis() / 5000);
  if (!fullLight) {
    directionalLight(255, width/2, height/2, 0);
    ambientLight(sphereDiameter*8);
  } else {
    ambientLight(255);
  }
  system.addParticle();
  system.run();
  debugHelpers();
}

function mousePressed() {
  if (playing) {
    noLoop()
  } else {
    loop()
  }
  playing = !playing;
}


// A simple Particle class
var Particle = function(position) {
  this.acceleration = createVector(0, 0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1), random(-1, 1));
  this.color = getRandomColor();
  this.position = position.copy();
  this.history = [];
  this.lifespan = 800.0;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  this.lifespan -= 2;

  this.history.push(this.position);
  // console.log(this.history);
};

// Method to display
Particle.prototype.display = function() {
  noStroke();
  var c = this.color;
  c._array[3] = this.lifespan / 255;
  if (!fullLight) {
    ambientMaterial(c);
  } else {
    fill(c);
  }
  push()
  translate(width/2 - this.position.x, height/2 - this.position.y, this.position.z);
  sphere(sphereDiameter);
  pop()
  // stroke(this.color, this.lifespan);
  if (!fullLight) {
    ambientMaterial(c);
  } else {
    stroke(c);
    fill(c);
  }
  // push();
  // for (var i = 1; i < 5; i++) {
  //   push();
  //   translate(width/2 - this.position.x, height/2 - this.position.y, this.position.z);
  //   sphere(sphereDiameter/3);
  //   pop();
  // }
  // pop();
  // line(width/2 - this.position.x, height/2 - this.position.y, this.position.z, 0, 0, 0);
};

// Is the particle still useful?
Particle.prototype.isDead = function(){
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};



var ParticleSystem = function(position) {
  this.origin = position.copy();
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {
  for (var i = this.particles.length-1; i >= 0; i--) {
    var p = this.particles[i];
    p.run();
    if (p.isDead()) {
      this.particles.splice(i, 1);
    }
  }
};


//*****************************
// helpers
//*****************************

function getRandomColor() {
  return listOfColors[int(random(0, listOfColors.length))];
}
function currentMouseX(){
  return mouseX - width/2;
}
function currentMouseY(){
  return mouseY - height/2;
}

function debugHelpers(){
  if(!debug){return;}

  p5.disableFriendlyErrors = false;

  push();
  translate(currentMouseX(), currentMouseY(), 0);

  // var wS = width/2;
  // var hS = height/2;
  // // var xteste = 0.08;

  // var tmX = (mouseX - wS);// - (mouseX * xteste);
  // var tmY = (mouseY - hS);

  // translate(tmX, tmY, 0);


  // console.log(width, height, tmX, tmY,mouseX * xteste, xteste);


  ambientMaterial("#ff0000");
  plane(mouseRadius);
  ambientMaterial("#00ff00");
  plane(4);
  pop();

  push();
    ambientMaterial("#ff0000");
    sphere(5);
  pop();
}
