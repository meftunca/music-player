const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const { app } = require('electron')
require("dotenv").load()
let fP = process.env.dev === false ? app.getAppPath("appData") + "musicPlayerDb.json" : "musicPlayerDb.json";
const adapter = new FileSync(fP, {
	defaultValue: {playerList: [], musics: []}
})
const db = low(adapter);
const TİmeStamps = { created_at: Date, uniqid: Date.now() };
const uniqid = require("uniqid")
class ORM {
	constructor() {
	}
	addMusic(data) {
		if (typeof data === String) return;
		db.get('musics')
			.push(Object.assign(data, TİmeStamps))
			.write();
	}
	hasMusics(id) {
		return	db.get("musics").filter({ videoId:id })
			.size()
			.value();
	}
	getMusics(id) {
		let data = db.get('musics').sortBy('created_at');
		data = data.filter((i) => i.playerListId === id);

		return data.value();
	}
	allMusics() {
		let data = db
			.get('musics')
			.sortBy('created_at')
			.value();
		return data;
	}
	updateMusics(data) {
		let update = db
			.get('musics')
			.find({ videoId: data.id })
			.assign({ playerListId: data.playerListId })
			.write();
		console.log(data);
		return update;
	}
	removeMusic(file) {
		db.get('musics')
			.remove({file:file})
			.write();
	}
	// PlayerList @imp
	addPlayerList(data) {
		db.get("musics")
			.remove()
			.write()
		let id = uniqid();
		let query = db.get('playerList');
		let d = query
			.filter({ id: data.id })
			.size()
			.value();
		
		console.log('quuery', d, 'db data=>', data, 'query=>', { id: data.id });
		if (d < 1) {
			query
				.push(Object.assign({ id: id, name: data.playList }, TİmeStamps))
				.write();
			this.updateMusics({ id: data.videoId, playerListId: data.id });
		} else {
			this.updateMusics({ id: data.videoId, playerListId: data.id });
		}
		return id;
	}
	getPlayerList(id) {
		let list = db
			.get('playerList')
			.find({ id: id })
			.sortBy('created_at')
			.value();
		// console.log(list);
		return list;
	}
	allPlayerList() {
		let list = db
				.get('playerList')
				.sortBy('uniqid')
				.value(),
			data = {};
		list.map((i) => {
			data[i.name] = this.getMusics(i.id);
			if (data[i.name] === [])
				data[i.name] = [{ playerListId: i.id, name: i.name }];
		});
		// data['other'] = this.getMusics(undefined);
		data['all'] = this.allMusics();
		return data;
	}
	removelayerList(id) {
		db.get('playerList')
			.remove({ id })
			.write();
	}
}

module.exports = new ORM();
