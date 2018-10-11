const sentence_feature = require('./sentence_feature'); //added
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');
const botData = require("./chatbot.json").intents;
const sentences = [];
botData.forEach((intent, index) => {
	intent.pattern.forEach((item, index) => {
		sentences.push({
			sentence: item,
			intent: intent.intent
		});
	});
});
const intentsList = [];
botData.forEach((item, index) => {
	intentsList.push(item.intent);
});

//build neural network
const model = tf.sequential();
model.add(tf.layers.dense({units: 30, activation: 'sigmoid', inputShape: [sentence_feature.feature_length]}));
model.add(tf.layers.dense({units: 10, activation: 'sigmoid', inputShape: [30]}));
model.add(tf.layers.dense({units: intentsList.length, activation: 'sigmoid'}));
model.compile({optimizer: tf.train.adam(.01), loss: 'meanSquaredLogarithmicError'});

var get_features = function(){
	var features = [];
	sentences.forEach((item, index) => {
		sentence_feature.extract_feature(item.sentence, (feature) => {
			features.push(feature);
		});
	});
	return features;
}

var get_intents = function(){
	return sentences.map((item => {
		var intentOutput = [];
		intentsList.forEach((intent, index) => {
			intentOutput.push(item.intent == intent ? 1 : 0,);
		});
		return intentOutput;
	}));
}

var train = function (){
	features = get_features();
	intents = get_intents();
	// console.log('intents');
	// console.log(intents);
	//convert data
	const trainingData = tf.tensor2d(features);
	const outputData = tf.tensor2d(intents);
	model.fit(trainingData, outputData, {
	  epochs: 2000,
	  callbacks: {
		onEpochEnd: async (epoch, log) => {
		console.log(`Epoch ${epoch}: loss = ${log.loss}`);
		}
	  }
	}).then((history) => {
		//console.log(history);
		//model.predict(testingData).print();
		console.log("Train OK");
		model.save('file://./savedModel/chatbot_model.h5');
		console.log("model saved");
		//model.predict(tf.tensor2d([[0,0,0,1,1,0,0,0,0,1,1]])).print();
		//sentence_feature.extract_feature("cái quái gì vậy", (feature) => {
			//features.push(feature);
		//	model.predict(tf.tensor2d([feature])).print();
		//});
	}, (err) => {
		console.log("Train ERROR");
		console.log(err);
	});
}
var getIntentFromOutput = function(tsOutput) {
	var result;
	var tmp = 0;
	tsOutput.forEach((item, index) => {
		if (Math.round(item) && tmp < item) {
			result = intentsList[index];
			tmp = item;
		}
	});
	if (!result) return '#else';
	return result;
}

var predict = function(sentence){
	var intent;
	sentence_feature.extract_feature(sentence, (feature) => {
		var result = model.predict(tf.tensor2d([feature]));
		var readable_output = result.dataSync();
		result.print();
		intent = getIntentFromOutput(readable_output);
	});
	return getSentenceFromIntent(intent);
}

var getSentenceFromIntent = function(intent) {
	var data;
	botData.forEach((item, index) => {
		if (intent == item.intent) {
			data = item.response;
			return;
		}
	});
	return data[Math.floor(Math.random() * data.length)]
}

module.exports.train = train;
module.exports.predict = predict;