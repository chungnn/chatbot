const tf = require('@tensorflow/tfjs');
// Load the binding:
//require('@tensorflow/tfjs-node');
const iris = require("./iris.json");
const irisTesting = require("./irisTesting.json");

//convert data
const trainingData = tf.tensor2d(iris.map(item => [
	item.sepalLength, item.sepalWidth, item.petalLength, item.petalWidth
]));

const outputData = tf.tensor2d(iris.map(item => [
	item.species == "setosa" ? 1 : 0,
	item.species == "versicolor" ? 1 : 0,
	item.species == "virginica" ? 1 : 0,
]));

console.log("console.log(trainingData);", trainingData);
console.log("console.log(outputData);", outputData);

const testingData = tf.tensor2d(irisTesting.map(item => [
	item.sepalLength, item.sepalWidth, item.petalLength, item.petalWidth
]));

//build neural network
const model = tf.sequential();
model.add(tf.layers.dense({units: 5, activation: 'sigmoid', inputShape: [4]}));
model.add(tf.layers.dense({units: 3, activation: 'sigmoid', inputShape: [5]}));
model.add(tf.layers.dense({units: 3, activation: 'sigmoid'}));
model.compile({optimizer: tf.train.adam(.06), loss: 'meanSquaredError'});

var train = function(){
	const startTime = Date.now();
	model.fit(trainingData, outputData, {
	  epochs: 100
	}).then((history) => {
		//console.log(history);
		//model.predict(testingData).print();
		console.log("Train OK");
	}, (err) => {
		console.log("Train ERROR");
		console.log(err);
	});
}

var predict = function(){
	model.predict(testingData).print();
}

module.exports.train = train;
module.exports.predict = predict;

/*
// Load the binding:
require('@tensorflow/tfjs-node');  // Use '@tensorflow/tfjs-node-gpu' if running with GPU.

// Train a simple model:
const model = tf.sequential();
model.add(tf.layers.dense({units: 100, activation: 'relu', inputShape: [10]}));
model.add(tf.layers.dense({units: 1, activation: 'linear'}));
model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

const xs = tf.randomNormal([100, 10]);
const ys = tf.randomNormal([100, 1]);

model.fit(xs, ys, {
  epochs: 1000,
  callbacks: {
    onEpochEnd: async (epoch, log) => {
      console.log(`Epoch ${epoch}: loss = ${log.loss}`);
    }
  }
});
*/