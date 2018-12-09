function wave_1( background, canvas_id, max_height, wave_compression ){
	var WIDTH = $( window ).width();
	var height = 100;
	var background = background;

	function sketchProc(processing) {  
	  processing.draw = function () {
	    processing.background(0, 0, 0 ,0);
	    var now = + new Date;
	    var dt = now - lastUpdate;
	    lastUpdate = now;
	    update(dt);
	    draw();
	  };
	  processing.setup = function () {
	     processing.size(WIDTH, height);
	     processing.frameRate(60);
	  };
	}
	var canvas = document.getElementById( canvas_id );
	// attaching the sketchProc function to the canvas
	var lastUpdate =+ new Date;
	var pjs = new Processing(canvas, sketchProc);

	// Resolution of simulation
	var NUM_POINTS = 200;
	// Width of simulation
	var Y_OFFSET = 55;
	var ITERATIONS = 12;
	// Make points to go on the wave
	function makeWavePoints(numPoints) {
	    var t = [];
	    for (var n = 0; n < numPoints + 3; n++) {
	        // This represents a point on the wave
	        var newPoint = {
	            x: n / numPoints * WIDTH,
	            y: Y_OFFSET,
	        }
	        t.push(newPoint);
	    }
	    return t
	}

	// A phase difference to apply to each sine
	var offset = 0;

	var NUM_BACKGROUND_WAVES = 7;
	var BACKGROUND_WAVE_MAX_HEIGHT = max_height;
	var BACKGROUND_WAVE_COMPRESSION = wave_compression;
	// Amounts by which a particular sine is offset
	var sineOffsets = [];
	// Amounts by which a particular sine is amplified
	var sineAmplitudes = [];
	// Amounts by which a particular sine is stretched
	var sineStretches = [];
	// Amounts by which a particular sine's offset is multiplied
	var offsetStretches = [];
	// Set each sine's values to a reasonable random value
	for (var i = -0; i < NUM_BACKGROUND_WAVES; i++) {
	    var sineOffset = -Math.PI + 2 * Math.PI * Math.random();
	    sineOffsets.push(sineOffset);
	    var sineAmplitude = Math.random() * BACKGROUND_WAVE_MAX_HEIGHT;
	    sineAmplitudes.push(sineAmplitude);
	    var sineStretch = Math.random() * BACKGROUND_WAVE_COMPRESSION;
	    sineStretches.push(sineStretch)
	    var offsetStretch = Math.random() * BACKGROUND_WAVE_COMPRESSION;
	    offsetStretches.push(offsetStretch);
	}

	// This function sums together the sines generated above,
	// given an input value x
	function overlapSines(x) {
	    var result = 0;
	    for (var i = 0;i < NUM_BACKGROUND_WAVES; i++) {
	        result = result
	            + sineOffsets[i]
	            + sineAmplitudes[i] 
	            * Math.sin(x * sineStretches[i] + offset * offsetStretches[i]);
	    }
	    return result;
	}

	var wavePoints = makeWavePoints(NUM_POINTS);

	// Callback when updating
	function update(dt) {
	    offset = offset + 1;
	}

	// Callback for drawing
	function draw() {

		var canvas = document.getElementById( canvas_id );
		var context = canvas.getContext('2d');

		var firstPoint = wavePoints[0];
		var lastPoint = wavePoints[wavePoints.length - 1];


		context.beginPath();
		context.moveTo(firstPoint.x, firstPoint.y + overlapSines(firstPoint.x));
		for (var n = 0; n < wavePoints.length;n++) {
	   		var p = wavePoints[n];
		   if (n > 0) {
				var leftPoint = wavePoints[n-1];
				context.lineTo(p.x, p.y + overlapSines(p.x));
		   }
	    }

	  	var canvasHeight = $( "#" + canvas_id ).height();
	  	context.lineTo(lastPoint.x, canvasHeight);
	  	context.lineTo(0, canvasHeight);
	  	context.lineTo(0, firstPoint.y + overlapSines(firstPoint.x));

		context.closePath();

		context.lineWidth = 0;
		context.strokeStyle = background;
		context.fillStyle = background;
	    context.fill();
	    context.stroke();
	}
}

wave_1( '#2A5DFF', 'wave_1', 10, 1/22 );
wave_1( '#339DFF', 'wave_2', 10, 1/20 );