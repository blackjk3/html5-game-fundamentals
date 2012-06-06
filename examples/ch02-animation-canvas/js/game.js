// Store the vendor prefix.
var vendor;

// Request Animation Frame Shim.  Will setup multiple prefixes, plus
// fallback support for browsers that do not support rAF.
(function() {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
		window.cancelAnimationFrame =
		  window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];

		// Check which browser we are on and save the prefix.
		if ( window[vendors[x]+'RequestAnimationFrame'] ) {
			vendor = vendors[x];
		}
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
// END rAF shim

(function() {
	
	// Initial variables
	var canvas = document.getElementById('bee-canvas'),
		context = canvas.getContext('2d'),
		width = 800,
		hRatio = Math.floor( window.innerHeight / width ),
		x = 0,
		y = 0,
		dx = 3,
		scale = 1,
		rot = 0,
		bee = new Image(),
		bees = [],
		tick = 0;

	// Our Game Loop!
	function animate() {
		requestAnimationFrame( animate );
		render();
	}

	function createBees() {
		
		for(var i = 0; i < 15; i++) {
			
			bees.push({
				x: (i * 55) + 150, // Spread out 30px and translate 250px.
				y: 0,
				dy: 0
			});
		}
	}

	function render() {
		var pct = x / width,
			dy;

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
			context.translate( x + bees[i].x, y );
			context.rotate( Math.atan2( dy, dx ) + 1.57 ); // convert to radians
			context.scale( scale, 1 ); // Scale trick to flip bee around

			// Draw to bee to canvas
			context.drawImage(bee, -(bee.width/2), -(bee.height/2) );

			// Restore the context for the next bee
			context.restore();
		}
	}

	// Auto start our game loop after bee image is loaded.
	bee.onload = function() {
		createBees();
		animate();
	};
	bee.src = "img/bee.png";
})();