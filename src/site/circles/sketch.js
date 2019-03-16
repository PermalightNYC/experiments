var song;
var button;
var vol = 1;
var yoff = 0.0;
var listOfColors = [];

function preload() {
  song = loadSound('/js/audio/love-wont-let-me-down.mp3');
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
  // background(0);
  // Get the average (root mean square) amplitude
  var rms = analyzer.getLevel();
  fill(getRandomColor());
  noStroke();
  if (song.isPlaying()) {
    var duration = song.duration();
    var test = map(song.currentTime() / duration, 0, windowWidth, 0, windowHeight);
    drawRandomCirclesStroke(rms);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key===' ') {
    if ( song.isPlaying() ) {
      song.pause();
    } else {
      song.play();
    }
  }
  return false;
}

function getRandomColor() {
  return listOfColors[int(random(0, listOfColors.length))];
}

function drawRandomCirclesStroke(rms) {
  noFill();
  stroke(getRandomColor());
  strokeWeight(rms*100);
  ellipse(random(0, windowWidth), random(0, windowHeight), 1+rms*30, 1+rms*30);
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
