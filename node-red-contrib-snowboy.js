module.exports = function(RED) {
	// model : 'resources/jarvis.pmdl',
	// detector : 'resources/common.res',

	Detector = require('snowboy').Detector;
	Models = require('snowboy').Models;
	var isReadableStream = require('isstream').isReadable;

	/***********/
	// Snowboy //
	/***********/
	function Snowboy_Node(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		node.config = config;
		node.inputStream = null;

		if( node.config.models == null || node.config.detectorFile == null ) {
			node.error('Config missing !!!');
			return;
		}

		var models = new Models();
		node.config.models.forEach(function(element) {
			models.add(element);
		});

		var detector = new Detector({
			resource: node.config.detectorFile,
			models: models,
			audioGain: 2.0
		});

		var lastModel = node.config.models[node.config.models.length - 1];
		node.config.nbOutputs = lastModel.idxOutput + lastModel.nbOutputs;
		
		detector.on('silence', function() {
			if( node.config.debug == true || node.config.debug == "true" )
				node.log('Silence detected');
		});

		detector.on('sound', function() {
			if( node.config.debug == true || node.config.debug == "true" )
				node.log('Sound detected');
		});

		detector.on('error', function(error) {
			node.error('Error in detector: ' + error);
		});

		detector.on('hotword', function(index, hotword) {
			node.log('Hotword detected: ' + index + " - " + hotword);
			if( node.inputStream != null )
				node.inputStream.unpipe(detector);

			node.msg.payload = hotword;
			index--;
			
			if( node.config.multipleOutput == true || node.config.multipleOutput == "true" ) {
				var outputs = [];
				for( var i = 0; i < node.config.nbOutputs; i++) {
					if( i == index )
						outputs.push(node.msg);
					else
						outputs.push(null);
				}
				node.send(outputs);
			} else
				node.send(node.msg);
		});

		node.on('input', function(msg) {
			if( node.config.debug == true || node.config.debug == "true" )
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
			if( node.config.debug == true || node.config.debug == "true" )
				node.log("Event close");

			if( node.inputStream != null )
				node.inputStream.unpipe(detector);
			detector.end();
		});
	}

	RED.nodes.registerType("Snowboy", Snowboy_Node);
}
