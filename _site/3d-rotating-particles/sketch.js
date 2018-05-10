p5.disableFriendlyErrors = true;
var debug = false;
var fps = 60;
var system;
var colors = [];
var playing = true;
var fullLight = true;
var particleDelay = 5;
var sphereRadius = 4;
var nucleus = false;

// gui
var visible = true;
var gui, gui2;

var particleDelayMin = 1;
var particleDelayMax = 10;
var particleDelayStep = 1;

var mouseRadius = 20; //Repelling radius

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  colors = [color('#6e40d5'), color('#1e1e1e')];
  background(0);
  createCanvas(windowWidth, windowHeight, WEBGL);
  pixelDensity(1.5);
  frameRate(fps);
  system = new ParticleSystem(createVector(width/2, height/2, 0));
  // Create Layout GUI
  gui = createGui('Options', width - 225, 15);
  gui.addGlobals('fullLight');

}

function draw() {
  background(0);
  rotateY(millis() / 5000);
  rotateZ(millis() / 5000);
  // rotateX(millis() / 5000);

  // orbitControl();

  if (nucleus) {
    push();
      ambientMaterial(colors[0]);
      translate(0,0,0);
      noStroke();
      sphere(sphereRadius*4);
    pop();
  }

  if (!fullLight) {
    directionalLight(255, width/2, height/2, 0);
    ambientLight(225);
  } else {
    ambientLight(255);
  }

  if (frameCount%particleDelay == 0) {
    system.addParticle();
  }
  system.run();
  debugHelpers();
}

// A simple Particle class
var Particle = function(position) {
  this.acceleration = createVector(0, 0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1), random(-1, 1));
  this.color = lerpColor(colors[0], colors[1], random(0,1));
  this.position = position.copy();
  this.size = random(sphereRadius,sphereRadius*2);
  this.history = [];
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
  sphere(this.size);
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
  //   sphere(sphereRadius/3);
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
  return colors[int(random(0, colors.length))];
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
