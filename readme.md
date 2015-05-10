# Web-audio-stats

Stats.js for web-audio.

[Screenshots]
[Demo]


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

### `Stats.prototype.begin()`

Begin collecting stats.

### `Stats.prototype.end()`

Stop plotting.