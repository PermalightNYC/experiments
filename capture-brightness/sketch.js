let video;
let vScale = 16;

function setup() {
  createCanvas(960, 720);
  pixelDensity(1);

  var constraints = {
    video: {
      optional: [{ maxFrameRate: 10 }]
    },
    audio: false
  };

  video = createCapture(constraints, VIDEO);
  video.size(width / vScale, height / vScale);
  video.hide();
}

function draw() {
  background(0);

  var cap = video.get();
  cap.loadPixels();
  for (var y = 0; y < video.height; y++) {
    for (var x = 0; x < video.width; x++) {
      var index = (video.width - x - 1 + (y * video.width)) * 4;
      var r = cap.pixels[index + 0];
      var g = cap.pixels[index + 1];
      var b = cap.pixels[index + 2];

      var bright = (r + g + b) / 3;

      var w = map(bright, 0, 255, 0, vScale);

      noStroke();
      fill(bright);
      rectMode(CENTER);
      rect(x * vScale, y * vScale, w, w);

    }
  }

}


/*****************
* Helpers
******************/

function windowResized() {
  resizeCanvas(960, 720);
  video.size(width / vScale, height / vScale);
}
