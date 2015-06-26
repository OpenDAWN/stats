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
var Emitter = require('events');
var on = require('emmy/on');
var audioContext = require('audio-context');


module.exports = Stats;


var doc = document, win = window;



/**
 * @constructor
 */
function Stats (options) {
	//ensure instance
	if (!(this instanceof Stats)) return new Stats(el, options);

	var self = this;

	//init options
	options = options || {};
	extend(self, options);

	self.audioContext = audioContext;

	//create holder
	if (!self.element) self.element = doc.createElement('div');
	self.element.classList.add('audio-stats');

	//create canvas
	self.canvas = doc.createElement('canvas');
	self.canvas.classList.add('audio-stats-canvas');
	self.canvasContext = self.canvas.getContext('2d');
	self.element.appendChild(self.canvas);

	lifecycle(self.element);

	//once canvas is inserted - update it’s calc styles
	on(self.element, 'attached', function () {
		self.update();
	});
	self.update();

	//update on win resize
	on(win, 'resize', function () {
		self.update();
	});

	//create analyser node
	self.node = audioContext.createAnalyser();
	self.node.smoothingTimeConstant = self.smoothingTimeConstant;
	self.node.maxDecibels = self.maxDecibels;
	self.node.minDecibels = self.minDecibels;
	self.node.fftSize = self.fftSize;
	self.bufferLength = self.node.frequencyBinCount;
	self.data = new Uint8Array(self.bufferLength);

	//detect decades
	self.decades = Math.round(lg(self.maxFrequency/self.minFrequency));
	self.decadeOffset = lg(self.minFrequency/10);

	//display grid
	self.grid = doc.createElement('div');
	self.grid.classList.add('audio-stats-grid');

	//show frequencies
	for (var f = self.minFrequency; f <= self.maxFrequency; f*=10) {
		var line = doc.createElement('span');
		line.classList.add('audio-stats-line');
		line.classList.add('audio-stats-line-h');
		line.setAttribute('data-frequency', f);
		line.style.left = self.map(f, 100) + '%';
		self.grid.appendChild(line);
	}

	//draw magnitude limits
	var mRange = self.maxDecibels - self.minDecibels;
	for (var m = self.minDecibels, i = 0; m <= self.maxDecibels; m += 10, i += 10) {
		var line = doc.createElement('span');
		line.classList.add('audio-stats-line');
		line.classList.add('audio-stats-line-v');
		line.setAttribute('data-magnitude', m);
		line.style.bottom = 100 * i / mRange + '%';
		self.grid.appendChild(line);
	}

	self.element.appendChild(self.grid);


	//render spectrum
	function draw() {
		requestAnimationFrame(draw);
		self.draw();
		self.emit('draw', self.canvas);
	}
	draw();
}


var proto = Stats.prototype = Object.create(Emitter.prototype);


/**
 * Connect analyser to a target.
 */
proto.connect = function (target) {
	this.node.connect(target);
};


/** Frequency grapher */
proto.draw = function () {
	var ctx = this.canvasContext,
		canvas = this.canvas,
		w = canvas.width,
		h = canvas.height,
		analyser = this.node,
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

/** Other params */
proto.fftSize = 8192;
proto.smoothingTimeConstant = 0.8;


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


/** Recalc style from the element */
proto.update = function () {
	//reread canvas styles
	this.color = getComputedStyle(this.canvas).color || 'black';
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
};