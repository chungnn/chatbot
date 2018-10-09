const sentence_feature = require('./sentence_feature'); //added
const tf = require('@tensorflow/tfjs');
const sentences = [
	{sentence: "VietIS thật là tuyệt vời", intent: "#vietis"},
	{sentence: "Giới thiệu cho tôi về VietIS", intent: "#vietis"},
	{sentence: "VietIS là công ty như thế nào", intent: "#vietis"},
	{sentence: "Giới thiệu đi", intent: "#vietis"},
	{sentence: "Nói về VietIS cho tao xem", intent: "#vietis"},
	{sentence: "Hi", intent: "#greeting"},
	{sentence: "Hello", intent: "#greeting"},
	{sentence: "Chào", intent: "#greeting"},
	{sentence: "Hi there", intent: "#greeting"},
	{sentence: "bạn là ai?", intent: "#self"},
	{sentence: "giới thiệu bản thân đi?", intent: "#self"},
	{sentence: "bao nhiêu nhân viên?", intent: "#quality"},
	{sentence: "Quy mô công ty như thế nào?", intent: "#quality"},
	{sentence: "công ty cần vị trí nào?", intent: "#career"},
	{sentence: "đang tuyển việc nào?", intent: "#career"},
	{sentence: "công ty đang tuyển vị trí nào?", intent: "#career"},
	{sentence: "vị trí android như thế nào?", intent: "#android"},
	{sentence: "còn tuyển android không?", intent: "#android"},
	{sentence: "vị trí ios như thế nào?", intent: "#ios"},
	{sentence: "còn tuyển ios không", intent: "#ios"},
	{sentence: "vị trí java như thế nào?", intent: "#java"},
	{sentence: "còn tuyển java không", intent: "#java"},
	{sentence: "bye", intent: "#bye"},
	{sentence: "goodbye", intent: "#bye"},
	{sentence: "tạm biệt", intent: "#bye"},
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

const intentsList = [
	'#vietis',
	'#greeting',
	'#quality',
	'#android',
	'#ios',
	'#java',
	'#career',
	'#self',
	'#bye',
	'#else'
];

const replyFromIntent =  require("./replyData.json");

//build neural network
const model = tf.sequential();
model.add(tf.layers.dense({units: 20, activation: 'sigmoid', inputShape: [28]}));
model.add(tf.layers.dense({units: 2, activation: 'sigmoid', inputShape: [20]}));
model.add(tf.layers.dense({units: 10, activation: 'sigmoid'}));
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
		item.intent == "#greeting" ? 1 : 0,
		item.intent == "#quality" ? 1 : 0,
		item.intent == "#android" ? 1 : 0,
		item.intent == "#ios" ? 1 : 0,
		item.intent == "#java" ? 1 : 0,
		item.intent == "#career" ? 1 : 0,
		item.intent == "#self" ? 1 : 0,
		item.intent == "#bye" ? 1 : 0,
		item.intent == "#else" ? 1 : 0
	]));
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
	  epochs: 10000,
	  callbacks: {
		onEpochEnd: async (epoch, log) => {
		 //console.log(`Epoch ${epoch}: loss = ${log.loss}`);
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
var getIntent = function(tsOutput) {
	var result;
	tsOutput.forEach((item, index) => {
		if (Math.round(item)) result = intentsList[index];
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
		intent = getIntent(readable_output);
	});
	return getSentenceFromIntent(intent);
}

var getSentenceFromIntent = function(intent) {
	var data = replyFromIntent[intent];
	return data[Math.floor(Math.random() * data.length)]
}

module.exports.train = train;
module.exports.predict = predict;

