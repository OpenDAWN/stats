# Web-audio-stats [![Code Climate](https://codeclimate.com/github/dfcreative/web-audio-stats/badges/gpa.svg)](https://codeclimate.com/github/dfcreative/web-audio-stats) ![deps](https://david-dm.org/dfcreative/web-audio-stats.svg) [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Stats.js for web-audio. [Demo](TODO).

[Screenshots]

* Frequency diagram
* Waveform diagram



`$ npm install web-audio-frequency`

```js
var Stats = require('web-audio-stats');

var stats = new Stats(audioSource, context, options);

document.body.appendChild(stats.element);
```


### `Stats(audio, context[, options])`

Stats constructor. Returns a new stats controller. Pass audio source - audio tag, stream or something else convertable to stream.

| Option | Description |
|---|---|
| `minFrequency` | Starting frequency to plot, by default `20`. |
| `maxFrequency` | Maximum frequency to plot, by default `20000`. |
| `minDecibels` | Minimum decibels to capture, by default `-90` |
| `maxDecibels` | Maximum decibels to limit, by default `-30`. |
| `mode` | `frequency` (default), `waveform`, `spectrogram`. |
| `grid` | Display frequencies/decibels grid. |


### `Stats.prototype.update()`

Recalculate style, size and position.


[![NPM](https://nodei.co/npm/web-audio-stats.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/web-audio-stats/)