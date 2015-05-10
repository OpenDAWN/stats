# Web-audio-stats [![Code Climate](https://codeclimate.com/github/dfcreative/web-audio-stats/badges/gpa.svg)](https://codeclimate.com/github/dfcreative/web-audio-stats) ![deps](https://david-dm.org/dfcreative/web-audio-stats.svg) ![size](https://img.shields.io/badge/size-10.8kb-brightgreen.svg) [![unstable](http://badges.github.io/stability-badges/dist/unstable.svg)](http://github.com/badges/stability-badges)

Stats.js for web-audio. [Demo](TODO).

[Screenshots]

* Frequency diagram
* Waveform diagram



`$ npm install web-audio-frequency`

```js
var Stats = require('web-audio-stats');

var stats = new Stats(audio, context, options);

document.body.appendChild(stats.element);
```


### `Stats(element [, context])`

Stats constructor. Returns a new stats controller.

| Option | Description |
|---|---|
| `context` | AudioContext object |

### `Stats.prototype.mode([mode])`

Get or set mode of rendering

| Mode | Description |
|---|---|
| `0` | Waveform |
| `1` | Frequency |


[![NPM](https://nodei.co/npm/web-audio-stats.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/web-audio-stats/)