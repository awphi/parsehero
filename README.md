# parsehero

A small, permissive library used to parse `.chart` and `.midi` files made for GuitarHero or CloneHero into usable JSON.

- Permissive - doesn't throw away a whole chart because of a handful of invalid lines
- MIDI - supports the parsing of MIDI files directly from arbirtrary buffer data via [midi-file](https://github.com/carter-thaxton/midi-file)
- Cross-platform - built to work out of the box in the browser and in Node environments
- Built-in timing - parsed charts will their events automatically timestamped by default

## Installing

```
npm install parsehero
```

## Usage

```js
import { parseChart } from "parsehero";

const basicChart = `[Song]
{
  Resolution = 192
}
[SyncTrack]
{
	0 = B 120000
	0 = TS 4
}
[EasySingle]
{
	0 = N 0 0
}`;

const { chart, warnings } = parseChart(basicChart);
// Use your chart object...
```

## References

- [chart2json](https://github.com/AsLogd/chart2json) - robust strict chart parser with a built-in CLI
- [chart2mid2chart](http://fretsonfire.wikidot.com/converting-scorehero-charts) - Java implementation of a chart/MIDI converter translated for use in parsehero
- [Moonscraper-Chart-Editor](https://github.com/FireFox2000000/Moonscraper-Chart-Editor) - popular CloneHero chart editor on which much of the timing calculations in parsehero are based
