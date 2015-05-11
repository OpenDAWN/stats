/**
 * Frequency/time domain diagrams for web-audio.
 * Inpsired by stats.js
 *
 * @module  web-audio-stats
 *
 */


module.exports = Stats;


var doc = document, win = window;


var key = require('piano-key');


/**
 * Options are omitted in purpose - use API to setup instance
 *
 * @constructor
 */
function Stats (audio, ctx, options) {
	//ensure instance
	if (!(this instanceof Stats)) return new Stats(el, ctx);

	var self = this;

	//ensure audio element
	if (!(audio instanceof AudioNode)) {
		this.audio = audio instanceof Audio
		? ctx.createMediaElementSource(audio)
		: ctx.createMediaStreamSource(audio);
	}
	else {
		this.audio = audio;
	}

	this.analyser = ctx.createAnalyser();

	//sample rate
	this.audioCtx = ctx;
	this.Fmax = 18000;

	//create visual element
	this.element = doc.createElement('canvas');
	this.element.classList.add('web-audio-stats');
	this.element.width = 600;
	this.element.height = 400;
	this.ctx = this.element.getContext('2d');
	this.analyser.smoothingTimeConstant = 0.7;
	this.analyser.maxDecibels = -30;
	this.analyser.minDecibels = -82;

	//get buffer freq data
	this.analyser.fftSize = 8192;
	this.bufferLength = this.analyser.frequencyBinCount;
	this.data = new Uint8Array(this.bufferLength);

	//connect audio to analyser
	this.audio.connect(this.analyser);


	//draw legend
	var w = this.element.width, h = this.element.height;
	var sRect = [10,10,w-20,h-20];

	//fill bg
	this.ctx.fillStyle = "rgba(30,40,50,1)";
	this.ctx.fillRect(0,0, w, h);

	//paint frequencies
	this.ctx.fillText(20, mapLog(20, sRect[2]) + sRect[0], h - 2);
	this.ctx.fillText(200, mapLog(200, sRect[2]) + sRect[0], h - 2);
	this.ctx.fillText(2000, mapLog(2000, sRect[2]) + sRect[0], h - 2);
	this.ctx.fillText(20000, mapLog(20000, sRect[2]) + sRect[0], h - 2);
	this.ctx.fillText(10, mapLog(10, sRect[2]) + sRect[0], h - 2);
	this.ctx.fillText(100, mapLog(100, sRect[2]) + sRect[0], h - 2);
	this.ctx.fillText(1000, mapLog(1000, sRect[2]) + sRect[0], h - 2);
	this.ctx.fillText(10000, mapLog(10000, sRect[2]) + sRect[0], h - 2);


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
proto.mode = 'frequencyLog';


/** Show legend */
proto.legend = true;


/**
 * Draw iteration
 */
proto.draw = {};


/** Draw frequency domain */
proto.draw.frequency = function () {
	var ctx = this.ctx,
		canvas = this.element,
		w = canvas.width,
		h = canvas.height,
		analyser = this.analyser,
		data = this.data;

	// Get the new frequency data
	analyser.getByteFrequencyData(data);

	//spectrum area
	var sRect = [10,10,w-20,h-20];
	ctx.fillStyle = "rgba(30,40,50,1)";
	ctx.fillRect(sRect[0], sRect[1], sRect[2], sRect[3]);
	ctx.fillStyle = "rgba(240,200,40,.1)";
	ctx.fillRect(sRect[0], sRect[1], sRect[2], sRect[3]);

	//fill bars
	ctx.fillStyle = "rgb(240,200,40)";

	var Fs = this.audioCtx.sampleRate;
	var iw = (sRect[2]) / data.length;
	var ih;
	for (var i = 0, l = data.length; i<l; i++) {
		ih = (data[i] / 255) * sRect[3];
		ctx.fillRect(i * iw + sRect[0], sRect[3] - ih + sRect[1], 1, ih);
	}

	//show frequencies
	// freq = i * Fsample / N;
	// sampling rate should be divided half to get real maximum frequency.
	for (var i = 0; i < data.length; i+=100) {
		ctx.fillText((i / 2 * Fs / data.length).toFixed(2), i * iw + sRect[0], h - 2);
	}
};


proto.draw.frequencyLog = function () {
	var ctx = this.ctx,
		canvas = this.element,
		w = canvas.width,
		h = canvas.height,
		analyser = this.analyser,
		data = this.data;

	// Get the new frequency data
	analyser.getByteFrequencyData(data);

	//spectrum area
	var sRect = [10,10,w-20,h-20];
	ctx.fillStyle = "rgba(30,40,50,1)";
	ctx.fillRect(sRect[0], sRect[1], sRect[2], sRect[3]);
	ctx.fillStyle = "rgba(240,200,40,.1)";
	ctx.fillRect(sRect[0], sRect[1], sRect[2], sRect[3]);

	//fill bars
	ctx.fillStyle = "rgba(240,200,40, 1)";
	var Fs = this.audioCtx.sampleRate;
	var ih, f, x, iw, note, noteF;

	for (var i = 0, l = data.length; i<l; i++) {
		ih = (data[i] / 255) * sRect[3];
		f = i * 0.5 * Fs / data.length;
		x = mapLog(f, sRect[2]);

		//get note number from freq
		// note = Math.round(key.number(f));
		// noteF = key.frequency(note);

		// iw = Math.round(mapLog(key.frequency(note+1), sRect[2]) - mapLog(key.frequency(note-1), sRect[2]));

		ctx.fillRect(~~(x + sRect[0]), sRect[3] - ih + sRect[1], 1, ih);
	}
};

/** Map logarithmically frequency */
var Fmin = 20;
var Fmax = 20000;
var decadesNum = lg(Fmax/Fmin);
var decadeOffset = lg(Fmin/10);
function mapLog(f, w){
	var decadeW = w / decadesNum;
	return lg(f) * decadeW - decadeW - decadeW * decadeOffset;
}

function lg(f) {
	return Math.log(f) / Math.log(10);
}


/** Draw waveform domain */
proto.draw.waveform = function () {

};


/** Draw spectrogram */
proto.draw.spectrogram = function () {

};