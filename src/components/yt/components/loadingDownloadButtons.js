import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import CloudDownload from '@material-ui/icons/CloudDownload';

const styles = (theme) => ({
	root: {
		display: 'flex',
		alignItems: 'center'
	},
	wrapper: {
		margin: theme.spacing.unit,
		position: 'relative'
	},
	buttonSuccess: {
		backgroundColor: green[500],
		'&:hover': {
			backgroundColor: green[700]
		}
	},
	fabProgress: {
		color: green[500],
		position: 'absolute',
		top: -6,
		left: -6,
		zIndex: 1
	},
	buttonProgress: {
		color: green[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	}
});
class LoaderButton extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			success: false
		};
	}

	componentWillUnmount() {
		clearInterval(this.timer);
	}

	handleButtonClick = () => {
		if (!this.state.loading) {
			this.props.click();
			this.setState(
				{
					success: false,
					loading: true
				},
				() => {
					this.timer = setInterval(() => {
						if (this.props.load === true) {
                            clearInterval(this.timer);
							this.setState({
								loading: false,
								success: true
							});
							this.forceUpdate()
						}
					}, 1000);
				}
			);
		}
	};

	render() {
		const { loading, success } = this.state;
		const { classes, load, percent } = this.props;
		const buttonClassname = classNames({
			[classes.buttonSuccess]: success
		});
		return (
			<div className={classes.root}>
				<div className={classes.wrapper}>
					<IconButton
						variant="fab"
						className={buttonClassname}
						onClick={this.handleButtonClick}>
						{success ? <CloudDownload style={{color:"#fff"}}/> : <CloudDownload disabled />}
					</IconButton>
					{loading && (
						<CircularProgress size={64} variant="static" value={percent} className={classes.fabProgress} />
					)}
				</div>
			</div>
		);
	}
}

LoaderButton.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(LoaderButton);
