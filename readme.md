[![Demo](https://raw.githubusercontent.com/dfcreative/audio-stats/master/logo.png)](https://dfcreative.github.io/audio-stats)

[![Code Climate](https://codeclimate.com/github/dfcreative/web-audio-stats/badges/gpa.svg)](https://codeclimate.com/github/dfcreative/web-audio-stats) ![deps](https://david-dm.org/dfcreative/web-audio-stats.svg) [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Web-audio stats grapher.

* [x] Spectrum
* [ ] Spectrogram
* [ ] Waveform
* [ ] Wavelet


## Usage

[![npm install audio-stats](https://nodei.co/npm/audio-stats.png?mini=true)](https://nodei.co/npm/audio-stats/)


```js
var Stats = require('audio-stats');

var stats = new Stats(options);

source.connect(stats.node);
stats.node.connect(context.destination);

document.body.appendChild(stats.element);
```


## API

### `Stats(options?)`

Creates stats controller.

| Option | Description |
|---|---|
| `minFrequency` | Starting frequency to plot, by default `20`. |
| `maxFrequency` | Maximum frequency to plot, by default `20000`. |
| `minDecibels` | Minimum decibels to capture, by default `-90` |
| `maxDecibels` | Maximum decibels to limit, by default `-30`. |
| `log` | Display logarithmic frequencies. Default is `true`. |


### `Stats.prototype.update()`

Recalculate style, size and position.


### `Stats.prototype.on('draw', function (canvas) {})`

Hook for drawing additional info on the canvas.