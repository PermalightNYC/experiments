var song;
var button;
var vol = 1;
var yoff = 0.0;
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
}

function draw() {
  // Get the average (root mean square) amplitude
  var rms = analyzer.getLevel();
  fill(getRandomColor());
  noStroke();
  if (song.isPlaying()) {
    var duration = song.duration();
    var test = map(song.currentTime() / duration, 0, windowWidth, 0, windowHeight);
    // drawRandomCircles(rms);
    // drawRandomCirclesStroke(rms);
    // drawMouseFollow(rms);
    // drawAmpCircle(rms);
    drawAmpLine(rms);
  }
  // frameRate(30);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key===' ') {
    if ( song.isPlaying() ) { // .isPlaying() returns a boolean
      song.pause(); // .play() will resume from .pause() position
    } else {
      song.play();
    }
  }
  return false;
}

function getRandomColor() {
  return listOfColors[int(random(0, listOfColors.length))];
}

function drawRandomCircles(rms) {
  noStroke();
  fill(getRandomColor());
  ellipse(random(0, windowWidth), random(0, windowHeight), 1+rms*300, 1+rms*300);
}

function drawRandomCirclesStroke(rms) {
  noFill();
  stroke(getRandomColor());
  strokeWeight(rms*100);
  ellipse(random(0, windowWidth), random(0, windowHeight), 1+rms*50, 1+rms*50);
}

function drawAmpLine(rms) {
  beginShape();
  background(0);
  noFill();
  stroke(lerpColor(getRandomColor(), getRandomColor(), .1));
  var xoff = 0.0;
  // Iterate over horizontal pixels
  for (var x = -1; x <= width + 1; x += 1) {
    // Calculate a y value according to noise, map to
    var y = map(noise(xoff, yoff), 0, 1, 0,windowHeight);
    // Set the vertex
    vertex(x, y);
    // Increment x dimension for noise
    xoff += 0.01;
  }
  // increment y dimension for noise
  yoff += rms*5;
  vertex(width + 1, height + 1);
  vertex(-1, height + 1);
  endShape(CLOSE);
  // frameRate(5);
}

function drawAmpCircle(rms) {
  noFill();
  stroke(getRandomColor());
  ellipse(windowWidth/2 - 10, windowHeight/2 - 10, 10+rms*(rms*3000), 10+rms*(rms*3000));
}

function drawMouseFollow(rms) {
  noFill();
  stroke(getRandomColor());
  strokeWeight(rms*100);
  ellipse(mouseX, mouseY, 10+rms*300, 10+rms*300);
}
