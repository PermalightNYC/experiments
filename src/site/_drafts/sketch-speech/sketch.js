var myRec = new p5.SpeechRec('en-US', parseResult);
myRec.continuous = true;
myRec.interimResults = true;

var x, y;
var dx, dy;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	fill(255);

	x = width/2;
	y = height/2;
	dx = 0;
	dy = 0;

	textSize(20);
	textAlign(CENTER);
	text("draw: up, down, left, right, clear, stop", width/2, 20);

	myRec.start();
}
function draw() {
  noStroke()
  fill(255);
	ellipse(x, y, 5, 5);
	x+=dx;
	y+=dy;
	if(x<0) x = width;
	if(y<0) y = height;
	if(x>width) x = 0;
	if(y>height) y = 0;
}
function parseResult() {
	// recognition system will often append words into phrases.
	// so hack here is to only use the last word:
	var mostrecentword = myRec.resultString.split(' ').pop();
	if(mostrecentword.indexOf("left")!==-1) { dx=-1;dy=0; }
	else if(mostrecentword.indexOf("right")!==-1) { dx=1;dy=0; }
	else if(mostrecentword.indexOf("up")!==-1) { dx=0;dy=-1; }
	else if(mostrecentword.indexOf("down")!==-1) { dx=0;dy=1; }
	else if(mostrecentword.indexOf("stop")!==-1) { dx=0;dy=0; }
	else if(mostrecentword.indexOf("clear")!==-1) { background(0); }
	console.log(mostrecentword);
}
