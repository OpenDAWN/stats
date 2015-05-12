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

Stats constructor. Returns a new stats controller.

| Option | Description |
|---|---|
| `Fmin` | Starting frequency to plot, by default `20`. |
| `Fmax` | Maximum frequency to plot, by default `20000`. |
| `mode` | `frequency` (default), `waveform`, `spectrogram`. |
| `grid` | Display grid. |
| `labels` | Display axis labels. |
| `logScale` | Logarithmic scale. |
| `align` | Align bars: `middle`, `top`, `bottom`. |
| `color` | Bars color. Taken automatically as container’s css `color` property. |

### `Stats.prototype.mode(mode)`

Get or set mode of rendering

| Mode | Description |
|---|---|
| `0` | Waveform |
| `1` | Frequency |


[![NPM](https://nodei.co/npm/web-audio-stats.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/web-audio-stats/)