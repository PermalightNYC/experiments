p5.disableFriendlyErrors = true;
var fps = 60;
var system;
var colors = [];
var r = 50;
var mainSize = 16;
var trails = true;
var bgImg;
var fgImg;
var defaultLifespan = 800;

// gui
var visible = true;
var gui, gui2;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function setup() {
  colors = [color('#6e40d5'), color('#1e1e1e')];
  background(color('#000'));
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1.5);
  frameRate(fps);

  system = new ParticleSystem(createVector(width/2, height/2));
}

function draw() {
  background(color('#000'));
  drawCircles();
}

function drawCircles() {
  fill(lerpColor(colors[0], colors[1], random(0,1)));
  noStroke();
  var modulo = ceil(random(20,45));
  if (frameCount%modulo===0) {
    system.addParticle(0,0);
  }
  system.run();
}


// A simple Particle class
var Particle = function(position) {
  this.acceleration = createVector(random(-0.00001,0.00001), random(-0.00001,0.00001));
  this.velocity = p5.Vector.random2D();
  this.color = lerpColor(getRandomColor(),getRandomColor(),random(1));
  this.position = position.copy();
  this.history = [];
  this.size = mainSize;
  this.lifespan = defaultLifespan;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  this.velocity.add(createVector(this.acceleration.x * (this.lifespan/2), this.acceleration.y * (this.lifespan/2)));
  this.position.add(this.velocity);
  this.history.push(createVector(this.position.x,this.position.y));
  this.lifespan -= 2;
};

// Method to display
Particle.prototype.display = function() {
  noStroke();
  var c = this.color;
  c._array[3] = this.lifespan / 255;
  fill(c);
  ellipse(width/2 - this.position.x, height/2 - this.position.y, this.size, this.size);
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
  this.particles = [];
};

ParticleSystem.prototype.addParticle = function(x,y) {
  this.origin = createVector(x,y);
  this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {

  if (trails) {

    push();
    for (var i = 0; i < this.particles.length; i++) {
      noStroke();
      var c = this.particles[i].color;
      c._array[3] = this.particles[i].lifespan / 255;
      fill(c);
      for (var j = 0; j < this.particles[i].history.slice(0,-9).length; j += mainSize/2) {
        var size = map(this.particles[i].lifespan,0,defaultLifespan,mainSize/2, 3, true);
        ellipse(width/2 - this.particles[i].history[j].x, height/2 - this.particles[i].history[j].y, size, size);
      }
    }
    pop();

  }

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
