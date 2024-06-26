let margin = 2;
let N = 16;
let u, v;
let backCol = "#fffcf2";
let palette = ["#050505", "#2b67af", "#ef562f", "#f2eac1"], mainCol = "#f9d531";
let allColors = [...palette.slice(1), mainCol];

let rectangles = [];

let randInt = (a, b) => (Math.floor(Math.random() * (b - a) + a));

// Set the canvas size
var sound,fft,amp;
var spectrum;

let rads=[];
let colors=["#485696","#e7e7e7","#f9c784","#007a1e","#000c00"]

let go=0
let size=0

class rad{
  constructor(r){
    this.rotation=r
    this.y=0;
    this.length=5
    this.color=random(colors);
  }
  
  update(){
    this.y+=2
    if(this.y>width+height/2){
      let index = rads.indexOf(this);
      rads.splice(index, 1);
    }
    
  }
  display(){
    push();
    translate(width/2, height/2);
    rotate(this.rotation);
    stroke(this.color);
    strokeWeight(20 - 10 * sin(size));
    strokeCap(PROJECT)
    line(0, this.y+this.length, 0, this.y)
    pop();
    
  }
}

function preload() {
  sound = loadSound('C-Walk.mp3');
  
}

// Setting the canvas size
function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES)
  // Calculate the width of each small square
  u = width / N;
  // Calculate the boundary of each small square
  v = u / 4;

  fft = new p5.FFT(0.8,512);  
  amp = new p5.Amplitude(0.3);
	amp.setInput(sound);
 
  createComposition();

}

// plotting function
function draw() {
  // Drawing background color
  background(backCol);
  
  if(sin(go)<0.018 && sin(go)>-0.18){
   for(let i=0; i<360; i+=10){
    rads.push(new rad(i))
   }
  }
  
  for(let rad of rads){
    rad.update();
    rad.display();
  }

  go +=10
  size+=3
  noStroke()
  fill(0, 50)
  ellipse (width/2+3, height/2+3, 103)
  fill(255)
  ellipse (width/2, height/2, 100)
  noStroke()
  randomSeed(2)
  spectrum = fft.analyze();
  
  // Iterate over all the cubes
  for (let rect of rectangles) {
    // Drawing small squares
    drawRectangle(rect.i * u, rect.j * u, rect.si * u + map(spectrum[0], 0, 300, -100, 100), rect.sj * u, rect.insideCol);
  }
}

// Creating Combined Pattern Functions
function createComposition() {
  // Generate random cubes and add to the array until a certain number is reached
  for (let i = 0; i < 2000; i++) {
    let newRecta = generateRectangle();
    let canAdd = true;
    // Checks if the newly generated cube intersects an existing cube in the array.
    for (let recta of rectangles) {
      if (rectanglesIntersect(newRecta, recta)) {
        canAdd = false;
        break;
      }
    }
    // If they do not intersect then add to the array
    if (canAdd) {
      rectangles.push(newRecta);
    }
  }

  // Generate a circle of small squares around the edge
  for (let i = margin; i < N - margin; i++) {
    for (let j = margin; j < N - margin; j++) {
      let newRecta = {
        i: i,
        j: j,
        si: 1,
        sj: 1
      }
      let canAdd = true;
      // Checks if the newly generated cube intersects an existing cube in the array.
      for (let recta of rectangles) {
        if (rectanglesIntersect(newRecta, recta)) {
          canAdd = false;
          break;
        }
      }
      // If they do not intersect then add to the array
      if (canAdd) {
        rectangles.push(newRecta);
      }
    }
  }

  // Assigning internal colors to some small squares
  let colors = [...allColors, ...allColors];
  let i = 0;
  while (colors.length > 0) {
    if (rectangles[i].si > 1 && rectangles[i].sj > 1 && (rectangles[i].si + rectangles[i].sj) < 7) rectangles[i].insideCol = colors.pop();
    i++;
    if (i >= rectangles.length) break;
  }
}

// Determine if two cubes intersect
function rectanglesIntersect(recta1, recta2) {
  return ((recta1.i <= recta2.i && recta1.i + recta1.si > recta2.i) || (recta2.i <= recta1.i && recta2.i + recta2.si > recta1.i)) && ((recta1.j <= recta2.j && recta1.j + recta1.sj > recta2.j) || (recta2.j <= recta1.j && recta2.j + recta2.sj > recta1.j));
}

// Generate randomized cubes
function generateRectangle() {
  let si, sj;
  do {
    // Random generation of si and sj
    si = Math.floor(randInt(3, 10) / 2);
    sj = Math.floor(randInt(3, 10) / 2);
  } while ((si == 1 && sj == 1) || (si >= 4 && sj >= 4))
  // Randomly generate i and j
  let i = randInt(margin, N - margin - si + 1);
  let j = randInt(margin, N - margin - sj + 1);
  let recta = {
    i: i,
    j: j,
    si: si,
    sj: sj
  };
  return recta;
}

// Define a function that draws a rectangle with an inner color
function drawRectangle(x0, y0, si, sj, insideCol) {
  // If there is an internal color parameter
  if (insideCol) {
    // Fill interior color
    fill(insideCol);
    // Drawing internal rectangles
    rect(x0 + 2 * v, y0 + 2 * v, si - 3 * v, sj - 3 * v);
    // If the difference between the length and width of the rectangle is less than 2 * u
    if (Math.abs(si - sj) < 2 * u) {
      // Choose a color at random
      fill(random(allColors));
      // Drawing internal rectangles with different aspect sizes
      if (si < sj) {
        rect(x0 + 3 * v, y0 + (sj - (si - 6 * v)) / 2, si - 5 * v, si - 5 * v);
      } else if (sj < si) {
        rect(x0 + (si - (sj - 6 * v)) / 2, y0 + 3 * v, sj - 5 * v, sj - 5 * v);
      }
    }
  }

  // Initialization variables for storing colors
  let prevCol1, prevCol2, newCol;
  // Horizontal Loop Drawing Rectangle
  for (let x = x0; x < x0 + si + v / 2; x += v) {
    // Select a new color that is different from the previous one
    do {
      newCol = random(palette);
    } while (newCol == prevCol1)
    // Use the primary color with a 2/3 probability
    if (Math.random() < 2 / 3) newCol = mainCol;
    // Fill colors and draw rectangles
    fill(newCol);
    prevCol1 = newCol;
    rect(x, y0, v, v);

    // Select a new color that is different from the previous one
    do {
      newCol = random(palette);
    } while (newCol == prevCol2)
    // Use the primary color with a 2/3 probability
    // if (Math.random() < 2 / 3) newCol = mainCol;
    // Fill colors and draw rectangles
    fill(newCol);
    prevCol2 = newCol;
    rect(x, y0 + sj, v, v);
  }
}

function mousePressed() {
	if (!sound.isPlaying()) {
		sound.play(0);
    //Set the volume of music
		sound.setVolume(1);
	} else {
		sound.pause();
	}
}