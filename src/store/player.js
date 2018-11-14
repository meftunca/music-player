import { observable, action } from 'mobx';
import Axios from '../../node_modules/axios/index';

class Store {
	constructor() {
		localStorage.clear()
		this.getLocalData()
		setTimeout(() => {
			setInterval(() => {
				this.allPlayList()
			}, 30000)
		},30000)
	}
	@observable localData = {}
	@action getLocalData = async () => {
		let data = await localStorage.getItem("cache")
		if (data !== null && data !== undefined) {
			data = Object.assign(this.localData, JSON.parse(data))
			this.localData = data
		}
	}
	@action saveLocalData = async () => {
		localStorage.clear()
		await localStorage.setItem("cache", JSON.stringify(this.localData))
	}
	@observable playListName = ""
	@observable playList = ""
	@observable activePlayList = ""
	@observable activeMusic = ""
	@observable pause = false
	@observable download = false
	@action
	updatePlayListName = data => {
		this.playListName = data
		this.localData.playListName = data
		this.saveLocalData()
	}
	@action
	updateActivePlayList = data => {
		this.activePlayList = data
		this.localData.activePlayList = data
		this.saveLocalData()
	}
	@action
	updatePlayList = data => {
		this.playList = data
		this.localData.playList = data
		this.saveLocalData()
	}
	@action
	updateActiveMusic = data => {
		this.activeMusic = data
		this.localData.activeMusic = data
		this.saveLocalData()
	}
	@action
	updatePause = status => {
		this.pause = status
		this.localData.pause = status
		this.saveLocalData()
	}
	@action
	updateDownload = status => {
		this.download = status
		this.localData.download = status
		this.saveLocalData()
	}
	@action
	allPlayList = async () => {
		await Axios.post("http://localhost:8000/playlist-all").then(async ({ data }) => {
			this.playList = JSON.stringify(data)
		})

	}
}
const Player = new Store();
export default Player;
