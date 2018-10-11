var vntk = require('vntk');
var tokenizer = vntk.wordTokenizer();

var exceptWord = require("./except_word.json");
vocabs = require("./dict.json");

var calibrateSentenceWords = function(words) {
	for(x=words.length-1; x>0; x--) {
		var indexOfWord = exceptWord.indexOf(words[x-1].toLowerCase() + ' ' + words[x].toLowerCase());
		if (indexOfWord != -1 ) {
			words.splice(x, 1);
			words[x-1] = exceptWord[indexOfWord];
		}
	} 
	return words;
}

var extract_feature = function(sentence, callback) {
	//console.log(words.length);
	//console.log(vocabs);
	var sentenceWords = calibrateSentenceWords(tokenizer.tag(sentence));
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
     extract_feature('công ty cần vị trí nào?', function(feature) {
	
	});

module.exports.extract_feature = extract_feature;
module.exports.feature_length = vocabs.length;

