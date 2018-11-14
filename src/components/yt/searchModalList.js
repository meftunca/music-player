import React, {Fragment} from "react"
import PropTypes from "prop-types"
import {withStyles} from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction"
import ListItemText from "@material-ui/core/ListItemText"
import Checkbox from "@material-ui/core/Checkbox"
import Avatar from "@material-ui/core/Avatar"
import IconButton from "@material-ui/core/IconButton"
import CloudDownload from "@material-ui/icons/CloudDownload"
import Divider from "@material-ui/core/Divider"
import Button from "@material-ui/core/Button"
import LoaderButton from "./components/loadingDownloadButtons"
import {observer, inject} from "mobx-react"
import Loader from "../loader"
import LinearProgress from "@material-ui/core/LinearProgress"

const axios = require("axios")

const youtubeSearch = require("youtube-search")

const styles = theme => ({
	button: {
		margin: theme.spacing.unit
	},
	root: {
		width: "100%",
		// maxWidth: 360,
		backgroundColor: theme.palette.background.paper
	},
	listItem: {
		paddingTop: 2,
		paddingBottom: 2
	}
})
@inject("player")
@observer
class SearchModalList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {checked: [1], searchList: [], load: false, progress: {percent: 0}}
	}

	handleToggle = value => () => {
		const {checked} = this.state
		const currentIndex = checked.indexOf(value)
		const newChecked = [...checked]

		if (currentIndex === -1) {
			newChecked.push(value)
		} else {
			newChecked.splice(currentIndex, 1)
		}

		this.setState({
			checked: newChecked
		})
	}
	componentDidMount() {
		let q = JSON.parse(this.props.player.playList).all
		let opts = (youtubeSearch.YouTubeSearchOptions = {
			maxResults: 20,
			key: "AIzaSyDT7y_KlK1DiqoJDfzzJ763uS0el8L30Zc"
		})
		youtubeSearch(this.props.params, opts, (err, results) => {
			if (err) return console.log(err)
			this.setState({searchList: results, load: true})
			console.log("results", results)
			return results
		})
	}
	notify = (title, text) => {
		let notify = new Notification(title, { body: text });
		return this;
	}
	download = async datas => {
		await axios
			.post("http://localhost:8000/download", {data: datas})
			.then(d => {
				let status = d.data === true ? true : false
				this.notify(datas.title, "İndirme işlemine başladı" )
				this.setState({load: status})
				this.props.player.updateDownload(true)
			})
			.catch(e => console.log(e))
		this.val = setInterval(() => {
			axios
				.post("http://localhost:8000/progress", {id: datas.id})
				.then(({data}) => {
					// console.log("percent",data.percent)
					if (data.percent !== undefined) {
						let progress = this.state.progress
						progress = Object.assign(progress, {[datas.id]: data})
						this.setState({progress})
						if (data.percent > 95) {
							clearInterval(this.val)
							progress = Object.assign(progress, {[datas.id]: {percent: 100, time: "0", size: 0}})
							this.notify(datas.title, "İndirme işlemi tamamlandı")
							this.setState({ progress })
							this.props.player.allPlayList()
							this.forceUpdate()
						}
					}
					// if(data === {}) clearInterval(this.val)
				})
				.catch(e => clearInterval(this.val))
		}, 500)
	}
	componentWillUnmount() {
		clearInterval(this.val)
	}
	hasId = (data, id) => {
		let t = data.filter(i => i.id === id)
		return t.length > 0 ? true : false
	}
	render() {
		const {classes, player} = this.props
		let queryData = JSON.parse(player.playList).all
		const {searchList, load, progress} = this.state

		return (
			<div className={classes.root}>
				<List>
					{searchList.length < 1 && (
						<ListItem className={classes.listItem}>
							<Loader status={load} />{" "}
						</ListItem>
					)}
					{searchList !== [] &&
						searchList.map(
							(v, k) =>
								!this.hasId(queryData, v.id) && (
									<Fragment key={v.id}>
										<ListItem className={classes.listItem}>
											<Avatar alt={v.title} src={v.thumbnails.default.url} />
											<List>
												<ListItem className={classes.listItem}>
													<Button href={v.link} size="small">
														{v.title.substr(0, 40) + "..."}
													</Button>
												</ListItem>

												<ListItem className={classes.listItem}>
													<Button
														size="small"
														color="primary"
														href={"https://youtube.com/channel/" + v.channelId}
													>
														{v.channelTitle}
													</Button>
												</ListItem>
											</List>
											<ListItemSecondaryAction>
												<LoaderButton
													percent={progress[v.id] !== undefined ? progress[v.id].percent : 0}
													load={this.state.load}
													click={() => this.download(v)}
												/>
											</ListItemSecondaryAction>
										</ListItem>
										<Divider inset component="li" />
									</Fragment>
								)
						)}
				</List>
			</div>
		)
	}
}

SearchModalList.propTypes = {
	classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SearchModalList)
