import React, {Component} from "react"
import PropTypes from "prop-types"
import {withStyles} from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import Slider from "@material-ui/lab/Slider"
import Icon from "@material-ui/core/Icon"
import IconButton from "@material-ui/core/IconButton"
import {observer, inject} from "mobx-react"
import {Typography} from "@material-ui/core"
import PlayListMenu from "./playListMenu"
import Axios from "axios"

const styles = theme => ({
	root: {
		backgroundColor: "rgba(0,0,0,.75)",
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		borderRadius: 0,
		width: "100%",
		"& > *": {
			color: "#fff"
		}
	},
	rootSlider: {
		width: "90%",
		marginLeft: "5%",
		padding: 0
	},
	centerWhiteItem: {
		textAlign: "center",
		color: "#fff"
	},
	slider: {
		"& *": {
			backgroundColor: "#eee",
			color: "#eee"
		},
		"&:hover *": {
			backgroundColor: "#fff",
			color: "#fff"
		}
	},
	iconButton: {
		"& *": {
			color: "#fff"
		}
	},
	img: {
		width: "80%"
	}
})

@inject("player")
@observer
class BottomPlayer extends Component {
	constructor(props) {
		super(props)
		this.state = {
			currentTime: 0,
			play: false,
			audioData: {},
			soundValue:1,
			isPlayList: false,
			show: false,
			musicTime: 0,
			playLists: [],
			playListNames: []
		}
		this.audio = new Audio()
		this.audio.controls = true
		this.play = this.play.bind(this)
		this.pause = this.pause.bind(this)
	}
	timeConvert = time => {
		let minutes = parseInt(time / 60, 10),
			seconds = parseInt(time % 60) < 10 ? "0" + parseInt(time % 60) : parseInt(time % 60),
			curTime = minutes + ":" + seconds
		return curTime
	}
	componentWillUnMount = () => {
		this.audio = null
	}

	play = async () => {
		const {audioData, currentTime} = this.state
		if (audioData.file !== undefined) {
			this.audio.src = "musicFile/" + audioData.file
			this.audio.play()
			this.audio.currentTime = 0

			this.audio.volume = this.state.soundValue
			this.audio.onplaying = () => {
				if (this.audio.readyState > 0) {
					this.takeTInt = setInterval(() => {
						this.setState({currentTime: this.audio.currentTime})
						if (this.audio.played) {
							if (this.audio.ended) {
								if (!this.audio.loop) {
									clearInterval(this.takeTInt)
									this.setState({currentTime: 0, play: false})
								} else {
									this.setState({currentTime: 0, play: true})
									this.play()
								}
							}
						}
					}, 1000)
				}
			}
			this.audio.onended = () => {
				this.next()
			}
			this.takeTOut = setTimeout(() => {
				this.setState({musicTime: this.audio.duration})
				clearTimeout(this.takeTOut)
			}, 100)
			this.audio.ended
		} else {
			new Notification("Dosya bulunamadı!", {body: "Dosya yolunda ismi belirtilen dosya bulunamadı..."})
		}
	}
	pause = () => {
		this.audio.pause()
	}
	loop = () => {
		this.audio.loop = true
	}
	handleChangePlayTime = (event, value) => {
		this.audio.currentTime = value
		this.setState({currentTime: value})
	}
	handleChangeSound = (event, value) => {
		this.setState({soundValue: value})
		this.audio.volume = value
		if (value === 0) this.audio.muted = true
		else this.audio.muted = false
	}
	togglePlay(status) {
		this.setState({play: status})
		return status ? this.play() : this.pause()
	}
	addPlayList = async data => {
		await Axios.post("http://localhost:8000/playlist-add", data).then(async ({data}) => {
			await this.props.player.allPlayList()
		})
	}

	UNSAFE_componentWillUpdate(prevProps, prevState) {
		let {activeMusic, pause} = this.props.player
		activeMusic = typeof activeMusic !== Object && activeMusic !== "" ? JSON.parse(activeMusic) : activeMusic
		if (prevState.audioData.id !== activeMusic.id) {
			this.setState({
				audioData: activeMusic,
				show: true,
				play: true
			})
			setTimeout(() => {
				this.play()
			}, 100)
		}
	}
	next =async () => {
		let id = this.state.audioData.id,
			data = await  JSON.parse(this.props.player.activePlayList),
			index = data.map(fruit => fruit.id === id).lastIndexOf(true)  
		if (index == data.length - 1) {
			index = 0
		} else {
			index = index + 1
		}
		await this.props.player.updateActiveMusic(JSON.stringify(data[index]))
		this.setState({audioData: data[index], currentTime: 0})
		this.play()
	}
 
