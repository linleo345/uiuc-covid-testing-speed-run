var express = require('express');
var fs = require('fs')
var app = express();
var https = require('https')

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

console.log('Server Launched');

https.createServer({
	key: fs.readFileSync('src/server/server.key'),
	cert: fs.readFileSync('src/server/server.cert')
}, app)
.listen(3000, function () {
	console.log('listening on port 3000. goto https://localhost:3000/')
})
