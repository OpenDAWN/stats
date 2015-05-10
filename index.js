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
		self.draw.call(self);
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
proto.mode = function (mode) {
	this.mode = mode;
	return this;
};


/** Show legend */
proto.legend = true;


/**
 * Draw iteration
 */
proto.draw = function () {
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

	//fill spectrum area
	var sRect = [10,10,w-20,h-20];
	ctx.fillStyle = "rgba(240,200,40,.1)";
	ctx.fillRect(sRect[0], sRect[1], sRect[2], sRect[3]);

	//fill bars
	ctx.fillStyle = "rgb(240,200,40)";
	for (var i = 0, l = data.length, ih; i<l; i++) {
		ih = (data[i] / 255) * sRect[3];
		ctx.fillRect(i + sRect[0], sRect[3] - ih + sRect[1], 1, ih);
	}

	//show frequencies
	// freq = i * Fs / N;
	//sample rate
	var Fs = 44100;

	ctx.fillText((0 * Fs / data.length).toFixed(2), 0 + sRect[0], h - 2);
	ctx.fillText((50 * Fs / data.length).toFixed(2), 50 + sRect[0], h - 2);
	ctx.fillText((100 * Fs / data.length).toFixed(2), 100 + sRect[0], h - 2);
	ctx.fillText((150 * Fs / data.length).toFixed(2), 150 + sRect[0], h - 2);
	ctx.fillText((200 * Fs / data.length).toFixed(2), 200 + sRect[0], h - 2);
};