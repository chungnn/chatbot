var vntk = require('vntk');
var tokenizer = vntk.wordTokenizer();

var exceptWord = ['công ty', 'vị trí']
vocabs = require("./dict.json");

var extract_feature = function(sentence, callback) {
	//console.log(words.length);
	//console.log(vocabs);
	var sentenceWords = tokenizer.tag(sentence);
	var feature = new Array(vocabs.length).fill(0);
	for(x in sentenceWords) {
		pos = vocabs.indexOf(sentenceWords[x].toLowerCase());
		if(pos != -1) {
			feature[pos] = 1
		}
	}
	console.log(sentenceWords);
	callback(feature);
}
    //  extract_feature('thank you', function(feature) {
	
    // });
module.exports.extract_feature = extract_feature;
module.exports.feature_length = vocabs.length;

