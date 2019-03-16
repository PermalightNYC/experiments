var song;
var analyzer;
var system;

var NUMSINES = 1; // how many of these things can we do at once?
var sines = new Array(NUMSINES); // an array to hold all the current angles
var rad; // an initial radius value for the central sine
var i; // a counter variable

// play with these to get a sense of what's going on:
var fund = 1; // the speed of the central sine
var ratio = 0.1; // what multiplier for speed is each additional sine?
var alpha = 100; // how opaque is the tracing system

var listOfColors = [];

function preload() {
  song = loadSound('/js/audio/gods-plan.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  song.play();
  analyzer = new p5.Amplitude();
  analyzer.setInput(song);
  listOfColors = [color('#011936'), color('#465362'), color('#82A3A1'), color('#9FC490'), color('#C0DFA1')];
  background(0);

  rad = height/5; // compute radius for central circle

  for (var i = 0; i<sines.length; i++) {
    sines[i] = PI; // start EVERYBODY facing NORTH
  }
}

function draw() {
  var rms = analyzer.getLevel();
  system = new ParticleSystem(createVector(windowWidth/2, windowHeight/2, 0, 0));

  // MAIN ACTION
  // push(); // start a transformation matrix
  // translate(width/2, height/2); // move to middle of screen
  //
  // for (var i = 0; i<sines.length; i++) {
  //   var erad = 0; // radius for small "point" within circle... this is the 'pen' when tracing
  //   // setup for tracing
  //   erad = 1.0*(1.0-float(i)/sines.length); // pen width will be related to which sine
  //   var radius = rad/(i+1); // radius for circle itself
  //   rotate(sines[i]); // rotate circle
  //   push(); // go up one level
  //   translate(0, radius); // move to sine edge
  //   pop(); // go down one level
  //   translate(0, radius); // move into position for next sine
  //   sines[i] = (sines[i]+(fund+(fund*i*ratio)))%TWO_PI; // update angle based on fundamental
  // }
  //
  // pop(); // pop down final transformation
  if (song.isPlaying()) {
    // ellipse(0, 0, erad, erad); // draw with erad if tracing
    system.addParticle();
    system.run();
  }

}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  if ( song.isPlaying() ) { // .isPlaying() returns a boolean
    song.pause(); // .play() will resume from .pause() position
  } else {
    song.play();
  }
}

function getRandomColor() {
  return listOfColors[int(random(0, listOfColors.length))];
}


// A simple Particle class
var Particle = function(position) {
  this.acceleration = createVector(0, 0.01);
  this.velocity = createVector(random(-1,1), random(-1, 0));
  this.position = position.copy();
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
};

// Method to display
Particle.prototype.display = function() {
  stroke(255, this.lifespan);
  strokeWeight(0);
  fill(255, this.lifespan);
  ellipse(this.position.x, this.position.y, 5, 5);
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
