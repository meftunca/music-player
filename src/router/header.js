import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import SearchModal from '../components/yt/searchModal';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import MusicList from './../components/player/musicList';
import classNames from 'classnames';
import MUsicVideoIcon from '@material-ui/icons/MUsicVideo';
import Axios from 'axios';
import BottomPlayer from '../components/player/bottomPlayer';
import { observer, inject } from 'mobx-react';
import PlayGridList from './../components/player/list';
import Loader from './../components/loader';
import Icon from "@material-ui/core/Icon"

const drawerWidth = (window.innerWidth / 100) * 30;

const styles = (theme) => ({
	root: {
		display: 'flex',
		width: '100%',
	
	},
	appBar: {
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen
		}), boxShadow: "none",padding:drawerWidth/15
	},
	appBarShift: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		transition: theme.transitions.create(['margin', 'width'], {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen
		})
	},
	noShadow: {
		boxShadow: 'none'
	},
	grow: {
		flexGrow: 1
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20
	},
	title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block'
		}
	},
	hide: {
		display: 'none'
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth,
		backgroundColor: ' #5a3fb9',
		backgroundImage:
			'linear-gradient(19deg, #0d27c4 23%, #2170FD 57%, #B721FF 100%,#0d27c4 12%, )'
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: '0 8px',
		...theme.mixins.toolbar,
		justifyContent: 'space-around',
		'& *': {
			color: '#fff'
		}
	},
	heading: {
		padding: '15px 20px',
		backgroundColor: 'rgba(63,81,181,.35)',
		fontWeight: '400',
		margin: 0
	},
	search: {
		position: 'relative',
		minWidth: '50%',
		marginLeft: '5%',
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25)
		},
		marginLeft: '15% !important',
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			marginLeft: '10% !important',
			width: 'auto'
		}
	},
	searchIcon: {
		width: theme.spacing.unit * 9,
		height: '100%',
		position: 'absolute',
		pointerEvents: 'cursor',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	inputRoot: {
		color: 'inherit',
		width: '100%'
	},
	inputInput: {
		paddingTop: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
		paddingLeft: theme.spacing.unit * 10,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: 200
		}
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex'
		}
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none'
		}
	},
	between: {
		justifyContent: 'space-between'
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing.unit * 3,
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		marginLeft: -drawerWidth,
		marginTop:20
	},
	contentShift: {
		transition: theme.transitions.create('margin', {
			easing: theme.transitions.easing.easeOut,
			duration: theme.transitions.duration.enteringScreen,
		}),
		marginLeft: 0,
	},
	toolbar: {
		[theme.breakpoints.up('md')]: {
			width: "90%",
			marginLeft:"5%"
		},
	}
});

