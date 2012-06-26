
var SpriteImage = function( src ) {
	this.src = src;
	this.img = new Image();
	this.x = 0;
	this.y = 0;
	this.data = {};
};

SpriteImage.prototype = {
	
	animate: function( animData ) {

		this.data = {
			size: animData.size,
			startX: animData.positions[0],
			current: animData.positions[0],
			endX: animData.positions[1]
		};

		if ( animData.positions[0] === animData.positions[1] ) {
			// There is no animation sequence, just return.
			return this;
		}

		this.data.interval = Math.floor( animData.duration / ( animData.positions[1] - animData.positions[0] ) );
		
		// Auto-Start up the animation
		this.start();
	},

	start: function() {
		var _self = this,
			data = this.data;

		data.prevTick = Date.now();
		data.totalElapsed = 0;
		data.subHandler = $.subscribe( 'raf:frame:tick', function() {
			_self.step();
		});
	},

	stop: function() {
		var data = this.data;

		if ( data.subHandler ) {
			$.unsubscribe( data.subHandler );
			data.subHandler = null;
		}
	},

	step: function() {
		var tick = Date.now(),
			data = this.data,
			elapsed = tick - data.prevTick;

		data.totalElapsed += elapsed;
			
		if ( data.totalElapsed > data.interval ) {
			// Interval is up, change sprite.
			data.current++;

			// Are we at the end frame? If so wrap back to the first frame
			if ( data.current > data.endX ) {
				data.current = data.startX;
			}

			data.totalElapsed = 0;
		}

		data.prevTick = tick;
	}
};