


// p5.disableFriendlyErrors = true;

var homeHero = function(anim) {
  var fps = 30;
  var parent;
  var canvas;
  var system;
  var colors = [];
  var r = 50;
  var totalPoints = 3;
  var mainSize = 20;
  var bgImg;
  var fgImg;
  var defaultLifespan = 700;
  var black;

  anim.preload = function() {
    bgImg = anim.loadImage('/img/texture--animated__home.png');
    fgImg = anim.loadImage('/img/hero--animated__image.png');
  }

  anim.windowResized = function() {
    canvas = anim.resizeCanvas(anim.windowWidth, anim.windowHeight);
    drawForegroundImage();
  }

  anim.setup = function() {
    colors = [anim.color('#6e40d5'), anim.color('#1e1e1e')];
    black = anim.color('#171717');
    anim.background(black);
    anim.pixelDensity(1.5);
    anim.frameRate(fps);
    anim.imageMode(anim.CENTER);

    canvas = anim.createCanvas(anim.windowWidth, anim.windowHeight);
    system = new ParticleSystem(anim.createVector(anim.width/2, anim.height/2));
  }

  anim.draw = function() {
    anim.background(black);
    anim.image(bgImg,anim.width/2,anim.height/2, anim.width);

    var modulo = getRandomInt(10,20);
    if (anim.frameCount%modulo===0) {
      drawCircle();
    }
    system.run();
    drawForegroundImage();
  }

  function drawCircle() {
    system.addParticle(-anim.width/3.5,0);
  }

  function drawForegroundImage() {
    if (anim.width > 768) {
      anim.image(fgImg, anim.width - fgImg.width/2, anim.height/2, fgImg.width/2, fgImg.height/2);
    } else {
      anim.image(fgImg, anim.width - 100, anim.height/2, fgImg.width/2, fgImg.height/2);
    }
  }


  // A simple Particle class
  var Particle = function(position) {
    // console.log('Position ', position);
    this.acceleration = anim.createVector(getRandom(-0.1,0.1), getRandom(-0.1,0.1));
    this.velocity = p5.Vector.random2D();
    this.color = anim.lerpColor(getRandomColor(),getRandomColor(),getRandom(0,1));
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
    this.velocity.add(anim.createVector(this.acceleration.x * (this.lifespan), this.acceleration.y * (this.lifespan)));
    this.position.add(this.velocity);
    this.history.push(anim.createVector(this.position.x,this.position.y));
    this.lifespan -= 2;
  };

  // Method to display
  Particle.prototype.display = function() {
    anim.noStroke();
    var c = this.color;
    c._array[3] = this.lifespan / 255;
    anim.fill(c);
    anim.ellipse(anim.width/2 - this.position.x, anim.height/2 - this.position.y, this.size, this.size);
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
    this.origin = anim.createVector(x,y);
    this.particles.push(new Particle(this.origin));
  };

  ParticleSystem.prototype.run = function() {

    anim.push();
    for (var i = 0; i < this.particles.length; i++) {
      anim.noStroke();
      var c = this.particles[i].color;
      c._array[3] = this.particles[i].lifespan / 255;
      anim.fill(c);
      for (var j = mainSize*3; j < this.particles[i].history.slice(0,-10).length; j += mainSize/2) {
        var size = anim.map(this.particles[i].lifespan,0,defaultLifespan,mainSize/3, 2, true);
        anim.ellipse(anim.width/2 - this.particles[i].history[j].x, anim.height/2 - this.particles[i].history[j].y, size, size);
      }
    }
    anim.pop();

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
    return colors[anim.int(anim.random(0, colors.length))];
  }

  function getRandomInt(min,max) {
    return Math.floor(Math.random(min) * Math.floor(max));
  }

  function getRandom(min,max) {
    return Math.random(min) * Math.floor(max);
  }

}

new p5(homeHero, 'particle-animation');
