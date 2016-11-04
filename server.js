
var express = require('express');
var bodyParser = require('body-parser');
var iTunes = require('itunes-sdk');
var app = express();


app.use(bodyParser.json());


app.get('/playing', function(req, res) {
	console.log('Accessing now playing...');
	iTunes.currentTrack(function(err, track) {
		if (err) {
			console.error(err);
			return res.status(500).send('Something broke!');
		}
		res.json(track);
	});
});

app.get('/play/state', function(req, res) {
	console.log('Getting play state...');
	iTunes.playState(function(err, state) {
		if (err) {
			console.error(err);
			return res.status(500).send('Something broke!');
		}
		res.json(state);
	});
});

app.post('/play/track', function(req, res) {
	console.log('Got a /play/track POST...');
	iTunes.playTrack(req.body.track, function(err, data) {
		if (err) {
			console.error(err);
			return res.status(500).send('Something broke!');
		}
		res.json({message: 'ok'});
	});
});

app.get('/search/', function(req, res) {
	req.params.type = 'all';
	searchTunes(req, res);
});
app.get('/search/:type', searchTunes);
function searchTunes(req, res) {
	console.log('Got a /search request...');
	console.log('Type of search: ', req.params.type);
	console.log('Found query=', req.query.query);
	console.log('Found playlist=', req.query.playlist);
	var query = req.query.query || '*';
	var type = req.params.type;
	var playlist = req.params.playlist;
	console.log('Using: ', {
		query: query,
		type: type,
		playlist: playlist
	});
	iTunes.search(query, type, playlist, function(err, results) {
		if (err) {
			console.error(err);
			return res.status(500).send('Something broke!');
		}
		console.log('Found results', results);
		res.json(results);
	});
};

app.put('/playlist', function(req, res) {
	var name = req.body.name;
	if (!name) {
		return res.status(400).send('Please include a name!');
	}
	iTunes.putPlaylist(name, function(err, playlist) {
		if (err) {
			console.error(err);
			return res.status(500).send('Something broke!');
		}
		console.log('Emptied playlist: ', playlist);
		res.json(playlist);
	});
});

app.put('/playlist/:id/tracks', function(req, res) {
	var trackIds = req.body;
	var playlistId = req.params.id;
	iTunes.putTracks(playlistId, trackIds, function(err) {
		if (err) {
			console.error(err);
			return res.status(500).send('Something broke!');
		}
		console.log('Put tracks into playlist!');
		res.json({message: 'ok'});
	});
});

app.post('/playlist/:id/play', function(req, res) {
	var playlistId = req.params.id;
	iTunes.playPlaylist(playlistId, function(err) {
		if (err) {
			console.error(err);
			return res.status(500).send('Something broke!');
		}
		console.log('Started playlist!');
		res.json({message: 'ok'});
	});
});

app.put('/volume', function(req, res) {
	var volume = parseInt(req.body.volume);
	volume = Math.max(0, Math.min(100, volume));
	iTunes.setVolume(volume, function(err, data) {
		res.json({message: 'ok'});
	});
});

app.post('/volume/adjustment', function(req, res) {
	var adjustment = parseInt(req.body.adjustment);
	adjustment = Math.max(-100, Math.min(100, adjustment));
	iTunes.adjustVolume(adjustment, function(err, data) {
		res.json({message: 'ok'});
	});
});

app.post('/play/search', function(req, res) {
	var search = req.body.query;
	console.log('Trying to hit a search: ' + search);
	iTunes.playSearch(search, null, function(err) {
		if (err) {
			console.error(err);
			return res.status(500).send('Something broke!');
		}
		console.log('Started music!');
		res.json({message: 'ok'});
	});
});

app.put('/device/active', function(req, res) {
	var device = req.body.device;
	console.log('Trying to set device to active: ' + device);
	iTunes.setDevice(device, function(err) {
		if (err) {
			console.error(err);
			return res.status(500).send('Something broke!');
		}
		console.log('Switched output device!');
		res.json({message: 'ok'});
	});
});

app.get('/device', function(req, res) {
	var device = req.body.device;
	console.log('Trying to get devices: ' + device);
	iTunes.getDevices(device, function(err, devices) {
		if (err) {
			console.error(err);
			return res.status(500).send('Something broke!');
		}
		console.log('Got output devices!');
		res.json(devices);
	});
});

app.put('/pause', function(req, res) {
	iTunes.pause(function(err) {
		if (err) {
			console.error(err);
			return res.status(500).send('Something broke!');
		}
		console.log('Paused!');
		res.json({message: 'ok'});
	});
});

app.put('/play', function(req, res) {
	iTunes.play(function(err) {
		if (err) {
			console.error(err);
			return res.status(500).send('Something broke!');
		}
		console.log('Paused!');
		res.json({message: 'ok'});
	});
});


app.listen(1337, '0.0.0.0', function() {
	console.log('listening on 0.0.0.0:1337...');
});





