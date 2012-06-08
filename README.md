#HTML5 Game Fundamentals

A creative-commons book on building games with HTML5, JavaScript, and CSS.<br>
Jason Kadrmas @itooamaneatguy

## Table Of Contents

* [Introduction](#introduction)
* [The Basics](#thebasics)
  * [DOM](#thebasics-dom)
  * [Canvas](#thebasics-canvas)
  * [Choosing Assets](#thebasics-assets)
      * [Images](#thebasics-img)
      * [CSS](#thebasics-css)
      * [SVG](#thebasics-svg)
      * [Icon Fonts](#thebasics-icon-fonts)
* [Game Concepts](#concepts)  
  * [Game Loop](#concepts-gameloop)
      * [requestAnimationFrame](#concepts-raf)
      * [cancelAnimationFrame](#concepts-caf)
  * [Scale - Coming Soon](#concepts-scale)
      * [CSS](#scale-css)
          * [Em's](#scale-ems)
          * [Percentages](#scale-percentages)
    * [Grid System](#scale-grid)
  * [Animation](#concepts-animation)  
    * [DOM Animation](#concepts-animation-dom)
        * [CSS Transitions](#concepts-animation-transitions)
        * [Using the game loop](#concepts-animation-loop)
    * [Canvas Animation](#concepts-animation-canvas)
    * [Sprite Sheets](#concepts-animation-sprite-sheets)
        * [DOM](#concepts-animation-sprite-sheets-dom)
        * [Canvas](#concepts-animation-sprite-sheets-canvas)
* [Saving Data](#saving)
* [WebGL](#webgl) 
* [PhoneGap](#phonegap)
* [Automation](#automation)
* [Debugging](#debugging)
* [Multiplayer](#multiplayer)

## <a name="introduction">Introduction</a>
Games have always been a part of society, capturing ideas and behaviors of people and becoming an extension of their imagination and creativity.  Dice games, tile games, and card games all date back to ancient times, with dice games dating as far back as 3000 years.  Today's games still spark those same human interactions.  Although the same principles apply to today's games, the medium has changed dramatically. Now days there many options when creating a game. Almost all older games have an online counterpart and due to the popularity of app stores, games have become even easier to market and distribute.  The question then arises, what technology should I use to build my game?

Web games until very recently were almost exclusively built on platforms using browser plugins.  Adobe Flash was king with other plugins like Unity filling out the market. With almost unbelievable performance updates to JavaScript engines, the bitmap drawing capabilities of canvas, and powerful new CSS3 features, the dream of building an entire game without plugins is becoming a reality.  Building a game exclusively using web technologies presents a set of challenges, however, the landscape is changing at an alarming pace.  New specs and API's seem to be coming out on a daily basis, and browser vendors are aggressively implementing these new features.  It is an exciting time to be a creative JavaScript developer!

The aim of this book is to highlight some common gaming practices and how those practices can relate when building a game with HTML5, JavaScript, and CSS.  Note: The source code for the accompanying examples can be found in the examples folder of this GitHub repository.

## <a name="thebasics">The Basics</a>
Like any detailed subject, gaming has some basic principles that can be useful when getting started.  HTML5 games in particular have a few different options and depending on what you choose, they have very different possibilities and limitations.

### <a name="thebasics-dom">DOM</a>
The first option we will explore when building an HTML5 game is a DOM based game.  When HTML5 games are mentioned, your first thought, like mine, is most likely centered on building a canvas-based game.  Sometimes this is not best option.  Believe it or not DOM based games in some instances can have better performance than canvas.  This is especially true in the mobile space where canvas is most likely not hardware accelerated.

### What is DOM?
The document object model, as described by Wikipedia is a "is a cross-platform and language-independent convention for representing and interacting with objects in HTML, XHTML and XML documents" [1](http://en.wikipedia.org/wiki/Document_Object_Model).  Back in Flash, there was a technique called screen invalidation that would mark areas of the screen that needed to be refreshed based on the objects on the stage and how they were moving.  The browser handles this process in a similar way.  Browser layout engines will listen for changes to the DOM and will repaint or reflow the page accordingly.  So what does this mean for writing games?  It means that the browser is going to do the work of repainting the screen for you when objects change.  This can be beneficial for simple games where there are a few number of elements or updates are happening infrequently.  Board, card, and tile games can be good candidates as DOM based games.  Another added benefit of building DOM based games is that there is already large number of developers that are currently building client applications entirely in JavaScript.  These developers already have the skillset required to start building DOM games without having to learn how to manipulate the canvas element.

### <a name="thebasics-canvas">Canvas</a>

Canvas is an HTML element that is bitmap based and can be drawn to using JavaScript.  A simple analogy is to think of a canvas element like an etch-a-sketch.  You can continue drawing to the canvas context, adding detail, until you decide to clear the canvas.  Clearing the canvas is equivalent to shaking an etch-a-sketch clean.  One issue to note is we will need a separate mechanism to keep track of objects that have been painted to canvas or have been cleared from canvas.  This is because canvas only paints to a context; it does not retain any information or properties on that object, such as width, height, rotation scale, etc.

<center><img src="http://upload.wikimedia.org/wikipedia/commons/b/be/EtchASketch10-23-2004.jpg" width="450" height="350" style="border-radius: 7px; margin: 10px;"></center>

### Canvas Basics
In order to start drawing on a canvas we need access to a canvas context.  There are two separate contexts.  One context is for 2D drawing, and a second context is an experimental context for 3D and WebGL.  For the basics we will start by adding a canvas element and getting a 2D context.

```html
<html>  
 <head></head>  
 <body>  
   <canvas id="canvas" width="300" height="300"></canvas>  
 </body>  
</html> 
```

```javascript
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d"); 
```

### Drawing a rectangle
Now that there is a canvas context available the next action is to actually draw to the context.  Each pixel within a canvas element can be represented by an rgba value.  As a refresher rgba is red, green, blue, and alpha where each value is an integer between 0 and 255. Although pixels can be manipulated individually, the canvas context has a few built in helpers for drawing simple shapes.  In the example below the style is set to an rgba value using the fillStyle() method. Once the color is set, the fillRect() method is used to create a simple rectangle.  The fillRect() method requires x, y, width, and height parameters to be passed in.

```javascript
ctx.fillStyle = "rgba( 0, 0, 200, 0.5 )";
ctx.fillRect ( 30, 30, 55, 50 );
```

### Drawing Images
Images can also be drawn to a canvas context using the drawImage() method or createPattern() method if you want the image to repeat.  The drawImage() method has three different variations that can be used.  In the code below drawImage() is getting passed an image, x, y, width, and height parameters.  Later on we will see how a different variations of drawImage() can be used to create sprite sheet animations.

```javascript
var image = new Image();
image.onload = function() {
  ctx.drawImage( image, 0, 0, size, size );
};
image.src = "img/colorwheel.png";
```

### Clearing Canvas
As described above, a canvas context will continue drawing until it is cleared, even possibly re-drawing over sections.  To clear a canvas the clearRect() method is available.  The clearRect() method can be used to clear the whole canvas or just portions of it.  In the example below we are starting at (0,0) and clearing the entire width and height of the canvas.

```javascript
ctx.clearRect(0,0,canvas.width,canvas.height);
```

### Getting pixel data
Drawing images to the canvas is great, but the power of canvas is the ability to get pixel level data.  The method getImageData() makes this a possibility.  In the example below the context is getting image data from the top left corner (0,0) and is setting a width and height of 1 pixel.  This will return an image data object with a height, width, and data property for the requested pixels.

```javascript
var imgData = ctx.getImageData( 0, 0, 1, 1 );

// imgData.data contains a CanvasPixelArray
// [r,g,b,a] where each value is 0..255
```

### Canvas Resources
The canvas element has entire books dedicated to covering it in complete detail. There are a bunch of features to canvas that are not covered here.  The list includes drawing text, gradients, complex shapes, paths, transforms, etc.  For more information on canvas check out this [CanvasDeepDive](http://projects.joshy.org/presentations/HTML/CanvasDeepDive/presentation.html) presentation which covers canvas in pretty good detail.

### <a name="thebasics-assets">Choosing Assets</a>
When developing a game, choosing assets can become very important.  These choices not only affect performance, but they can also influence how long it will take to develop a game.  For example, if you choose to make a canvas based game it might make sense to create the menu screens using DOM elements instead of trying to layout and draw each item onto a canvas.  

### <a name="thebasics-img">Images</a>
Images play an important role in any game.  Images convey a level of detail that could not be achieved easily using CSS, SVG, or canvas rendering.  As we will see later, for many types of animation, sequenced images or “sprite sheets” are used quite frequently.  So when should an image be used?  There are no hard and fast rules, but whenever there is a lot of detail or a complicated animation sequence, images tend to be the best option.

<a href="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch01-assets-images/" target="_blank"><img src="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch01-assets-images/bird.png"></a><br>
Example: Crazy detail, crazy animation.

### <a name="thebasics-css">CSS</a>
With the emergence of CSS3 game developers have quite a few more options when styling and producing game elements.  Transforms and transitions can position and animation your content, while @font-face can give your game snappy new typography.  Using only CSS it is easily possible to create a simple menu screen like Fig 2.

![center](http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch01-assets-css/game-menu.png)

Fig 2

This may look like a very simple menu interface.  However, since no images are being used, there are quite a few CSS techniques going on that are worth noting.

#### @font-face
The first feature to point out is the header.  It has been styled with a custom type face.  Although not a CSS3 feature, @font-face finally allows a cross-browser way to embed typography within our open games.  In the example below, we are using a font from [font squirrel](http://www.fontsquirrel.com) called "Chunk Five" for all of the header tags.  Note: some @font-face kits are starting to leave out the svg option.  Be sure to add it if you are targeting iOS 4.1 and lower as they can only render @font-face with svg.  Newer versions of iOS have support for the truetype format.

```css
@font-face {
    font-family: 'ChunkFiveRegular';
    src:
      url('Chunkfive-webfont.eot?#') format('eot'),  /* IE6–8 */ 
      url('type/Chunkfive-webfont.ttf') format('truetype'), /* Saf3—5, Chrome4+, FF3.5, Opera 10+ */
      url('Chunkfive-webfont.woff') format('woff'),  /* FF3.6+, IE9, Chrome6+, Saf5.1+*/
      url('type/Chunkfive-webfont.svg#ChunkFiveRegular') format('svg');
       
    font-weight: normal;
    font-style: normal;
}

h1, h2, h3, h4 {
  font-family: 'ChunkFiveRegular';
}
```

#### CSS Gradients
Next up on our simple menu screen is the background.  The background was created with a simple CSS radial gradient.  No longer do you have to export gradient image slices from Photoshop to create simple backgrounds.

```css
body {
  background: -moz-radial-gradient(center, ellipse cover,  rgba(85,90,95,1) 0%, rgba(28,30,32,1) 100%);
  background: -webkit-gradient(radial, center center, 0px, center center, 100%, color-stop(0%,rgba(85,90,95,1)), color-stop(100%,rgba(28,30,32,1)));
  background: -webkit-radial-gradient(center, ellipse cover,  rgba(85,90,95,1) 0%,rgba(28,30,32,1) 100%);
  background: -o-radial-gradient(center, ellipse cover,  rgba(85,90,95,1) 0%,rgba(28,30,32,1) 100%);
  background: -ms-radial-gradient(center, ellipse cover,  rgba(85,90,95,1) 0%,rgba(28,30,32,1) 100%);
  background: radial-gradient(center, ellipse cover,  rgba(85,90,95,1) 0%,rgba(28,30,32,1) 100%);
}
```

#### CSS Shadows
Our buttons were also created and styled entirely in CSS.  The buttons have a subtle blue linear gradient applied and an ever so slight shadow.  Below is an example of the shadow.

```css
.button {
  
  font-family: 'OpenSans ExtraBold';
  
  background-image: -moz-linear-gradient(top, #6dccf4, #0071a0);
  background-image: -o-linear-gradient(top, #6dccf4, #0071a0);
  background-image: -webkit-gradient(linear,left top,left bottom,color-stop(0, #6dccf4),color-stop(1, #0071a0));
  
  box-shadow: 0px 0px 2px #000;
  -moz-box-shadow: 0px 0px 2px #000;
  -webkit-box-shadow: 0px 0px 2px #000;
  -o-box-shadow: 0px 0px 2px #000;
}
```

#### Preprocessors
Looking at the different CSS code above, the first thing one might notice is that there is quite a bit of repetitiveness for each vendor prefix.   If you are using CSS to style your menu or other game screens, do yourself a favor and use a CSS preprocessor.    There are many excellent preprocessors out there including [SASS]( http://sass-lang.com/), [LESS]( http://lesscss.org/), [Stylus]( http://learnboost.github.com/stylus/), etc.  A preprocessor will easily cut down game development time and will allow your game to become more maintainable as it becomes more complicated. 

### <a name="thebasics-svg">SVG</a>
SVG (Scalable Vector Graphics) is a vector format that allows for scalable graphics that can be resolution independent.  By being resolution independent, SVG will look crisp, even on new retina displays. SVG is expressed in an XML style markup.  The main advantage to using SVG is the ability to scale to any size and not lose quality.  SVG seems like a great solution for scaleable graphics, however one thing to note is that support is lacking in older versions of IE (only 9+, polyfill available) and Android (only 3+).  Android seems to be the biggest dealbreaker since there is no polyfill and only 9% of Android phones are on version 3+.

### <a name="thebasics-icon-fonts">Icon Fonts</a>
SVG is great, but due to some of those browser compatibility issues a new technique has taken favor for some situations.  This technique is creating fonts that use icons instead of characters.  Think about the old wingdings font and you may have some ideas of how this works.  The nice thing is that icon fonts have the same scalable benefits as SVG, and when added with @font-face they have great browser support.  Check out [icomoon](http://keyamoon.com/icomoon/) where you can even upload an SVG file and create your own icon font.

<img src="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch01-assets-icon-fonts/icon-font.png"><br>
Icon font with different icons mapped to unicode values

## <a name="concepts">Game Concepts</a>
### <a name="concepts-gameloop">Game Loop</a>
The central component of most games revolves around a game loop.  A game loop can be thought of as the main hub that controls actions within a game.  Upon each tick of the loop, the game may be asked to perform multiple tasks.  These tasks can range from updating and drawing new character positions on the screen to performing collision detection between objects.  

#### <a name="concepts-raf">Request Animation Frame (rAF)</a>
In order to create a game loop using JavaScript we can use an API (requestAnimationFrame) to inform the browser that we would like to do some animation.  Just like the method name says, we are going to request an animation frame, which the browser will try to sync up to our monitor refresh rate of 60FPS.  After the browser gives us the animation frame it will call the provided callback function.  From this function we can request another frame, thus creating a game loop.  In the example below, there is a cross browser shim for rAF, plus an animate() function that will serve as the game loop.  Notice that within the animate function is a requestAnimationFrame call and that animate itself is passed in as the callback.  This creates our game loop.  The game loop will then check any collisions within the game, and finally it will render out the new positions of the game elements.

```javascript

// Request Animation Frame Shim.  Will setup multiple prefixes, plus
// fallback support for browsers that do not support rAF.
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// End Shim


// Fire off our game loop
function animate() {
  requestAnimationFrame( animate );
  
  checkCollisions();
  render();
}

```

#### <a name="concepts-caf">Cancel Animation Frame</a>
Now that we know how to start a game loop, we should figure out how to stop it.  You probably will need to turn the game loop on and off for many different reasons.  For example, when a user quits gameplay and wants to move back to the menu screen it doesn't really make sense to keep a game loop running.  That would just be a waste of cpu cycles and possibly battery life.  To cancel a request for an animation frame we can use the cancelAnimationFrame method.  The cancelAnimationFrame() method requires the frame id we want to cancel to be passed in.  We can easily modify the animate function from the previous example to store the current frame id.  Now that we have the id it is as simple as passing it to cancelAnimationFrame().

 ```javascript

var frameId;

// Fire off our game loop
function animate() {
  frameId = requestAnimationFrame( animate );
  
  checkCollisions();
  render();
}

// Cancel our game loop
function cancel() {
  cancelAnimationFrame( frameId );
}

 ```


## <a name="concepts-scale">Scale</a>
Coming soon.

## <a name="concepts-animation">Animation</a>
At the heart of any great game is animation.  Good animation can provide game functionality, polish, and style.  When building an HTML5 game there are many different ways to animate elements.  Often times multiple techniques are employed for different game scenarios.  In this section we will take a look at a few of these techniques and analyze the possible use cases for each.

### <a name="concepts-animation-dom">DOM Animation</a>

#### <a name="concepts-animation-transitions">CSS3 Transitions</a>
Introduced with CSS3, transitions allow for a transition animation between styles and classes.  Without any JavaScript, the browser will interpolate an animation based on the beginning style and ending style information.  In the example below, the #bee-transition class contains our base style information, along with our transition.  In our transition rule we are telling the browser to animate "all" CSS properties from the base state to a new state, do it in 1 second, and apply an ease-out.  When the bee is hovered over the new style information will be set, which will trigger the transition animation.

<a href="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch02-animation-transitions/" target="_blank"><img src="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch02-animation-transitions/img/bee-animation.png"></a><br>
Example: CSS Transition

```css
.bee-transition {
  -webkit-transition: all 1s ease-out;  /* Saf3.2+, Chrome */
     -moz-transition: all 1s ease-out;  /* FF4+ */
      -ms-transition: all 1s ease-out;  /* IE10 */
       -o-transition: all 1s ease-out;  /* Opera 10.5+ */
          transition: all 1s ease-out;

  -webkit-transform: rotate(0deg) scale(1.0);  /* Saf3.1+, Chrome */
     -moz-transform: rotate(0deg) scale(1.0);  /* FF3.5+ */
      -ms-transform: rotate(0deg) scale(1.0);  /* IE9 */
       -o-transform: rotate(0deg) scale(1.0);  /* Opera 10.5 */
          transform: rotate(0deg) scale(1.0);
}

.bee-transition:hover {
  -webkit-transform: rotate(180deg) scale(1.7);  /* Saf3.1+, Chrome */
     -moz-transform: rotate(180deg) scale(1.7);  /* FF3.5+ */
      -ms-transform: rotate(180deg) scale(1.7);  /* IE9 */
       -o-transform: rotate(180deg) scale(1.7);  /* Opera 10.5 */
          transform: rotate(180deg) scale(1.7);
}
```

The main thing to note about this technique is that we don't really have much control over the animation.  The transitioned style is set, and the browser takes care of the rest.  There is no progress information that is sent along with the transition.  Clearly, for more involved animations this technique is not going to work.  However, for simple animations that do not require progress information, transitions can be helpful.  We are talking about those fire and forget animations. For example, sliding a menu in, updating a score, or flashing a game notification, such as "+100" might be good use cases for transitions.

#### <a name="concepts-animation-loop">Using the game loop</a>
Sometimes our animation needs a bit more control and needs to be managed frame by frame.  This scenario is a perfect use of the game loop technique described previously.

<a href="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch02-animation-loop/" target="_blank"><img src="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch02-animation-loop/img/game-loop.png"></a><br>
Example: Our bee following a parabolic path.

Let's take a look at how we can create our parabolic example.

```html
<div id="bee"></div>
```

``` css
#bee {
  margin: 0 auto;
  width: 75px;
  height: 75px;
  background: url(../img/bee.png);
}
```

```javascript
(function() {
  
  // Initial variables
  var bee = document.getElementById('bee'),
    width = 300,
    hRatio = Math.floor( window.innerHeight / width ),
    x = 0,
    y = 0,
    step = 2,
    rot = 0;

  // Our Game Loop!
  function animate() {
    requestAnimationFrame( animate );
    render();
  }

  function render() {
    var pct = x / width;

    // Check the bounds for width
    // If met change directions.
    if ( x > width || x < -width ) {
      step *= -1;
    }

    // Step
    x += step;
    y = Math.floor( hRatio * x * Math.sin( pct ) ) + 140;

    // Set our translation and rotation.
    bee.style[vendor+'Transform'] = 'translate3d(' + x + 'px, ' + y + 'px, 0) rotate(' + 1.2 * x + 'deg)';
  }

  // Auto start our game
  animate();
})();
```

You can find the entire code under ch02-animation-loop within the examples folder.  In this example we are going to move our bee from width to -width (which happens to be set to 300) and will step by 2px each frame.  To obtain a y value we are playing around with passing a ratio to a Math.sin function.  A lot of animation is trial and error to get the correct motion you want.  Don't be afraid to experiment!  Finally, we are setting the translate3d and rotate transform properties to move our bee.  Try not to analyze the code in too much detail. Instead try to understand the concept of how a game loop can be used to create animations.  We will expand upon this concept in later examples.

### <a name="concepts-animation-canvas">Canvas Animation</a>
The previous example is looking good, however DOM animation has some limitations.  The main limitation is the amount of objects that can be animated at one time.  Unfortunatly interacting with the DOM is a slow process and it only becomes magnified with more interaction.  Compare that with canvas, which is built to paint objects directly to the context without all the baggage that DOM brings.  This is especially beneficial when canvas is being hardware accelerated.  Let's see if we can rewrite the previous example with canvas.

<a href="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch02-animation-canvas/" target="_blank"><img src="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch02-animation-canvas/img/game-loop.png"></a><br>
Example: Many busy bees on canvas.

Our new example illustrates the benefits of canvas nicely.  Since canvas doesn't have to worry about the properties of each bee we can draw many of them at a time and still have good performance.  As a bonus, the technique to animating with canvas isn't all that different from DOM.  The code is a bit longer so we will have to break it down a bit.  Don't worry, all the code for the examples is on this GitHub repo.

First we are going to load the bee image.  When the bee image is done loading and before we start the game loop we are going to create some bees.

```javascript
var bee = new Image();

// Auto start our game loop after bee image is loaded.
bee.onload = function() {
  createBees();
  animate();
};
bee.src = "img/bee.png";
```
Next, let's take a look at the createBees() function.  Inside of createBees() we are going to loop 15 times and push some initial parameters for each bee onto a bees array for later.

```javascript
var bees = [];

function createBees() {

  // Create 15 bees.
  for(var i = 0; i < 15; i++) {
    bees.push({
      x: (i * 55) + 150, // Spread out 30px and translate 250px.
      y: 0,
      dy: 0
    });
  }

}
```

Finally, as with DOM we have our animate loop and render function.  Now render looks kind of scary!  Don't worry it is actually not that bad.  We start by calling clearRect() on the canvas.  If you recall from before this will clear any previous drawing.  Next, we loop over the bees that are in the bees array.  We set a magical y position for each, (again, the product of some playing around) and figure out the delta from our previous y position.  

Now it is time to draw.  First we save the current drawing state by calling context.save().  Then we set our translate, rotate, and scale on the context.  Lastly, we draw the bee image to the context and restore it back to the original drawing state for the next iteration of the loop.

Tip: You may notice that the bees are rotating in the direction of their movement.  This is because we are computing the angular rotation based on the x and y velocity.  In case you are not up to date on your Physics courses, we can use the Math.atan2() function to easily compute the rotational value.

```javascript
// Our Game Loop!
function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  var pct = x / width, dy;

  // Check the bounds for width
  // If met change directions.
  if ( x > width || x < -width ) {
    dx *= -1;
    scale *= -1;
  }

  // Step
  x += dx;
  
  // Clear the canvas
  context.clearRect( 0, 0, canvas.width, canvas.height );

  // Loop over bees!
  for( var i in bees ) {
    
    // Stagger y positions and translate down 300px
    y = ( x * Math.sin( (1.5 - Math.abs(pct) ) * i * 0.7 ) ) + 300;

    dy = y - bees[i].y;
    bees[i].dy = dy;
    bees[i].y = y;

    // Save context
    context.save();

    // Translate, rotate, and scale each bee
    context.translate( x + bees[i].x, y ); // Add an offset to each x to stagger bees
    context.rotate( Math.atan2( dy, dx ) + 1.57 ); // convert angular rotation to radians
    context.scale( scale, 1 ); // Scale trick to flip bee around

    // Draw to bee to canvas
    context.drawImage(bee, -(bee.width/2), -(bee.height/2) );

    // Restore the context for the next bee
    context.restore();
  }
}
```

### <a name="concepts-animation-sprite-sheets">Sprite Sheets</a>
In order to describe the concept of sprite sheets we can get some help from an old plumber friend. Below is a simple sprite sheet hilighting a few of the actions our plumber can make.

<img src="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch02-animation-sprite-sheets-dom/img/plumber-sprite-diag.png">

In the next few sections we will explore how to isolate each action and how to render them out to either DOM or canvas.

#### <a name="concepts-animation-sprite-sheets-dom">DOM</a>
To get started we will look at a simple example.  Let's just move the sprite sheet so that our plumber is standing and facing to the right.  In order to do that we will use the css background-position property.  By setting a fixed width and height and moving the background position we can create the illusion of animation.  It helps to think of of this technique like a flipbook.

```html
<div class="plumber stand-right"></div>
```
Our plumber markup

```css
.plumber {
  width: 40px;
  height: 40px;
  background: url(../img/plumber-sheet.png);
}

.stand-right {
  /* Note - background-position: x y; */
  background-position: -240px 0;
}

.stand-left {
  background-position: -80px 0;
}
```

In our example we have defined a div with a class of plumber and stand-right.  The plumber class will load in our sprite sheet as the background image and set the width and height to 40px.  Then stand-right class is applied.  This class will move the background position of the sprite sheet -240px (to the left).  Our plumber should now be facing to the right.  To face the plumber left, all we would need to do is replace the stand-right class with stand-left in our markup.

<img src="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch02-animation-sprite-sheets-dom/img/plumber-sheet-standing.png">

##### Animating
Adding and removing classes is ok for static actions, however when there are many actions that need to animated over time or based on user input a better option is needed.  In order to get more control of our sprite sheet animations we will use JavaScript.

<a href="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch02-animation-sprite-sheets-dom/" target="_blank"><img src="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch02-animation-sprite-sheets-dom/img/plumber-sheet-actions.png"></a><br>
Example: Extracting multiple actions from our sprite sheet

This will be our most complicated example to date so once again we will need to review it one section at a time.  The entire source can be located in the ch02-animation-sprite-sheets-dom folder.

The first thing we will need to do is change our game loop logic.  Instead of having all the logic in our game loop we will use an event based system.  This way the game loop can publish an event each tick and then indivdual subscribers can listen and update themself accordingly. This is a popular technique referred to as Pub/Sub. Pub/Sub will also help to decouple the game components which will aid in testing as well as maintainablilty.  To trigger and bind to these events we will use Zepto.js.  jQuery could easily be used as well.

```javascript 
var FRAME_EVENT = 'raf:frame:tick',
    doc = $(document);

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  doc.trigger( FRAME_EVENT );
}

```
Decoupled rAF loop.

Notice all we are doing in the render function is triggering a 'raf:frame:tick' event on the document.  This helps us to keep all other logic out of our game loop.

Next up we are going to setup an animationList object to describe the different animations we want to perform.  Each object within animationList has a key (which is the name) and  a few other properties.  The obj property refers to the particular DOM element we want to animate, duration is how long in milliseconds we want the animation to last, and size refers to the size of our sprite.  In our example we are setting size to 40 since that is the width and height of our plumber.  The positions array property describes the start and ending positions of the animation in relation to our sprite sheet.  The positions are expressed in "blocks".  That way if the size property changes we won't have to change our position data.  For example, 'run_right' has a starting position of 6 blocks and an ending position of 9 blocks.  Later on we will use the size and the position data to figure out our animation sequence.  Think of this object as the metadata that describes how to animate each action.

```javascript
// Base animations as abstract blocks of 40px
// Example: Walk right is from 6 blocks to 9 blocks.
// Sample: positions: [x_start, x_end]
var animationList = {
  run_right: {
    obj: rightRunner,
    positions: [6,9],
    duration: 325,
    size: 40
  },
  run_left: {
    obj: leftRunner,
    positions: [2,5],
    duration: 200,
    size: 40
  }
};
```

Now we need to define a way to convert our animation metadata into actions.  We will do this using a method called setupAnimations().  This method will loop through our animationList object and will create new Animator() instances and then will push them onto an array.  Lastly, it will start each animation.

```javascript
function setupAnimations() {

  var key, animation, animationItem;

  for (key in animationList) {
    animationItem = animationList[key];
    animation = new Animator( key, animationItem );
    animations.push( animation );
    animation.start();
  }
}
```

The final function we will look at is our Animator() constructor function.  This is where all the magic happens.  This function may look intimidating, however we can break it down to make it more manageable.  The first couple lines are just translating our passed in animation metadata into local variables to work with.  The only exception being the interval variable.  This variable is the calculated interval at which we should switch to a new frame in our animation, based on the total number of frames and the duration.  Think of the interval as frames per millisecond.  Now that we know the interval, once the start method is called, we can start listening for our game loop tick events.  Upon each tick, we will call a step() function to update the animation.  If we have passed our interval threshold, we will update the background position.  Otherwise, we will store the values and wait for the next tick.  If the animation has reached the end frame it will then wrap back to the starting frame to create a continous loop.

```javascript
var Animator = function( key, item ) {

  // Set x positions.
  var startX, current, endX, interval, prevTick, totalElapsed, size, obj;

  obj = item.obj[0];
  size = item.size;
  
  startX = current = item.positions[0];
  endX = item.positions[1];

  interval = Math.floor( item.duration / (endX - startX) );
  
  this.start = function() {
    
    prevTick = Date.now();
    totalElapsed = 0;

    doc.on( FRAME_EVENT, this.step, this );
  };

  this.step = function() {
    
    var tick = Date.now(),
      elapsed = tick - prevTick;

    totalElapsed += elapsed;
      
    if ( totalElapsed > interval ) {
      // Interval is up, change sprite.
      current++;

      // Are we at the end frame? If so wrap back to the first frame
      if ( current > endX ) {
        current = startX;
      }

      obj.style.backgroundPosition = '-' + current * size + 'px 0';
      totalElapsed = 0;
    }

    prevTick = tick;
  };
};
```

Note, this is a very simplistic view of how one could add sprite sheet animations to a game loop.  Normally our Animator() function would have many more methods and would be one component added to a larger core game engine that would be processing and publishing game loop events.

#### <a name="concepts-animation-sprite-sheets-canvas">Canvas</a>
Now that we have successfully animated DOM sprite sheets, let's see if we can easily translate this to canvas.