@inject('player')
@observer
class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			anchorEl: null,
			mobileMoreAnchorEl: null,
			openDr: false,
			openModal: false,
			searchParams: '',
			musics: [],
			loading: false
		};
		this.updateOpenModal = this.updateOpenModal.bind(this);
		this.drawerToggle = this.drawerToggle.bind(this);
	}
	componentDidMount = async () => {
		await Axios.post('http://localhost:8000/musics').then(({ data }) => {
			this.setState({ musics: data, loading: true });
		});
	};
	handleDrawerOpen = () => {
		this.setState({ openDr: true });
	};
	drawerToggle = () => {
		let { openDr } = this.state;
		if (openDr) this.handleDrawerClose();
		else this.handleDrawerOpen();
	};
	handleDrawerClose = () => {
		this.setState({ openDr: false });
	};
	updateOpenModal() {
		let { openModal } = this.state;
		this.setState({ openModal: !openModal });
	}
	search = async ({ target }) => {
		let { value } = target;
		this.setState({ searchParams: value });
	};
	keyPress = async (e) => {
		if (e.keyCode == 13) {
			let { value } = e.target;
			this.setState({ searchParams: value });
			if (value !== '') await this.open();
			// put the login here
		}
	};
	open = async () => {
		this.setState({ openModal: true });
	};
	handleProfileMenuOpen = (event) => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleMenuClose = () => {
		this.setState({ anchorEl: null });
		this.handleMobileMenuClose();
	};

	handleMobileMenuOpen = (event) => {
		this.setState({ mobileMoreAnchorEl: event.currentTarget });
	};

	handleMobileMenuClose = () => {
		this.setState({ mobileMoreAnchorEl: null });
	};

	render() {
		const {
			anchorEl,
			mobileMoreAnchorEl,
			openDr,
			loading,
			musics
		} = this.state;
		const { classes, player } = this.props;
		const { activePlayList } = player;
		const isMenuOpen = Boolean(anchorEl);
		const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
		const renderMenu = (
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMenuOpen}
				onClose={this.handleMenuClose}>
				<MenuItem onClick={this.handleClose}>Profile</MenuItem>
				<MenuItem onClick={this.handleClose}>My account</MenuItem>
			</Menu>
		);

		const renderMobileMenu = (
			<Menu
				anchorEl={mobileMoreAnchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMobileMenuOpen}
				onClose={this.handleMobileMenuClose}>
				<MenuItem>
					<IconButton color="inherit">
						<Badge
							className={classes.margin}
							badgeContent={4}
							color="secondary">
							<Icon>mail</Icon>
						</Badge>
					</IconButton>
					<p>Messages</p>
				</MenuItem>
				<MenuItem>
					<IconButton color="inherit">
						<Badge
							className={classes.margin}
							badgeContent={11}
							color="secondary">
							<Icon>notifications</Icon>
						</Badge>
					</IconButton>
					<p>Notifications</p>
				</MenuItem>
				<MenuItem onClick={this.handleProfileMenuOpen}>
					<IconButton color="inherit">
						<Icon>account_circle</Icon>
					</IconButton>
					<p>Profile</p>
				</MenuItem>
			</Menu>
		);
		if (loading === false) return <Loader status={loading} />; 

		return (
			<div className={classes.root}>
				<CssBaseline />
				<AppBar
					position="fixed"
					className={classNames(classes.appBar, {
						[classes.appBarShift]: openDr
					})}>
					<Toolbar className={classes.toolbar} disableGutters={!openDr} variant="dense">
						<IconButton
							color="inherit"
							aria-label="Open drawer"
							onClick={this.drawerToggle}
							className={classNames(
								classes.menuButton,
								openDr && classes.hide
							)}>
							<Icon>menu</Icon>
						</IconButton>
						<Typography
							className={classes.title}
							variant="title"
							color="inherit"
							noWrap>
							MusicPlayer
						</Typography>
						<div className={classes.search}>
							<div className={classes.searchIcon}>
								<IconButton
									aria-label="Added Icons"
									style={{ color: 'white', zIndex: '1000' }}
									onClick={() => this.open()}>
									<Icon>search</Icon>
								</IconButton>
							</div>
							<Input
								placeholder="Search…"
								disableUnderline
								classes={{
									root: classes.inputRoot,
									input: classes.inputInput
								}}
								onKeyDown={(e) => this.keyPress(e)}
								onChange={(e) => this.search(e)}
							/>
						</div>
						<div className={classes.grow} />
						<div className={classes.sectionDesktop}>
							<IconButton color="inherit">
								<Badge
									className={classes.margin}
									badgeContent={4}
									color="secondary">
									<Icon>mail</Icon>
								</Badge>
							</IconButton>
							<IconButton color="inherit">
								<Badge
									className={classes.margin}
									badgeContent={17}
									color="secondary">
									<Icon>notifications</Icon>
								</Badge>
							</IconButton>
							<IconButton
								aria-owns={isMenuOpen ? 'material-appbar' : null}
								aria-haspopup="true"
								onClick={this.handleProfileMenuOpen}
								color="inherit">
								<Icon>account_circle</Icon>

							</IconButton>
						</div> 
						<div className={classes.sectionMobile}>
							<IconButton
								aria-haspopup="true"
								onClick={this.handleMobileMenuOpen}
								color="inherit">
								<Icon>more</Icon>
							</IconButton>
						</div>
					</Toolbar>
				</AppBar>
				{renderMenu}
				{renderMobileMenu} 
				<Drawer
					className={classes.drawer}
					variant="persistent"
					anchor="left"
					open={openDr}
					classes={{ paper: classes.drawerPaper }}>
					<div className={classes.drawerHeader}>
						<Typography variant="subtitle1">OYNATMA LİSTELERİ</Typography>
						<IconButton onClick={this.handleDrawerClose}>
							<Icon>chevron_left</Icon>
						</IconButton>
					</div>
					<Divider />
					<MusicList />
				</Drawer>
				<main
					className={classNames(classes.content, {
						[classes.contentShift]: openDr,
					})} 
				>
						{activePlayList !== '' && (
							<PlayGridList data={activePlayList} />
						)}
					<BottomPlayer />
				</main>	
				<SearchModal
					open={this.state.openModal}
					params={this.state.searchParams}
					updateModal={this.updateOpenModal}
				/>
			</div>
		);
	}
}
Header.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
