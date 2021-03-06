var vntk = require('vntk');
var tokenizer = vntk.wordTokenizer();

var words = tokenizer.tag('VietIS là công ty chuyên gia công phần mềm cho thị trường Nhật Bản có uy tín với một đội ngũ kỹ sư, '
+ 'chuyên gia và quản lý dự án nhiều năm kinh nghiệm, đã làm việc với nhiều khách hàng Nhật Bản lớn như Hitachi, '
+ 'NTTData, Panasonic, … VietIS hiện đang áp dụng quy trình phần mềm và các công cụ quản lý dự án hiện đại, '
+ 'theo tiêu chuẩn CMMI-3, ISO 27001. VietIS xây dựng một môi trường làm việc thân thiện, chuyên nghiệp, '
+ 'tạo cơ hội phát triển cho mọi cá nhân và tập thể.');

var words = tokenizer.tag('VietIS thật là tuyệt vời Giới thiệu cho tôi như thế nào khách hàng Nhật Bản');

vocabs = words.filter(function(elem, pos) {
	return words.indexOf(elem) == pos;
});

var extract_feature = function(sentence, callback) {
	//console.log(words.length);
	//console.log(uniqueWords);
	var sentenceWords = tokenizer.tag(sentence);
	var feature = new Array(vocabs.length).fill(0);
	for(x in sentenceWords) {
		pos = vocabs.indexOf(sentenceWords[x]);
		if(pos != -1) {
			feature[pos] = 1
		}
	}
	console.log(feature);
	callback(feature);
}

module.exports.extract_feature = extract_feature;

