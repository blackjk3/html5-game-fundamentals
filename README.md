#HTML5 Game Fundamentals

A creative-commons book on building games with HTML5, JavaScript, and CSS.

## Table Of Contents

* [Introduction](#introduction)
* [The Basics](#thebasics)
	* [DOM](#thebasics-dom)
	* [Canvas](#thebasics-canvas)
	* [Choosing Assets](#thebasics-assets)
	* [Game Loop](#thebasics-gameloop)
		* requestAnimationFrame
		* cancelAnimationFrame
	* [Grid System](#thebasics-grid)
* [Animation](#animation)	
    * [DOM Animation](#animation-dom)
	* [Canvas Animation](#animation-canvas)
		* Blitting
	* [Sprite Sheets](#animation-sprite-sheets)
		* DOM
		* Canvas
* [WebGL](#webgl)	
* [PhoneGap](#phonegap)
* [Automation](#automation)
* [Debugging](#debugging)
* [Multiplayer](#multiplayer)

<a name="introduction">Introduction</a>
---
Games have always been a part of society, capturing ideas and behaviors of people and becoming an extension of their imagination and creativity.  Dice games, tile games, and card games all date back to ancient times, with dice games dating as far back as 3000 years.  Today's games still spark those same human interactions.  Although the same principles apply to today's games, the medium has changed dramatically. Now days there many options when creating a game. Almost all older games have an online counterpart and due to the popularity of app stores, games have become even easier to market and distribute.  The question then arises, what technology should I use to build my game?

Web games until very recently were almost exclusively built on platforms using browser plugins.  Adobe Flash was king with other plugins like Unity filling out the market. With almost unbelievable performance updates to JavaScript engines, the emergence of bitmap drawing via canvas, and powerful new CSS3 features, the dream of building an entire game without plugins is becoming a reality.  Building a game exclusively using web technologies presents a set of challenges, however, the landscape is changing at an alarming pace.  New specs and API's seem to be coming out on a daily basis, and browser vendors are aggressively implementing these new features.  It is an exciting time to be a creative JavaScript developer!

The aim of this book is to highlight some common gaming practices and how those practices can relate when building a game with HTML5, JavaScript, and CSS.

## <a name="thebasics">The Basics</a>
---
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

## Choosing Assets
Coming Soon