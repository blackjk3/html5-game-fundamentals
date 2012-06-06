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
	var bee = document.getElementById('bee');
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