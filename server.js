const express = require('express'); //added
const port = process.env.PORT || 3000; //added
const app = express(); //added

const sentence_feature = require('./sentence_feature'); //added

// Routing for index.html
app.use(express.static(__dirname + '/public')); //added

const server = app.listen(port, '0.0.0.0', () => {  //added
    console.log('Server listening at port %d', port);
});

app.get('/hello', function (req, res) {
	
	//sentence_feature.extract_feature('VietIS là một công ty tuyệt vời', (feature) => {
	//	res.send(JSON.stringify(feature));
	//});
    sentence_feature.extract_feature(req.query.sentence, (feature) => {
		res.send(JSON.stringify(feature));
	});
})