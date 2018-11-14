;(function() {
	"use strict"
	const fs = require("fs")
	const orm = require("./orm")
	const express = require("express")
	const {urlencoded, json} = require("body-parser")
	const path = require("path")
	const uniqid = require("uniqid")
	const horizon = require("horizon-youtube-mp3")
	const cors = require("cors")
	require("dotenv").load()
	const FfmpegCommand = require('fluent-ffmpeg');
	FfmpegCommand.setFfmpegPath(path.join(__dirname) +"/ffmpeg")
	const downloadPath = path.join(__dirname) + "/../public/musicFile"
	const app = express()
	const port = 8000
	let progress = {},pstatus = false
	const download = (id, datas) => {
		horizon.downloadToLocal(
			datas.link,
			downloadPath,
			id,
			null,
			null,
			(err, result) => {
				if (result) orm.addMusic(datas)
			},
			(percent, timemark, targetSize) => { 
				progress[datas.id] = { percent: percent, time: timemark, size: targetSize } 
				console.log(progress)
				// console.log("Progress:", percent, "Timemark:", timemark, "Target Size:", targetSize)
				// Will return...
				// Progress: 90.45518257038955 Timemark: 00:02:20.04 Target Size: 2189
				// Progress: 93.73001672942894 Timemark: 00:02:25.11 Target Size: 2268
				// Progress: 100.0083970106642 Timemark: 00:02:34.83 Target Size: 2420
			}
		)
	}
	app.use(cors())
	app.use(urlencoded({extended: false}))
	app.use(json())
	app.use((req, res, next) => {
		res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		res.header("Access-Control-Allow-Origin", "*")
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
		next()
	})
	app.use(express.static(path.join(__dirname, "public")))
	
	//@download
	app.post("/download", (req, res, next) => {
		let datas = req.body.data
		let query = orm.hasMusics(datas.id)
		if (query === 0) {
			let id = uniqid() + ".mp3"
			datas.file = id
			download(id, datas)
			res.json({status: true})
			return
		}
		res.json({status: false})

		//next()
	})

	//@delete
	app.delete("/delete", async (req, res, next) => {
		let file = req.body.file,
			path = process.cwd() + "/public/musicFile/" + file
			orm.removeMusic(file)
		try {
			fs.unlinkSync(path)
			res.send(true)
		} catch (e) {
			res.send(e)
			}
	
	//  next()
	})

	//@progress
	app.post("/progress", (req, res, next) => {
		let id = req.body.id
		console.log("progress",progress[id])
		res.jsonp(progress[id])
		// next()
	})
	//get all music
	app.post("/musics", (req, res, next) => {
		res.send(JSON.stringify(orm.allMusics()))
		next()
	})

	// @ $playlist

	// @set
	app.post("/playlist-add", (req, res, next) => {
		let id = orm.addPlayerList(req.body)
		res.send(JSON.stringify(orm.updateMusics({id: req.body.id, playerListId: id, title: req.body.playList})))
		next()
	})

	//@get
	app.post("/playlist-get", (req, res, next) => {
		res.send(JSON.stringify(orm.getPlayerList(req.body.id)))
		next()
	})
	//combine with all data (music and playList)

	//@all
	app.post("/playlist-all", (req, res, next) => {
		res.send(JSON.stringify(orm.allPlayerList()))
		next()
	})

	app.listen(port)
	module.exports = app
})()
