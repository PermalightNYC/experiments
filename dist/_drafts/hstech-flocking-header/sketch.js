


p5.disableFriendlyErrors = true;

var homeHero = function(anim) {
  var fps = 30;
  var parent;
  var canvas;
  var colors = [];
  var fgImg;
  var black;
  var numShapes = 100;
  var radius = 18;
  var boids = [];
  var colors;
  var flock;
  var defaultLifespan = 1000;

  anim.preload = function() {
    fgImg = anim.loadImage('/img/hero--animated__image.png');
  }

  anim.windowResized = function() {
    canvas = anim.resizeCanvas(anim.windowWidth, anim.windowHeight);
    drawForegroundImage();
  }

  anim.setup = function() {
    anim.pixelDensity(1.5);
    anim.frameRate(fps);
    anim.imageMode(anim.CENTER);

    canvas = anim.createCanvas(anim.windowWidth, anim.windowHeight, anim.WEBGL);

    colors = [anim.color('#6548cd'), anim.color('#c45a61'), anim.color('#9fdbe2'), anim.color('#c0fd86'), anim.color('#eefe53')];
    flock = new Flock();

    if (anim.windowWidth < 768) {
      numShapes = 40;
    }

    for (var i = 0; i < numShapes; i++) {
      var b = new Boid(anim.random(anim.width), anim.random(anim.height), getRandomColor());
      flock.addBoid(b);
    }
  }

  anim.draw = function() {
    anim.background(anim.color(0,0,0,0));

    flock.run();
  }

  function drawForegroundImage() {
    anim.fill(0,0,0,0);
    anim.texture(fgImg);
    anim.noStroke();
    if (anim.width > 768) {
      anim.translate(anim.width/3.8, 0, 0);
      anim.plane(fgImg.width/2, fgImg.height/2);
    } else {
      anim.translate(fgImg.width/4, 0, 0);
      anim.plane(fgImg.width/2, fgImg.height/2);
    }
  }

  // Add a new boid into the System
  function mouseMoved() {
    flock.addBoid(new Boid(anim.mouseX, anim.mouseY, getRandomColor(), true));
  }
  // Add a new boid into the System
  function touchMoved() {
    flock.addBoid(new Boid(anim.mouseX, anim.mouseY, getRandomColor(), true));
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
    this.acceleration = anim.createVector(0, 0);
    this.velocity = p5.Vector.random2D();
    this.position = anim.createVector(x, y);
    this.color = col;
    this.r = 3.0;
    this.size = anim.random(radius/2,radius);
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
    // this.borders();
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
    if (this.lifespan <= 0) {
      c._array[3] = 0;
    } else {
      c._array[3] = this.lifespan / 255;
    }
    anim.fill(c);
    anim.noStroke();
    anim.ellipse(this.position.x, this.position.y, this.size, this.size);
  }

  // Boid.prototype.borders = function() {
  //   if (this.position.x < -this.r) this.position.x = anim.width + this.r;
  //   if (this.position.y < -this.r) this.position.y = anim.height + this.r;
  //   if (this.position.x > anim.width + this.r) this.position.x = -this.r;
  //   if (this.position.y > anim.height + this.r) this.position.y = -this.r;
  // }

  Boid.prototype.separate = function(boids) {
    var desiredseparation = this.size;
    var steer = anim.createVector(0, 0);
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
    var sum = anim.createVector(0, 0);
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
      return anim.createVector(0, 0);
    }
  }

  Boid.prototype.cohesion = function(boids) {
    var neighbordist = this.size;
    var sum = anim.createVector(0, 0);
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
      return anim.createVector(0, 0);
    }
  }

  Boid.prototype.isDead = function(){
    if (this.lifespan < 0) {
      return true;
    } else {
      return false;
    }
  };



  //*****************************
  // helpers
  //*****************************

  function getRandomColor() {
    return colors[anim.int(anim.random(0, colors.length))];
  }

  function getRandomInt(min,max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function getRandom(min,max) {
    return Math.random(min) * Math.floor(max);
  }

}

new p5(homeHero, 'particle-animation');
