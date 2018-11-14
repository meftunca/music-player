import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import SearchModalList from './searchModalList';
class SearchModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false,
		};
	}

	handleClickOpen = () => {
		this.forceUpdate()
		this.setState({ open: true });
	};
	handleClick = (par) => {
		this.forceUpdate()
		this.setState({ open: par });
	};

	handleClose = () => {
		this.forceUpdate()
		this.setState({ open: false });
		this.props.updateModal();
	};
    UNSAFE_componentWillReceiveProps(props) {
		this.forceUpdate()
	  this.handleClick(props.open);
       
	}
	render() {
		const { fullScreen } = this.props;

		return (
			<div>
				<Dialog
					fullScreen={fullScreen}
					open={this.state.open}
                    onClose={this.handleClose}
            aria-labelledby="responsive-dialog-title">
					<DialogTitle id="responsive-dialog-title">
                      Arama Sonuçları
					</DialogTitle>
					<DialogContent>
						<SearchModalList params={this.props.params} />
					</DialogContent>
					<DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                        Kapat
                        </Button>
                    </DialogActions>
				</Dialog>
			</div>
		);
	}
}

SearchModal.propTypes = {
	fullScreen: PropTypes.bool.isRequired
};

export default withMobileDialog()(SearchModal);
