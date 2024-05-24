# Zehua_Ren_zren0057_individial
## Description of the interaction with the work: 
Run the program after the mouse click on the canvas, it will play music, the position and width of the rectangle will change according to the frequency of the music, the modified code is shown in Figure

**I chose audio to drive my personal code.** 

It obtains the audio data by loading an audio file and using FFT (Fast Fourier Transform) and an amplitude analyzer. It then maps the audio data to the dimensions of small squares for visualization.

First, in the preload() function, an audio file named 'C-Walk.mp3' is loaded through the loadSound() function.
Then, in the setup() function, a canvas of 500x500 pixels size is created and some variables are initialized. Among them, u denotes the width of each small square, which is obtained by dividing the width of the canvas by N. v denotes the boundary of each small square, which is obtained by dividing u by 4. fft is an FFT object provided by the p5.js library, which is used for spectral analysis. amp is an amplitude analyzer object provided by the p5.js library, which is used for obtaining the amplitude data of the audio. amp. setInput(sound) sets the loaded audio file as the input to the amplitude analyzer.
Next, in the draw() function, the background color is first drawn. Then, the spectral data of the audio is obtained with fft.analyze() and the result is stored in the spectrum array.
Next, use a for.... .of loop to iterate through each small square object in the rectangles array. For each rectangles, call the drawRectangle() function to draw it. drawRectangle() accepts the rectangles' position and size parameters, as well as an internal color parameter. Here, recta.i * u and recta.j * u denote the position of the cube, recta.si * u + map(spectrum[0], 0, 300, -100, 100) denotes the width of the cube, recta.sj * u denotes the height of the cube, and recta.insideCol denotes the inside color of the cube. Among them, the map() function is used to map the value of spectrum[0] from 0 to 300 to the range of -100 to 100 to realize the effect of audio data on the size of the small square.
In summary, this code implements an audio-based visualization effect that dynamically changes with the audio by mapping the audio data to the dimensions of the small cube

_The highlighted changes are as follows:_
```
// Set the canvas size
var sound,fft,amp;
var spectrum;

let rads=[];
let colors=["#485696","#e7e7e7","#f9c784","#007a1e","#000c00"]

let go=0
let size=0
```

```
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
```

```
  spectrum = fft.analyze();
  
  // Iterate over all the cubes
  for (let rect of rectangles) {
    // Drawing small squares
    drawRectangle(rect.i * u, rect.j * u, rect.si * u + map(spectrum[0], 0, 300, -100, 100), rect.sj * u, rect.insideCol);
  }
```

Add a class creates rotated line effects. In the constructor of the class, a parameter r is passed, indicating the angle of rotation. The class contains the attributes rotation, y (the position of the line), length and color. The constructor uses a random function to randomly select the color.
The update method is used to update the position of the line, increasing the y attribute by 2 with each call, and removing the line from the rads array when the line is out of range of the canvas.
The display method is used to display the line, first using the push and pop functions to save and restore the drawing style settings. Translate at the center of the canvas, rotate according to the rotation property, set the line color, thickness and endpoint style, and then draw the line.

_code:_
```
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
```