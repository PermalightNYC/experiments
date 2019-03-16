p5.disableFriendlyErrors = true;
var debug = false;
var fps = 60;
var system;
var listOfColors = [];
var fullLight = true;
var sphereRadius = 8;

var mouseRadius = 20; //Repelling radius

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  listOfColors = [color('#e7ff1b'), color('#e1595d'), color('#6e40d5'), color('#7bdce4'), color('#a0ff79'), color('#e0e0e0'), color('#ffffff')];
  background(0);
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1.5);
  frameRate(fps);
  system = new ParticleSystem(createVector(width/2, height/2));
}

function draw() {
  background(0);
  if (frameCount%4 == 0) {
    system.addParticle();
  }
  system.run();
  debugHelpers();
}


// A simple Particle class
var Particle = function(position) {
  this.acceleration = createVector(random(-0.001,0.001), random(-0.001,0.001));
  this.velocity = p5.Vector.random2D();
  this.color = lerpColor(getRandomColor(),getRandomColor(),random(1));
  this.position = position.copy();
  this.size = random(sphereRadius, sphereRadius*2);
  this.lifespan = width;
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
};

// Method to display
Particle.prototype.display = function() {
  noStroke();
  var c = this.color;
  c._array[3] = this.lifespan / 255;
  fill(c);
  push()
  ellipse(width - this.position.x, height - this.position.y, this.size);
  pop()
  // stroke(this.color, this.lifespan);
  // line(width - this.position.x, height - this.position.y, width/2, height/2);
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
