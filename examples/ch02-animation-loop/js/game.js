// Request Animation Frame Shim.  Will setup multiple prefixes, plus
// fallback support for browsers that do not support rAF.
var vendor;

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];

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


(function() {
	
	var bee = document.getElementById('bee');
	var width = 300;
	var hRatio = Math.floor(window.innerHeight / width);
	var x = 0, y = 0;
	var step = 2;
	var rot = 0;

	function animate() {
		requestAnimationFrame( animate );

		//checkCollisions();
		render();
		console.log(vendor);
	}

	function render() {
		var pct = x / width;

		if ( x > width || x < -width ) {
			step *= -1;
		}

		x += step;
		y = Math.floor( hRatio * x * Math.sin( pct ) ) + 140;

		bee.style[vendor+'Transform'] = 'translate(' + x + 'px, ' + y + 'px) rotate(' + 1.2 * x + 'deg)';
	}

	animate();
})();