import React, { Fragment, useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ToggleButton from '@material-ui/lab/ToggleButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';

const styles = (theme) => ({
	root: {
		display: 'flex',
		flexWrap: 'wrap',
		padding:5
	},
	margin: {
		margin: theme.spacing.unit
	},
	withoutLabel: {
		padding: '10px 0',
		marginTop: theme.spacing.unit * 3
	},
	textField: {
		flexBasis: '100%'
	}
});

const ITEM_HEIGHT = 60;

class PlayListMenu extends React.Component {
	state = {
		anchorEl: null
	};

	handleClick = (event) => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleClose = () => {
		this.setState({ anchorEl: null });
	};

	render() {
        const { anchorEl } = this.state;
		const open = Boolean(anchorEl);
		const { classes, playList,id,click} = this.props;
		
		return <Fragment>
				<ToggleButton aria-label="More" aria-owns={open ? 'long-menu' : undefined} value="center" aria-haspopup="true" onClick={this.handleClick} style={{ borderRadius: '50%', color: '#2196f3' }}>
					<PlaylistAddIcon />
				</ToggleButton>
				<Menu id="long-menu" anchorEl={anchorEl} open={open} onClose={this.handleClose} PaperProps={{ style: { maxHeight: ITEM_HEIGHT * 6, minWidth: 200 } }}>
					<MenuItem>
						<AddPlayList classes={classes} click={click} id={id} />
					</MenuItem>
					{playList.map((option, i) => (
						<MenuItem
						style={{height:ITEM_HEIGHT,paddingBottom:15}}
							key={i}
							onClick={() =>
								click({
									id: option.id,
									videoId: id,
									playList: option.name
								})
							}>
							{option.name.toLocaleUpperCase()}
						</MenuItem>
					))}
				</Menu>
			</Fragment>;
	}
}
const AddPlayList = ({ id, click, classes }) => {
	const [value, setValue] = useState('');
	return (
		<FormControl className={classNames(classes.margin, classes.textField)}>
			<InputLabel htmlFor="adornment-playListName">PlayList Oluşturun</InputLabel>
			<Input
				id="adornment-playListName"
				type={'text'}
				value={value}
				onChange={({ target }) => setValue(target.value)}
				endAdornment={
					<InputAdornment position="end">
						<IconButton
							aria-label="PlayList TextField"
							onClick={() =>
								value.length > 2
									? click({ id: id, playList: value })
									: alert('3 Karakterden daha az isim giremezsiniz.')
							}>
							<PlaylistAddIcon />
						</IconButton>
					</InputAdornment>
				}
			/>
		</FormControl>
	);
};
const NewPlayList = ({ id }) => {};
PlayListMenu.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PlayListMenu);
