var ScriptOut = require('./src/script-out');

function adjustVolume(delta, callback) {
	iTunes.getVolume(function(err, volume) {
		console.log('Found volume: ', volume);
		console.log('Delta volume: ', delta);
		var newVolume = Math.min(100, Math.max(0, volume + delta));
		iTunes.setVolume(newVolume, callback);	
	});
}

function playSearch(search, playlist, callback) {
	iTunes.search(search, null, null, function(err, results) {
		if (err) {
			console.error(err);
			return callback(err);
		}
		var playlistName = playlist || 'iTunes SDK Playlist';
		console.log('Putting a playlist: ' + playlistName);
		iTunes.putPlaylist(playlistName, function(err, list) {
			if (err) {
				console.error(err);
				return callback(err);
			}
			if (!results.length) {
				var msg = 'No tracks found.';
				console.error(msg);
				return callback(msg);
			}
			console.log('Adding a single track first...');
			iTunes.putTracks(list.persistentID, [persistentID(results.shift())], function(err) {
				if (err) {
					console.error(err);
					return callback(err);
				}
				console.log('Playing the single track playlist before adding more...');
				iTunes.playPlaylist(list.persistentID, function(err) {
					if (err) {
						var msg = 'Could not start playlist.';
						console.error(msg);
						return callback(msg);
					}
					if (!results.length) {
						return callback();
					}
					console.log('Proceeding with other track additions...');
					iTunes.putTracks(list.persistentID, results.map(persistentID), callback);
				});
			});
		});
	});
}

function persistentID(obj) {
	return obj.persistentID;
}

var iTunes = {
	adjustVolume: adjustVolume,
	back: ScriptOut('back'),
	currentTrack: ScriptOut('currentTrack'),
	debug: ScriptOut('debug'),
	getData: ScriptOut('getLibraryData'),
	getDevices: ScriptOut('getDevices'),
	getVolume: ScriptOut('getVolume'),
	listPlaylists: ScriptOut('listPlaylists'),
	next: ScriptOut('next'),
	pause: ScriptOut('pause'),
	play: ScriptOut('play'),
	playerState: ScriptOut('playerState'),
	playPlaylist: ScriptOut('playPlaylist', ['playlistId']),
	playSearch: playSearch,
	playTrack: ScriptOut('playTrack', ['specifier']),
	previous: ScriptOut('previous'),
	putPlaylist: ScriptOut('putPlaylist', ['name']),
	putTracks: ScriptOut('putTracks', ['playlistId', 'trackIds']),
	search: ScriptOut('search', ['query', 'type', 'playlist']),
	setDevice: ScriptOut('setDevice', ['device']),
	setVolume: ScriptOut('setVolume', ['volume']),
	stop: ScriptOut('stop')
};

module.exports = iTunes;
