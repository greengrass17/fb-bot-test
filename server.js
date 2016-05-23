var express = require('express');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

var token = 'EAAJZAmusVYkIBAIYa7ZBNd49sLR1qZA0U1oBs80zdIQOL8Q8xbN2sY3nlp3mJVz06MYl8KhOpLEB8thIsp8PWhdjZB3OZBZByXCqtxWqlmzIsh6L7FrOAYgeXWC6Jluqx01ugQGxX9EM5eIZChdvKdNyPnUrQU4omlNAKKXBrEqWgZDZD'

function sendTextMessage(sender, text) {
  var messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

app.use(bodyParser.json());

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === token) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i];
    var sender = event.sender.id;
    if (event.message && event.message.text) {
      var text = event.message.text;
      // Handle a text message from this sender
      sendTextMessage(sender, "Text received, echo: "+ text.substring(0, 200));
    }
  }
  res.sendStatus(200);
});

app.listen(port, function () {
  console.log('Fb Bot Test app listening on port 3000!');
});
