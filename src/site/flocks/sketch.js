var fps = 60;
var numShapes = 100;
var radius = 18;
var boids = [];
var colors;
var flock;
var defaultLifespan = 1000;

function windowResized() {
  resizeCanvas(windowWidth, windowHeight, WEBGL);
}

function setup() {
  background(0);
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1.5);
  frameRate(fps);
  colors = [color('#6548cd'), color('#1e1e1e')];
  flock = new Flock();

  for (var i = 0; i < numShapes; i++) {
    var b = new Boid(random(width), random(height), lerpColor(colors[0], colors[1], random(1)));
    flock.addBoid(b);
  }
}

function draw() {
  background(0);
  flock.run();
}



// Add a new boid into the System
function mouseMoved() {
  flock.addBoid(new Boid(mouseX, mouseY, lerpColor(colors[0], colors[1], random(1)), true));
}
// Add a new boid into the System
function touchMoved() {
  flock.addBoid(new Boid(mouseX, mouseY, lerpColor(colors[0], colors[1], random(1)), true));
}

// Flock object
// Does very little, simply manages the array of all the boids

var Flock = function() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}

Flock.prototype.run = function() {
  for (var i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
    if (this.boids[i].isDead()) {
      this.boids.splice(i, 1);
    }
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}




var Boid = function(x, y, col, temp) {
  this.acceleration = createVector(0, 0);
  this.velocity = p5.Vector.random2D();
  this.position = createVector(x, y);
  this.color = col;
  this.r = 3.0;
  this.size = random(radius/2,radius);
  this.maxspeed = 0.5; // Maximum speed
  this.maxforce = 0.005; // Maximum steering force
  this.lifespan = defaultLifespan;
  if (temp) {
    this.dying = true;
  } else {
    this.dying = false;
  }
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

Boid.prototype.applyForce = function(force) {
  this.acceleration.add(force);
}

Boid.prototype.flock = function(boids) {
  var sep = this.separate(boids);
  var ali = this.align(boids);
  var coh = this.cohesion(boids);
  sep.mult(12.5);
  ali.mult(1.0);
  coh.mult(1.0);
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

Boid.prototype.update = function() {
  this.velocity.add(this.acceleration);
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  this.acceleration.mult(0);
  if (this.dying) {
    this.lifespan -= 2;
  }
}

Boid.prototype.seek = function(target) {
  var desired = p5.Vector.sub(target, this.position);
  desired.normalize();
  desired.mult(this.maxspeed);
  var steer = p5.Vector.sub(desired, this.velocity);
  steer.limit(this.maxforce);
  return steer;
}

Boid.prototype.render = function() {
  var c = this.color;
  if (this.lifespan) {
    c._array[3] = this.lifespan / 255;
  }
  fill(c);
  noStroke();
  ellipse(this.position.x, this.position.y, this.size, this.size);
}

Boid.prototype.borders = function() {
  if (this.position.x < -this.r) this.position.x = width + this.r;
  if (this.position.y < -this.r) this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
}

Boid.prototype.separate = function(boids) {
  var desiredseparation = this.size;
  var steer = createVector(0, 0);
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position, boids[i].position);
    if ((d > 0) && (d < desiredseparation)) {
      var diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d);
      steer.add(diff);
      count++;
    }
  }

  if (count > 0) {
    steer.div(count);
  }

  if (steer.mag() > 0) {
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

Boid.prototype.align = function(boids) {
  var neighbordist = this.size;
  var sum = createVector(0, 0);
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position, boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    var steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

Boid.prototype.cohesion = function(boids) {
  var neighbordist = this.size;
  var sum = createVector(0, 0);
  var count = 0;
  for (var i = 0; i < boids.length; i++) {
    var d = p5.Vector.dist(this.position, boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);
  } else {
    return createVector(0, 0);
  }
}

Boid.prototype.isDead = function(){
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};


function getRandomColor() {
  return colors[int(random(0, colors.length))];
}
