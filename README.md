# node-red-contrib-snowboy

Node-RED node for Snowboy (bases on nodejs Snowboy : a customizable hotword detection engine for you to create your own hotword like "OK Google" or "Alexa").

## Prerequisites
This node-red node is based on Snowboy nodejs, so first install it ([Snowboy](https://www.npmjs.com/package/snowboy)).

## Install
Run the following npm command in your Node-RED environment.
```
npm install node-red-contrib-snowboy
```

## Usage
This package add 1 input node (Snowboy) to Node-RED.

The Snowboy node expect the following payload :
* `Readable stream`: A stream object containing the audio to analyse. It may be a stream from microphone or audio file. 
Or
* `Buffer`: A buffer containing the audio to analyse. It may be a stream from microphone or audio file.

N.B.: Each time an input payload is received (no matter stream or buffer), the previous stream (if any) is unpiped.

The snowboy node emit a message with the hotword detected as the payload. The stream (if any) is unpiped.

The Snowboy node comprises the following options:

* **Detector file**: File name of the snowboy detector (like common.res)
* **Models**: List of model
	* **Hotwords**: Hotwords to detect (like `jarvis`)
	* **Sensitivity**: Number between 0 and 1 indicate the level to detect hotwords. Default: `0.5`
	* **Model file**: File name of the snowboy model (like jarvis.pmdl)
* **Multiple output**:
	* **False**: One output for all the hotwords
	* **True**: One output for each hotword.
* **Debug**: Set it to true if you want more log

## Snowboy
[Home Page](https://snowboy.kitt.ai)

[Full Documentation](http://docs.kitt.ai/snowboy)

## License
The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
