var setsphere = 0;                                              // 0:false, 1:true
var spherecreateCanvas = 300;                                       // Base Sphere createCanvas
var numberofdots = 1000;                             // number of flocking dot
var dotcreateCanvas = 4;                                                  // flocking dot createCanvas
var dotspeed = 5.0;                                    // flocking dot speed
var setcolor = 1;                                               // 0:monochro, 1:rainbow, 2:soapbubble
var dotcolor;   // colormode = HSB
var h = 0;
var a  = 100;


function setup() {

  createCanvas(800, 800, WEBGL);
  colorMode(HSB);

  color = color(255, 255, 255);

  // cam = new PeasyCam(this, 800); // init camera distance from the origin
  //cam.setMinimumDistance(500);
  //cam.setMaximumDistance(5000);

  // physics = new VPhysics();

  //init dots
  for (var i = 0; i < numberofdots; i++) {

    var pos = createVector(0, 0, 0);
    var vel = createVector(random(-1, 1), random(-1, 1), random(-1, 1));
    var p = new Boid(pos, vel);

//  When you change this parameter, then dots behavior is changed
    // p.swarm.setSeperationScale(1.0f);
    // p.swarm.setSeperationRadius(80);
    // p.swarm.setAlignScale(.8f);
    // p.swarm.setAlignRadius(80);
    // p.swarm.setCohesionScale(.08f);
    // p.swarm.setCohesionRadius(50);
    // p.swarm.setMaxSpeed(dotspeed);
    // physics.addParticle(p);

    // var anchor = new VSpring(new VParticle(p.x(), p.y(), p.z()), p, spherecreateCanvas, .5f);
    // physics.addSpring(anchor);
  }
}

function draw() {
  background(0);

  // set base sphere
  if (setsphere == 1) {
    noFill();
    stroke(255, 0, 255, a);
    sphere(spherecreateCanvas);
    a--;
  }

  physics.update();

  // colormode: rainbow
  if (setcolor == 1) {
    h += 1;
    if (h ==2550) h = 0;
    dotcolor = color(h/10, 150, 255);
  }

  for (var i = 0; i < physics.particles.createCanvas(); i++) {
    var boid = physics.particles.get(i);

    // colormode: soap bubble
    if (setcolor == 2) {
      h = boid.y;
      h += spherecreateCanvas;
      dotcolor = color(h*255/(2*spherecreateCanvas), 150, 255);
    }

    strokeWeight(dotcreateCanvas);
    stroke(dotcolor);
    povar(boid.x, boid.y, boid.z);
  }
  //save frame for creating movie
  //saveFrame("frames/######.tif");
}



var Boid = function(x, y, col) {
  this.acceleration = createVector(0, 0);
  this.velocity = p5.Vector.random3D();
  this.position = createVector(x, y);
  this.color = col;
  this.r = 3.0;
  this.size = random(dotcreateCanvas/3,dotcreateCanvas);
  this.maxspeed = 1; // Maximum speed
  this.maxforce = 0.001; // Maximum steering force
  this.lifespan = 500.0;
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
  this.lifespan -= 2;
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
  c._array[3] = this.lifespan / 255;
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
  var desiredseparation = 25.0;
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
  var neighbordist = 10;
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
  var neighbordist = 50;
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
