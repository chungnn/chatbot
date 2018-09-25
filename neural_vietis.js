const sentence_feature = require('./sentence_feature'); //added
const tf = require('@tensorflow/tfjs');

const sentences = [
	{sentence: "VietIS thật là tuyệt vời", intent: "#vietis"},
	{sentence: "Giới thiệu cho tôi về VietIS", intent: "#vietis"},
	{sentence: "VietIS là công ty như thế nào", intent: "#vietis"},
	{sentence: "Giới thiệu đi", intent: "#vietis"},
	{sentence: "Nói về VietIS cho tao xem", intent: "#vietis"},
	{sentence: "Cái gì thế", intent: "#else"},
	{sentence: "làm như thế nào", intent: "#else"},
	{sentence: "con", intent: "#else"},
	{sentence: "cò", intent: "#else"},
	{sentence: "bé", intent: "#else"},
	/*
	{sentence: "bé", intent: "#else"},
	{sentence: "cành tre", intent: "#else"},
	{sentence: "không biết", intent: "#else"},
	{sentence: "đi chơi", intent: "#else"},
	{sentence: "vì sao", intent: "#else"},
	{sentence: "khách quan", intent: "#else"},
	{sentence: "cụ thể", intent: "#else"},
	{sentence: "phát triển", intent: "#else"},
	{sentence: "chính xác", intent: "#else"},
	*/
	{sentence: "ngôn từ", intent: "#else"},
	{sentence: "buồn", intent: "#else"},
	{sentence: "năm tháng trôi qua", intent: "#else"},
	{sentence: "vì sao lại thế", intent: "#else"},
	{sentence: "mạng này lởm rồi", intent: "#else"},
	{sentence: "buồn ơi là buồn", intent: "#else"},
	{sentence: "cánh cò", intent: "#else"}
];

//build neural network
const model = tf.sequential();
model.add(tf.layers.dense({units: 20, activation: 'sigmoid', inputShape: [10]}));
model.add(tf.layers.dense({units: 2, activation: 'sigmoid', inputShape: [20]}));
model.add(tf.layers.dense({units: 2, activation: 'sigmoid'}));
model.compile({optimizer: tf.train.adam(.06), loss: 'meanSquaredError'});

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
	return sentences.map((item => [
		item.intent == "#vietis" ? 1 : 0,
		item.intent != "#vietis" ? 1 : 0
	]));
}

var train = function (){
	features = get_features();
	intents = get_intents();
	console.log(intents);
	//convert data
	const trainingData = tf.tensor2d(features);
	const outputData = tf.tensor2d(intents);
	model.fit(trainingData, outputData, {
	  epochs: 100,
	  callbacks: {
		onEpochEnd: async (epoch, log) => {
		  console.log(`Epoch ${epoch}: loss = ${log.loss}`);
		}
	  }
	}).then((history) => {
		//console.log(history);
		//model.predict(testingData).print();
		console.log("Train OK");
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

var predict = function(sentence){
	sentence_feature.extract_feature(sentence, (feature) => {
		var result = model.predict(tf.tensor2d([feature]));
		var readable_output = result.dataSync();
		console.log(readable_output);
		result.print();
	});
}

module.exports.train = train;
module.exports.predict = predict;

