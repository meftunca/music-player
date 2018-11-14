import React, {Component, Fragment} from "react"
import PropTypes from "prop-types"
import {withStyles} from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Avatar from "@material-ui/core/Avatar"
import ListSubheader from "@material-ui/core/ListSubheader"
import IconButton from "@material-ui/core/IconButton"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import {observer, inject} from "mobx-react"
import Icon from "@material-ui/core/Icon"
import Divider from "@material-ui/core/Divider"
import Loader from "./../loader"
import Grid from "@material-ui/core/Grid"
import Axios from "../../../node_modules/axios/index";

const styles = theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
		justifyContent: "space-around",
		overflow: "hidden",
		backgroundColor: "transparent",
		margin:"80px 0",
		"& *": {
			color: "#fff"
		}
	},
	gridList: {
		width: "100%",
		height: "100%",
		padding: "5%"
		// margin: '20px 0 !important'
	},
	icon: {
		color: "rgba(255, 255, 255, 0.54)"
	},
	listItemBg: {
		backgroundColor: "rgba(0,0,0, 0.54)",
		margin:"10px 0"
	}
})

@inject("player")
@observer
class PlayGridList extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			loader: true,
			ruleCount: 5,
			activeMusic: "",
			cols: 4
		}
	}
	resize = () => {
		this.setState({cols: Math.round(window.innerWidth / 320)})
	}
	componentDidMount() {
		window.addEventListener("resize", this.resize)

		this.val = setInterval(() => {
			let {activePlayList, playList} = this.props.player
			if (playList !== "") {
				let cols = window.innerWidth,
					data = JSON.parse(playList),
					width = 320

				cols = Math.round(cols / width)
				this.setState({
					data: data,
					loader: false,
					cols: cols
				})
				clearInterval(this.val)
			} else {
				if (this.state.loader === false) {
					this.setState({loader: true})
				}
			}
		}, 100)
		console.log("this.state.data.length", this.state.data.length, this.props.player)
	}
	componentWillUnmount() {
		window.removeEventListener("resize", this.resize)
	}
	UNSAFE_componentWillReceiveProps(props) {
		if (this.state.data.length !== Object.values(JSON.parse(this.props.player.playList))[0].length) {
			this.setState({data: JSON.parse(this.props.player.playList)})
		}
	}
	addedMusicDataForStore = async (data, list) =>  {
		const {updateActiveMusic, updatePause, updateActivePlayList} = this.props.player
		await updateActiveMusic(JSON.stringify(data))
		await updateActivePlayList(JSON.stringify(list))
		await updatePause(false)
	}
	notify = title => {
		new Notification(title)
		return this;
	}
	deleteMusic = async (file) => {
		this.notify("Dosya silinmeye başladı")
		await Axios.delete("http://localhost:8000/delete", { data:{file:file} }).then(async ({ data }) => {
			if(data) this.notify("Silme işlemi başarılı bir şekilde bitti...")
			else this.notify("Silme işlemi başarısız oldu...")
			setTimeout(() => {
				this.props.player.allPlayList()
			}, 300);
		})
	}
	render() {
		const {classes} = this.props
		const {data, loader, cols} = this.state
		if (loader && data.all === undefined) return <Loader />
		return (
			<Fragment>
			
				{data.all !== [] &&
					Object.entries(data).map(([k, v], i) => (
						<div className={classes.root} key={i}>
							<Grid container>
								<Grid item xs={12} key="Subheader" style={{height: "auto"}}>
									<ListSubheader component="div" style={{padding: "40px 0", textAlign: "center"}}>
										<Icon className="spinner" style={{marginBottom: -10, marginRight: 10}} fontSize="large">
											slow_motion_video
										</Icon>
										{k === "all" ? "TÜM MÜZİKLER" : k.toLocaleUpperCase()}
									</ListSubheader>
								</Grid>
								<Grid item xs={12}>
									<List>
									{v.map((tile, k) => (
										<ListItem key={k} className={classes.listItemBg}>
											<Avatar>
												<img src={tile.thumbnails.high.url} alt={tile.title} />
											</Avatar>
											<ListItemText primary={tile.title} secondary={"Channel:" + tile.channelTitle} />
											<ListItemSecondaryAction>
												<IconButton
													className={classes.icon}
													onClick={() => this.deleteMusic(tile.file)}
												>
													<Icon>delete_forever</Icon>
												</IconButton>
												<IconButton
													className={classes.icon}
													onClick={() => this.addedMusicDataForStore(tile, v)}
												>
													<Icon>play_arrow</Icon>
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
										))}
									</List>
								</Grid>
							</Grid>
						</div>
					))}
			</Fragment>
		)
	}
}

PlayGridList.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(PlayGridList)
