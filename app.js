const express = require('express'); //added
const port = process.env.PORT || 3000; //added
const app = express(); //added

// Routing for index.html
app.use(express.static(__dirname + '/public')); //added

const neural_vietis = require('./neural_vietis'); //added

const server = app.listen(port, '0.0.0.0', () => {  //added
		console.log('Server listening at port %d', port);
		neural_vietis.train();
});

const Botmaster = require('botmaster');
const SocketioBot = require('botmaster-socket.io');

const botmaster = new Botmaster({
  server,
});

const socketioSettings = {
  id: 'SOME_BOT_ID_OF_YOUR_CHOOSING',
  server,
};

const socketioBot = new SocketioBot(socketioSettings);
botmaster.addBot(socketioBot);

botmaster.use({
  type: 'incoming',
  name: 'my-middleware',
  controller: (bot, update) => {
		return bot.reply(update, neural_vietis.predict(update.message.text));
    // if (update.message.text === 'hi' ||
		//   update.message.text === 'Hi' ||
		//   update.message.text === 'hello' ||
		//   update.message.text === 'Hello') {
		// return bot.reply(update, 'well hi right back at you');
	  // } else if (update.message.text.indexOf('weather') > -1) {
		// return bot.sendTextMessageTo('It is currently sunny in Philadelphia', update.sender.id);
	  // } else {
		// const messages = ['I\'m sorry about this.',
		// 				  'But it seems like I couldn\'t understand your message.',
		// 				  'Could you try reformulating it?']
		// return bot.sendTextCascadeTo(messages, update.sender.id)
	  // }
  }
});

botmaster.on('error', (bot, err) => { // added
  console.log(err.stack); // added
}); // added