import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = (theme) => ({
	grow: {
		flexGrow: 1
	},
	fullPage: {
		height: 'calc(100vh - ' + 64 + 'px)',
        display: 'flex',
        width:"100%",
		justifyContent: 'center',
		alignContent: 'center',
		alignItems: 'center',
        flexFlow: 'column wrap',
       
	},
});
const Loader = ({status,classes}) => {
    if (status === false || status === undefined) {
			return <div className={classes.fullPage}>
					<CircularProgress className={classes.progress} />
					<h4 style={{ color: '#fff' }}>Veriler Yükleniyor</h4>
				</div>;
        }
        return <a/>
}
Loader.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Loader);
