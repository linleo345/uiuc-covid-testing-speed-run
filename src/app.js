var express = require('express');
var fs = require('fs')
var app = express();
var https = require('https')
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var multer = require('multer');
var creds = require('./mongo-creds.js');

mongoose.connect(creds.creds, { useNewUrlParser: true });

var Item = new Schema({
	img: {
		data: Buffer,
		contentType: String
	},
	record: {
		name: String,
		category: String,
		time: String

	}
})
var Item = mongoose.model('speed_run_recordings', Item);

app.use(multer({ dest: './uploads/',
	rename: function (fieldname, filename) {
		return filename;
	},
}).single("image"));


app.post('/upload', function(req, res) {
	//console.log(req)
	
	var newItem = new Item();
	newItem.img.data = fs.readFileSync(req.file.path);
	newItem.img.contentType = 'image/png';

	newItem.record.category = 'any%';
	newItem.record.name = req.body.name;
	newItem.record.time = req.body.time;

	newItem.save();

	console.log("file sent");
	fs.unlinkSync(req.file.path);


	res.send('OK');
	
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.get('/upload', function(req, res) {
	res.sendFile(__dirname + '/client/upload.html');
});

app.get('/leaderboard', function(req, res) {
	const leaderboard = new Item();

	var callback = (err) => {
		if(err) throw err;
		console.log('its saved!');
	}

	Item.find({}, (err, data) => {
		if(err) {
			console.log(err);
		}
		else {
			const the_bytes = data[0]['img']['data'];
			//const uinteightarray = new Uint8Array(Buffer.from(the_bytes));
			
			
			res.send(data[0]['img']['data'], data[1]['img']['data']);
		}

	});

});

console.log('Server Launched');

https.createServer({
	key: fs.readFileSync('src/server/server.key'),
	cert: fs.readFileSync('src/server/server.cert')
}, app)
.listen(3000, function () {
	console.log('listening on port 3000. goto https://localhost:3000/')
})
