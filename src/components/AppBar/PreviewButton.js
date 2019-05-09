import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    button: {
      margin: theme.spacing.unit
    }
  });


function PreviewButton(props) {
    const { classes } = props;
    return (
      <div>
        <Button 
          variant="outlined" 
          disabled={props.disabled} 
          color="secondary" 
          className={classes.button}
          onClick={props.onClick}
        >
            Preview Map
        </Button>
      </div>
    )
}

PreviewButton.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PreviewButton);