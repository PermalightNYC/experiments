var song;
var analyzer;
var system;

var particles = [];
var particleCount = 100;

var listOfColors = [];

function preload() {
  song = loadSound('/js/audio/gods-plan.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  song.play();
  analyzer = new p5.FFT(0);
  amplitude = new p5.Amplitude();
  analyzer.setInput(song);
  noStroke();
  colorMode(HSB, 255);
  background(0);
  // system = new ParticleSystem(createVector(windowWidth/2, windowHeight/2));

  for (var i = 0; i < particleCount; i++) {
    var newParticle = new Particle(i);
    particles.push( newParticle );
  }
}

function draw() {
  background(0);
  var rms = analyzer.waveform();
  var amp = amplitude.getLevel();

  if (song.isPlaying()) {
    translate(width/2, height/2);

    var spectrum = analyzer.analyze();

    // for (var i = 0; i < particleCount; i++) {
    //   particles[i].update();
    //   particles[i].display();
    // }
  }

}


// A simple Particle class
var Particle = function(position) {
  console.log(position);
  this.acceleration = createVector(0, 0.03);
  this.velocity = createVector(random(-1,1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 4000.0;
};

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  if ( song.isPlaying() ) {
    song.pause();
  } else {
    song.play();
  }
}
