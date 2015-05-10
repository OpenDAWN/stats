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
function Stats (audio, ctx) {
	//ensure instance
	if (!(this instanceof Stats)) return new Stats(el, ctx);

	//ensure audio element
	if (!(audio instanceof AudioNode)) {
		this.audio = audio instanceof Audio
		? ctx.createMediaElementSource(audio)
		: ctx.createMediaStreamSource(audio);
	}
	else {
		this.audio = audio;
	}

	this.element = doc.createElement('canvas');
	this.analyser = ctx.createAnalyser();

	//get buffer freq data
	this.analyser.fftSize = 2048;
	this.bufferLength = this.analyser.frequencyBinCount;
	this.dataArray = new Uint8Array(this.bufferLength);
	this.analyser.getByteTimeDomainData(this.dataArray);

	//connect audio to analyser
	this.audio.connect(this.analyser);
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
proto.setMode = function (mode) {
	this.mode = mode;
};


/**
 * Draw iteration
 */
proto.draw = function () {

};