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

	// Initial variables
	var canvas = document.getElementById('plumber-canvas'),
		context = canvas.getContext('2d'),
		plumber = new SpriteImage('img/plumber.png'),
		enemy = new SpriteImage('img/enemy.png'),
		brick = new SpriteImage('img/brick.png');
		sprites = [plumber, enemy, brick],
		doc = $(document),
		keydown = false,
		SPEED = 2,
		numLoaded = 0,
		imagesToLoad = sprites.length,
		tickSpeed = 0,
		floorY = 0;

	// Arrow keycodes
	var keys = {
		'LEFT_ARROW': 37,
		'UP_ARROW': 38,
		'RIGHT_ARROW': 39,
		'DOWN_ARROW': 40
	};

	// Base animations as abstract blocks of 40px
	// Example: Walk right is from 6 blocks to 9 blocks.
	// Sample: animation_name: [x_start, x_end]
	var animationList = {
		run_right: {
			positions: [6,9],
			duration: 325,
			size: 40
		},
		run_left: {
			positions: [2,5],
			duration: 325,
			size: 40
		},
		stand_left: {
			positions: [2,2],
			size: 40
		},
		stand_right: {
			positions: [6,6],
			size: 40
		},
		jump_left: {
			positions: [11,11],
			size: 40
		},
		jump_right: {
			positions: [0,0],
			size: 40
		},
		enemy_walk: {
			positions: [0,1],
			duration: 325,
			size: 40
		}
	};

	function init() {
		setupListeners();
		setupWorld();
		animate();
	}

	function animate() {
		requestAnimationFrame( animate );
		render();
	}

	function render() {
		$.publish( 'raf:frame:tick' );
		updateWorld();
		draw();
	}

	function setupListeners() {
		doc.on( 'keydown', keyboard);
		doc.on( 'keyup', keyboard);
	}

	function setupWorld() {

		// Floor level
		floorY = canvas.height - brick.img.height * 2;

		// Plumber
		plumber.x = 0;
		plumber.animate( animationList.stand_right );

		// Enemy
		enemy.animate( animationList.enemy_walk );

	}

	function updateWorld() {
		
		if ( keydown ) {

			if ( keydown === keys.LEFT_ARROW ) {
				plumber.x -= SPEED;
				
			} else {
				plumber.x += SPEED;
			}
		}
	}

	function draw() {
		// Frame speed
		var frame = Math.sin( tickSpeed );

		// Clear canvas
		context.clearRect( 0, 0, canvas.width, canvas.height );

		// Floor
		context.fillStyle = context.createPattern( brick.img, 'repeat' );
		context.fillRect( 0, floorY, canvas.width, brick.img.height * 2 );

		// Plumber
		context.drawImage(
			plumber.img,  // the image of the sprite sheet
			plumber.data.size * plumber.data.current,0,39,39,  // source coordinates      (x,y,w,h)
			plumber.x, floorY - plumber.data.size,39,39  // destination coordinates (x,y,w,h)
		);

		// Enemy
		context.drawImage(
			enemy.img,  // the image of the sprite sheet
			enemy.data.size * enemy.data.current,0,39,39,  // source coordinates      (x,y,w,h)
			500+(frame*50), floorY - enemy.data.size, 39,39  // destination coordinates (x,y,w,h)
		);

		tickSpeed += 0.015;
	}

	function keyboard( e ) {
		
		e.key = e.keyCode || e.which;
		
		if (e.type === "keydown") {
			if( !keydown ) {
				if ( e.key === keys.LEFT_ARROW ) {
					// We are going left!
					plumber.animate( animationList.run_left );
					keydown = keys.LEFT_ARROW;
				} else if ( e.key === keys.RIGHT_ARROW ) {
					// We are going right!
					plumber.animate( animationList.run_right );
					keydown = keys.RIGHT_ARROW;
				}
			}
		} else if (e.type === "keyup") {
			if ( e.key === keys.LEFT_ARROW || e.key === keys.RIGHT_ARROW ) {
				plumber.stop();
				keydown = false;
			}
		}
	}

	// Pre-load images
	for(var i=0, len=sprites.length; i < len; i++) {
		sprites[i].img.onload = imgLoaded;
		sprites[i].img.src = sprites[i].src;
	}

	function imgLoaded() {
		numLoaded++;

		// Once images are loaded init the game
		if ( numLoaded === imagesToLoad) {
			init();
		}
	}

})( Zepto );