module.exports = function(RED) {
//	model : 'resources/jarvis.pmdl',
//	detector : 'resources/common.res',

	Detector = require('snowboy').Detector;
	Models = require('snowboy').Models;
	var isReadableStream = require('isstream').isReadable;

	/***********/
	// Snowboy //
	/***********/
	function Snowboy_Node(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		
		node.inputStream = null;

		var models = new Models();
		models.add({
			file : config.modelFile,
			sensitivity : config.sensitivity,
			hotwords : config.hotwords
		});
		
		var detector = new Detector({
			resource : config.detectorFile,
			models : models,
			audioGain : 2.0
		});

		detector.on('silence', function() {
			node.log('Silence detected');
		});

		detector.on('sound', function() {
			node.log('Sound detected');
		});

		detector.on('error', function() {
			node.log('Error in detector: ' + error);
		});

		detector.on('hotword', function(index, hotword) {
			node.log('Hotword detected: ' + index + " - " + hotword);
			if( node.inputStream != null )
				node.inputStream.unpipe(detector);

			node.msg.payload = hotword;
			node.send(node.msg);
		});

		node.on('input', function(msg) {
			node.log("Event input");

			node.msg = msg;

			if( isReadableStream(msg.payload) ) {
				if (node.inputStream != msg.payload) {
					if( node.inputStream != null )
						node.inputStream.unpipe(detector);

					node.inputStream = msg.payload;
					node.inputStream.pipe(detector);
				}
			} else if( Buffer.isBuffer(msg.payload) ) {
				if( node.inputStream != null ) {
					node.inputStream.unpipe(detector);
					node.inputStream = null;
				}
				detector.write(msg.payload);
			} else {
				node.error("Error with payload : not a Stream Readable nor a Buffer", msg);
				return;
			}
		});

		node.on('close', function() {
			node.log("Event close");
			if( node.inputStream != null )
				node.inputStream.unpipe(detector);
			detector.end();
		});
	}

	RED.nodes.registerType("Snowboy", Snowboy_Node);
}
