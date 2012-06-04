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
* [Game Concepts](#concepts)	
	* [Game Loop](#concepts-gameloop)
		* [requestAnimationFrame](#concepts-raf)
		* [cancelAnimationFrame](#concepts-caf)
	* [Scale](#concepts-scale)
		* [CSS](#scale-css)
			* [Em's](#scale-ems)
			* [Percentages](#scale-percentages)
		* [Grid System](#scale-grid)
	* [Animation](#concepts-animation)	
	    * [DOM Animation](#concepts-animation-dom)
	    	* CSS Transitions
	    	* CSS Translations
		* [Canvas Animation](#concepts-animation-canvas)
		* [Sprite Sheets](#concepts-animation-sprite-sheets)
			* Blitting
			* DOM
			* Canvas
* [Saving Data](#saving)
* [WebGL](#webgl)	
* [PhoneGap](#phonegap)
* [Automation](#automation)
* [Debugging](#debugging)
* [Multiplayer](#multiplayer)

## <a name="introduction">Introduction</a>
Games have always been a part of society, capturing ideas and behaviors of people and becoming an extension of their imagination and creativity.  Dice games, tile games, and card games all date back to ancient times, with dice games dating as far back as 3000 years.  Today's games still spark those same human interactions.  Although the same principles apply to today's games, the medium has changed dramatically. Now days there many options when creating a game. Almost all older games have an online counterpart and due to the popularity of app stores, games have become even easier to market and distribute.  The question then arises, what technology should I use to build my game?

Web games until very recently were almost exclusively built on platforms using browser plugins.  Adobe Flash was king with other plugins like Unity filling out the market. With almost unbelievable performance updates to JavaScript engines, the bitmap drawing capabilities of canvas, and powerful new CSS3 features, the dream of building an entire game without plugins is becoming a reality.  Building a game exclusively using web technologies presents a set of challenges, however, the landscape is changing at an alarming pace.  New specs and API's seem to be coming out on a daily basis, and browser vendors are aggressively implementing these new features.  It is an exciting time to be a creative JavaScript developer!

The aim of this book is to highlight some common gaming practices and how those practices can relate when building a game with HTML5, JavaScript, and CSS.

## <a name="thebasics">The Basics</a>
Like any detailed subject, gaming has some basic principles that can be useful when getting started.  HTML5 games in particular have a few different options and depending on what you choose, they have very different possibilities and limitations.

### <a name="thebasics-dom">DOM</a>
The first option we will explore when building an HTML5 game is a DOM based game.  When HTML5 games are mentioned, your first thought, like mine, is most likely centered around building a canvas based game.  Sometimes this is not best option.  Believe it or not DOM based games in some instances can have better performance than canvas.  This is especially true in the mobile space where canvas is most likely not hardware accelerated.

### What is DOM?
The document object model, as described by Wikipedia is a "is a cross-platform and language-independent convention for representing and interacting with objects in HTML, XHTML and XML documents" [1](http://en.wikipedia.org/wiki/Document_Object_Model).  Back in Flash, there was there was a technique called screen invalidation that would mark areas of the screen that needed to be refreshed based on the objects on the stage and how they were moving.  The browser handles this process in a similar way.  Browser layout engines will listen for changes to the DOM and will repaint or reflow the page accordingly.  So what does this mean for writing games?  It means that the browser is going to do the work of repainting the screen for you when objects change.  This can be beneficial for simple games where there are a few number of elements or updates are happening infrequently.  Board, card, and tile games can be good candidates as DOM based games.  Another added benefit of building DOM based games is that there is already large number of developers that are currently building client applications entirely in JavaScript.  These developers already have the skillset required to start building DOM games without having to learn how to manipulate the canvas element.

### <a name="thebasics-canvas">Canvas</a>

Canvas is an HTML element that is bitmap based and can be drawn to using JavaScript.  A simple analogy is to think of a canvas element like an etch-a-sketch.  You can continue drawing to the canvas context, adding detail, until you decide to clear the canvas.  Clearing the canvas is equivalent to shaking an etch-a-sketch clean.  One issue to note, is we will need a separate mechanism to keep track of objects that have been painted to canvas or have been cleared from canvas.  This is because canvas only paints to a context, it does not retain any information or properties on that object, such as width, height, rotation scale, etc.

<center><img src="http://upload.wikimedia.org/wikipedia/commons/b/be/EtchASketch10-23-2004.jpg" width="450" height="350" style="border-radius: 7px; margin: 10px;"></center>

### Canvas Basics
In order to start drawing on a canvas we need access to a canvas context.  There are two separate contexts.  One context is for 2D drawing,  and a second context is an experimental context for 3D and WebGL.  For the basics we will start by adding a canvas element and getting a 2D context.

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

<a href="http://dl.dropbox.com/u/21521496/cf.objective/index.html#/6" target="_blank"><img src="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch01-assets-images/bird.png"></a><br>
Guideline: Crazy detail, crazy animation, use images.

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
Coming soon

## <a name="concepts">Game Concepts</a>
### <a name="concepts-gameloop">Game Loop</a>
The central component of most games revolves around a game loop.  A game loop can be thought of as the main hub that controls actions within a game.  Upon each tick of the loop, the game may be asked to perform multiple tasks.  These tasks can range from updating and drawing new character positions on the screen to performing collision detection between objects.  

#### <a name="concepts-raf">Request Animation Frame (rAF)</a>
In order to create a game loop using JavaScript we can use an API (requestAnimationFrame) to inform the browser that we would like to do some animation.  Just like the method name says, we are going to request an animiation frame, which the browser will try to sync up to our monitor refresh rate of 60FPS.  After the browser gives us the animation frame it will call the provided callback function.  From this function we can request another frame, thus creating a game loop.  In the example below, there is a cross browser shim for rAF, plus an animate() function that will serve as the game loop.  Notice that within the animate function is a requestAnimationFrame call and that animate iself is passed in as the callback.  This creates our game loop.  The game loop will then check any collisions within the game, and finally it will render out the new positions of the game elements.

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
At the heart of any great game is animation.  Good animation can provide game functionallity, polish, and style.  When building an HTML5 game there are many different ways to animate elements.  Often times multiple techniques are employed for different game senerios.  In this section we will take a look at a few of these techniques and analyze the possible use cases for each.

### <a name="concepts-animation-transitions">CSS3 Transitions</a>
Introduced with CSS3, transistions allow for a transition animation between styles and classes.  Without any JavaScript, the browser will interpolate an animation based on the beginning style and ending style information.  In the example below, the #bee-transition class contains our base style information, along with our transition.  In our transition rule we are telling the browser to animate "all" css properties from the base state to a new state, do it in 1 second, and apply an ease-out.  When the bee is hovered over the new style information will be set, which will trigger the transition animation.

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

<a href="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch02-animation-transitions/" target="_blank"><img src="http://client.kadrmasconcepts.com/html5-game-fundamentals/examples/ch02-animation-transitions/img/bee-animation.png"></a><br>

The main thing to note about this technique is that we don't really have much control over the animation.  The transitioned style is set, and the browser takes care of the rest.  There is no progress information that is sent along with the transistion.  Clearly, for more involved animations this technique is not going to work.  However, for simple animations that do not require progress information, transistions can be helpful.  We are talking about those fire and forget animations. For example, sliding a menu in, updating a score, or flashing a game notification, such as "+100" might be good use cases for transitions.