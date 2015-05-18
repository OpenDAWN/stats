/**
 * Frequency/time domain diagrams for web-audio.
 * Inpsired by stats.js
 *
 * @module  web-audio-stats
 *
 */

var lg = require('mumath/lg');
var extend = require('xtend/mutable');
var lifecycle = require('lifecycle-events');


module.exports = Stats;


var doc = document, win = window;



/**
 * @constructor
 */
function Stats (audio, audioContext, options) {
	//ensure instance
	if (!(this instanceof Stats)) return new Stats(el, audioContext, options);

	var self = this;

	//init options
	options = options || {};
	extend(self, options);

	//ensure audio element
	if (!(audio instanceof AudioNode)) {
		this.audio = audio instanceof Audio
		? audioContext.createMediaElementSource(audio)
		: audioContext.createMediaStreamSource(audio);
	}
	else {
		this.audio = audio;
	}

	this.audioContext = audioContext;

	//create holder
	this.element = doc.createElement('div');
	this.element.classList.add('wa-stats');

	//create canvas
	this.canvas = doc.createElement('canvas');
	this.canvas.classList.add('wa-stats-canvas');
	this.canvasContext = this.canvas.getContext('2d');
	this.element.appendChild(this.canvas);

	lifecycle(this.element);

	//once canvas is inserted - update it’s calc styles
	on(this.element, 'attached', function () {
		self.update();
	});
	this.update();

	//create analyser node
	this.analyser = audioContext.createAnalyser();
	this.analyser.smoothingTimeConstant = 0.8;
	this.analyser.maxDecibels = this.maxDecibels;
	this.analyser.minDecibels = this.minDecibels;
	this.analyser.fftSize = 8192;
	this.bufferLength = this.analyser.frequencyBinCount;
	this.data = new Uint8Array(this.bufferLength);

	//connect audio to analyser
	this.audio.connect(this.analyser);

	//detect decades
	this.decades = Math.round(lg(this.maxFrequency/this.minFrequency));
	this.decadeOffset = lg(this.minFrequency/10);


	if (this.grid) {
		this.grid = doc.createElement('div');
		this.grid.classList.add('wa-stats-grid');

		//show frequencies
		for (var f = this.minFrequency; f <= this.maxFrequency; f*=10) {
			var line = doc.createElement('span');
			line.classList.add('wa-stats-line');
			line.classList.add('wa-stats-line-h');
			line.setAttribute('data-frequency', f);
			line.style.left = this.map(f, 100) + '%';
			this.grid.appendChild(line);
		}

		//draw magnitude limits
		var mRange = this.maxDecibels - this.minDecibels;
		for (var m = this.minDecibels, i = 0; m <= this.maxDecibels; m += 10, i += 10) {
			var line = doc.createElement('span');
			line.classList.add('wa-stats-line');
			line.classList.add('wa-stats-line-v');
			line.setAttribute('data-magnitude', m);
			line.style.bottom = 100 * i / mRange + '%';
			this.grid.appendChild(line);
		}

		this.element.appendChild(this.grid);
	}

	//render spectrum
	function draw() {
		requestAnimationFrame(draw);
		self.draw[self.mode].call(self);
	}
	draw();
}


var proto = Stats.prototype;


/**
 * Connect analyser to a target.
 */
proto.connect = function (target) {
	this.analyser.connect(target);
};


/**
 * Set mode of rendering
 */
proto.mode = 'frequency';


/** Show labels */
proto.labels = true;


/** Display frequencies grid */
proto.grid = true;


/**
 * Draw iteration
 */
proto.draw = {};


/** Frequency grapher */
proto.draw.frequency = function () {
	var ctx = this.canvasContext,
		canvas = this.canvas,
		w = canvas.width,
		h = canvas.height,
		analyser = this.analyser,
		data = this.data;

	// Get the new frequency data
	analyser.getByteFrequencyData(data);

	//fill bg
	ctx.clearRect(0,0,w,h);

	//fill bars
	ctx.fillStyle = this.color;
	var Fs = this.audioContext.sampleRate;
	var ih, f, x, iw, note, noteF;

	//walk by each pixel
	for (var x = 0, f, i, dl, dr, diff; x<w; x++) {
		f = this.unmap(x, w);
		i = 2 * f * data.length / Fs;
		dl = data[Math.floor(i)];
		dr = data[Math.ceil(i)];

		ih = ((dr*(i%1)  + dl*(1 - i%1)) / 255) * h;
		ctx.fillRect(x, h - ih, 1, ih);
	}

	//walk by frequencies
	// for (var i = 0, l = data.length; i<l; i++) {
	// 	ih = (data[i] / 255) * h;
	// 	f = i * 0.5 * Fs / data.length;
	// 	x = this.map(f, w);

	// 	ctx.fillRect(~~x, h - ih, 1, ih);
	// }
};


/** Frequency limits */
proto.minFrequency = 20;
proto.maxFrequency = 20000;


/** Magnitude limits */
proto.maxDecibels = -30;
proto.minDecibels = -90;


/** Map frequency to an x coord */
proto.map = function (f, w) {
	var decadeW = w / this.decades;
	return decadeW * (lg(f) - 1 - this.decadeOffset);
};


/** Map x coord to a frequency */
proto.unmap = function (x, w) {
	var decadeW = w / this.decades;
	return Math.pow(10, x/decadeW + 1 + this.decadeOffset);
};


/** Draw waveform domain */
proto.draw.waveform = function () {

};


/** Draw spectrogram */
proto.draw.spectrogram = function () {

};


/** Recalc style from the element */
proto.update = function () {
	//reread canvas styles
	this.color = getComputedStyle(this.canvas).color || 'black';
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
};