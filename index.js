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
 * Options are omitted in purpose - use API to setup instance
 *
 * @constructor
 */
function Stats (audio, audioCtx, options) {
	//ensure instance
	if (!(this instanceof Stats)) return new Stats(el, audioCtx, options);

	var self = this;

	//init options
	options = options || {};
	extend(self, options);

	//ensure audio element
	if (!(audio instanceof AudioNode)) {
		this.audio = audio instanceof Audio
		? audioCtx.createMediaElementSource(audio)
		: audioCtx.createMediaStreamSource(audio);
	}
	else {
		this.audio = audio;
	}

	this.audioCtx = audioCtx;

	//create holder
	this.element = doc.createElement('div');
	this.element.classList.add('wa-stats');

	lifecycle(this.element);

	//create canvas
	this.canvas = doc.createElement('canvas');
	this.canvas.classList.add('wa-stats-canvas');
	this.canvasCtx = this.canvas.getContext('2d');
	this.element.appendChild(this.canvas);

	//once canvas is inserted - update it’s calc styles
	on(this.canvas, 'attached', function () {
		self.recalcStyle();
	});
	this.recalcStyle();

	//create analyser node
	this.analyser = audioCtx.createAnalyser();
	this.analyser.smoothingTimeConstant = 0.8;
	this.analyser.maxDecibels = -25;
	this.analyser.minDecibels = -80;
	this.analyser.fftSize = 8192;
	this.bufferLength = this.analyser.frequencyBinCount;
	this.data = new Uint8Array(this.bufferLength);

	//connect audio to analyser
	this.audio.connect(this.analyser);

	//detect decades
	this.decades = Math.round(lg(this.Fmax/this.Fmin));
	this.decadeOffset = lg(this.Fmin/10);

	//paint frequencies
	if (this.labels) {
		this.canvasCtx.fillStyle = this.color;

		//measure max metrics to shrink width
		var metrics = this.canvasCtx.measureText(this.Fmax);

		for (var i = 0, f = this.Fmin; i <= this.decades; i++, f*=10) {
			this.canvasCtx.fillText(f, this.map(f, this.canvas.width - metrics.width), h - 2);
		}
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


/**
 * Draw iteration
 */
proto.draw = {};


/** Frequency grapher */
proto.draw.frequency = function () {
	var ctx = this.canvasCtx,
		canvas = this.canvas,
		w = canvas.width,
		h = canvas.height,
		analyser = this.analyser,
		data = this.data;

	// Get the new frequency data
	analyser.getByteFrequencyData(data);

	//fill bg
	ctx.clearRect(0,0,w,h);

	//measure max metrics to shrink width
	var metrics = this.canvasCtx.measureText(this.Fmax);

	//fill bars
	ctx.fillStyle = this.color;
	var Fs = this.audioCtx.sampleRate;
	var ih, f, x, iw, note, noteF;

	for (var i = 0, l = data.length; i<l; i++) {
		ih = (data[i] / 255) * h;
		f = i * 0.5 * Fs / data.length;
		x = this.map(f, w - metrics.width);

		ctx.fillRect(~~x, h - ih, 1, ih);
	}
};


/** Map logarithmically frequency */
proto.Fmin = 20;
proto.Fmax = 20000;


/** Map frequency to an x coord */
proto.map = function (f, w) {
	var decadeW = w / this.decades;
	return lg(f) * decadeW - decadeW - decadeW * this.decadeOffset;
};


/** Draw waveform domain */
proto.draw.waveform = function () {

};


/** Draw spectrogram */
proto.draw.spectrogram = function () {

};


/** Recalc style from the element */
proto.recalcStyle = function () {
	this.color = getComputedStyle(this.canvas).color || 'black';
	console.log(this.color)
	this.canvas.width = this.canvas.clientWidth;
	this.canvas.height = this.canvas.clientHeight;
};