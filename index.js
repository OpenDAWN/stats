/**
 * Frequency/time domain diagrams for web-audio.
 * Inpsired by stats.js
 *
 * @module  web-audio-stats
 *
 */


module.exports = Stats;


var doc = document, win = window;


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

	//get buffer freq data
	this.analyser.fftSize = 2048;
	this.bufferLength = this.analyser.frequencyBinCount;
	this.data = new Uint8Array(this.bufferLength);

	//connect audio to analyser
	this.audio.connect(this.analyser);

	//render
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

	//fill bg
	ctx.fillStyle = "rgba(30,40,50,1)";
	ctx.fillRect(0,0, w, h);

	// Get the new frequency data
	analyser.getByteFrequencyData(data);

	//spectrum area
	var sRect = [10,10,w-20,h-20];
	ctx.fillStyle = "rgba(240,200,40,.1)";
	ctx.fillRect(sRect[0], sRect[1], sRect[2], sRect[3]);

	//fill bars
	ctx.fillStyle = "rgb(240,200,40)";

	//44100 is too much, take 18000 at max
	var Fs = this.audioCtx.sampleRate;
	var Fmax = this.Fmax;
	var iw = (sRect[2]) / data.length;
	var ih;
	for (var i = 0, l = data.length; i<l; i++) {
		ih = (data[i] / 255) * sRect[3];
		ctx.fillRect(i * iw + sRect[0], sRect[3] - ih + sRect[1], iw, ih);
	}

	//show frequencies
	// freq = i * Fsample / N;
	//sampling rate should be divided 2 by fact
	for (var i = 0; i < data.length; i+=100) {
		ctx.fillText((i / 2 * Fs / data.length).toFixed(2), i * iw + sRect[0], h - 2);
	}
};


/** Draw waveform domain */
proto.draw.waveform = function () {

};


/** Draw spectrogram */
proto.draw.spectrogram = function () {

};