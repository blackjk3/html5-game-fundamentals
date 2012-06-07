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

(function( $ ) {

	// rAF eventing variables
	var FRAME_EVENT = 'raf:frame:tick',
		doc = $(document);

	// Cache selectors.
	var leftRunner = $('.run-left'),
		rightRunner = $('.run-right'),
		animations = [];

	// Base animations as abstract blocks of 40px
	// Example: Walk right is from 6 blocks to 9 blocks.
	// Sample: animation_name: [x_start, x_end]
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

	function init() {
		setupAnimations();
		animate();
	}

	function animate() {
		requestAnimationFrame( animate );
		render();
	}

	function render() {
		doc.trigger( FRAME_EVENT );
	}

	function setupAnimations() {

		var key, animation, animationItem;

		for (key in animationList) {
			animationItem = animationList[key];
			animation = new Animator( key, animationItem );
			animations.push( animation );
			animation.start();
		}
	}

	/**
	 * Animator constructor.
	 */

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

	init();
	

})( Zepto );