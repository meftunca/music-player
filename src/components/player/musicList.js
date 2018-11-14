import React, {Fragment} from "react"
import PropTypes from "prop-types"
import {withStyles} from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Divider from "@material-ui/core/Divider"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import Avatar from "@material-ui/core/Avatar"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import PauseIcon from "@material-ui/icons/Pause"
import PlaylistPlayIcon from "@material-ui/icons/PlaylistPlay"
import ListSubheader from "@material-ui/core/ListSubheader"
import {observer, inject} from "mobx-react"
import ToggleButton from "@material-ui/lab/ToggleButton"
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup"
import PlayListMenu from "./playListMenu"
import Axios from "axios"
import Badge from "@material-ui/core/Badge"
import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

const styles = theme => ({
	root: {
		width: "100%",
		"& *": {
			color: "white"
		}
	},
	listItemTextPrimary: {
		fontSize: "0.85em" //Insert your required size
	},
	listItemTextSec: {
		fontSize: "0.8em" //Insert your required size
	},
	btnGroup: {
		backgroundColor: "transparent",
		boxShadow: "none",
		"& *": {
			backgroundColor: "transparent",
			padding: "0",
			minWidth: 30,
			"&:after": {
				backgroundColor: "transparent"
			}
		}
	},
	noPad: {
		width: "100%",
		paddingLeft: "0",
		paddingRight: "0"
	},
	scroll: {
		maxHeight: 500,
		overflowY: "scroll",
		width: "100%",
		position: "relative"
	},
	collapse: {
		backgroundColor: "transparent",
		boxShadow: "none",
		padding: "0",
		margin: "10px 0",
		"& *": {
			backgroundColor: "transparent"
		}
	},
	margin: {
		marginRight: theme.spacing.unit * 3
	},

	badge: {
		fontSize: ".7em",
		right: -15,
		top: 0,
		bottom: 0,
		width: 20,
		height: 20
	}
})
@inject("player")
@observer
class MusicList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedIndex: 1,
			activeMusic: "",
			play: true,
			playLists: [],
			expanded: "all",
			playListNames: []
		}
		this.addedMusicDataForStore = this.addedMusicDataForStore.bind(this)
		this.activePlayListDefine = this.activePlayListDefine.bind(this)
	}
	componentDidMount = async () => {
		await this.props.player.allPlayList();
		await this.setState({ playLists: JSON.parse(this.props.player.playList) })
	}
	componentWillUnmount = () => {
		clearInterval(this.timer)
	}

	handleExpandedChange = panel => (event, expanded) => {
		this.setState({
			expanded: expanded ? panel : false
		})
	}
	handleListItemClick = (event, index) => {
		this.setState({selectedIndex: index})
	}
	async addedMusicDataForStore(data) {
		const {updateActiveMusic, updatePause} = this.props.player
		if (this.state.activeMusic !== data.videoId) {
			this.setState({activeMusic: data.videoId})
			await updateActiveMusic(JSON.stringify(data))
			await updatePause(false)
		}
	}
	addPlayList = async data => {
		await Axios.post("http://localhost:8000/playlist-add", data).then(async ({data}) => {
			await this.props.player.allPlayList()
		})
	}

	UNSAFE_componentWillReceiveProps(props) {
		if (props.player.download !== this.props.player.download) {
			this.allPlayList()
			console.log("yeni veriler", this.state.playLists)
		}
	}
	activePlayListDefine = async (data, playList) => {
		await this.props.player.updateActivePlayList(data)
	}
	render() {
		const {classes, data, expanded} = this.props
		const { activeMusic, playLists, playListNames } = this.state
		if (playLists === []) return <a />
		return (
			<div className={classes.root}>
				{Object.entries(playLists).map((i, k) => {
					let data = i[1],
						name = i[0],
						expanded = name === "all" ? {defaultExpanded: true} : {defaultExpanded: false}
					if (name == "all") {
						this.activePlayListDefine(
							JSON.stringify({
								[name]: data
							}),
							JSON.stringify(data)
						)
					}
					return (
						<ExpansionPanel
							key={k}
							{...expanded}
							className={classes.collapse}
							onClick={() =>
								this.activePlayListDefine(
									JSON.stringify({
										[name]: data
									}),
									JSON.stringify(data)
								)
							}
						>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
								<Badge className={classes.margin} badgeContent={data.length}>
									<PlaylistPlayIcon />
								</Badge>
								<Typography variant="subtitle2">
									{name === "all" ? "Tüm Müziklerim".toLocaleUpperCase() : name.toLocaleUpperCase()}
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails className={(classes.noPad, classes.root)}>
								<List component="nav" className={(classes.noPad, classes.root, classes.scroll)}>
									{data.map((value, k) => (
										<Fragment key={k}>
											<Divider />
											<ListItem key={value.id} className={classes.noPad} button>
												<Avatar alt={value.title} src={value.thumbnails.default.url} />
												<ListItemText
													primaryTypographyProps={{
														variant: "subtitle2",
														noWrap: true
													}}
													secondaryTypographyProps={{
														variant: "overline"
													}}
													primary={
														value.title.length > 20 ? value.title.substr(0, 20) + "..." : value.title
													}
													secondary={
														value.channelTitle.length > 20
															? value.channelTitle.substr(0, 20) + "..."
															: value.channelTitle
													}
												/>
												<ListItemSecondaryAction>
													<ToggleButtonGroup value={"center"} exclusive className={classes.btnGroup}>
														{value.playerListId === undefined && (
															<PlayListMenu
																click={this.addPlayList.bind(this)}
																id={value.videoId}
																playList={playListNames}
															/>
														)}
														<ToggleButton
															value="center"
															onClick={() => this.addedMusicDataForStore(value, data)}
															style={{
																borderRadius: "50%"
															}}
														>
															{activeMusic === value.videoId ? (
																<PauseIcon fontSize="small" />
															) : (
																<PlayArrowIcon fontSize="small" />
															)}
														</ToggleButton>
													</ToggleButtonGroup>
												</ListItemSecondaryAction>
											</ListItem>
										</Fragment>
									))}
								</List>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					)
				})}
			</div>
		)
	}
}

MusicList.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(MusicList)