	prev = async () => {
		let id = this.state.audioData.id,
			data =  await JSON.parse(this.props.player.activePlayList),
			index = data.map(fruit => fruit.id === id).lastIndexOf(true)	 
		if (index == 0) {
			index = data.length - 1;
		} else {
			index = index - 1;
		}
		await this.props.player.updateActiveMusic(JSON.stringify(data[index]))
		this.setState({ audioData: data[index], currentTime: 0 })
		this.play()
	}
 
	render() {
		const {classes, player} = this.props
		const {playListNames} = this.state
		let {activeMusic} = player
		activeMusic = typeof activeMusic !== Object && activeMusic !== "" ? JSON.parse(activeMusic) : activeMusic
		let {currentTime, play, soundValue, isPlayList, show, musicTime} = this.state
		let currentTimeConvert = this.timeConvert(currentTime),
			musicTimeConvert = this.timeConvert(musicTime)
		if (show === false) return <a />
		return (
			<Paper className={classes.root}>
				<Grid container justify="center" alignItems="center" alignContent="center">
					<Grid xs={3} item>
						<Grid container justify="center" alignItems="center">
							<img
								src={activeMusic.thumbnails.default.url}
								className={classes.img}
								style={{
									maxWidth: activeMusic.thumbnails.default.width,
									maxHeight: activeMusic.thumbnails.default.height
								}}
							/>
						</Grid>
					</Grid>
					<Grid xs={6} item>
						<Grid container justify="center" alignItems="center" alignContent="center">
							<Grid xs={12} item style={{marginBottom: 20}}>
								<Typography className={classes.centerWhiteItem}>{activeMusic.title}</Typography>
							</Grid>
							<Grid xs={2} item>
								<Typography className={classes.centerWhiteItem}>{currentTimeConvert}</Typography>
							</Grid>
							<Grid xs={8} item>
								<div className={classes.rootSlider}>
									<Slider
										classes={{container: classes.slider}}
										value={currentTime}
										min={0}
										max={musicTime}
										step={0.1}
										onChange={this.handleChangePlayTime}
									/>
								</div>
							</Grid>
							<Grid xs={2} item>
								<Typography className={classes.centerWhiteItem}>{musicTimeConvert}</Typography>
							</Grid>
							<Grid container justify="center" alignItems="center" alignContent="center" gutters={8}>
								<Grid xs={4} item style={{textAlign: "right"}}>
									<IconButton className={classes.iconButton} onClick={this.prev.bind(this)}>
										<Icon>skip_previous</Icon>
									</IconButton>
								</Grid>
								<Grid xs={4} item style={{textAlign: "center"}}>
									<IconButton className={classes.iconButton} onClick={() => this.togglePlay(!play)}>
										<Icon>{play ? "pause" : "play_arrow"}</Icon>
									</IconButton>
								</Grid>
								<Grid xs={4} item style={{textAlign: "left"}}>
									{" "}
									<IconButton className={classes.iconButton} onClick={this.next.bind(this)}>
										<Icon>skip_next</Icon>
									</IconButton>
								</Grid>
							</Grid>
						</Grid>
					</Grid>
					<Grid xs={3} item>
						<Grid container justify="center" alignItems="center">
							<Grid xs={6} item>
								<div className={classes.rootSlider}>
									<Slider
										classes={{container: classes.slider}}
										value={soundValue}
										min={0}
										max={1}
										step={0.1}
										onChange={this.handleChangeSound}
									/>
								</div>
							</Grid>
							<Grid xs={6} item>
								{activeMusic.playListId === undefined ? (
									<PlayListMenu
										click={this.addPlayList.bind(this)}
										id={activeMusic.videoId}
										playList={playListNames}
									/>
								) : (
									<IconButton className={classes.iconButton} onClick={() => this.togglePlay(play)}>
										<Icon>playlist_add_chech</Icon>
									</IconButton>
								)}

								<IconButton className={classes.iconButton} onClick={() => this.loop()}>
									<Icon>replay</Icon>
								</IconButton>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Paper>
		)
	}
}

BottomPlayer.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(BottomPlayer)
