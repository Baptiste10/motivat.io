import React from 'react'
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import SimpleDialogDemo from '../ChooseOption/SimpleDialog'
import styled from 'styled-components';
import './BottomAppBar.css'

const drawerWidth = 400;

const styles = theme => ({
  appBar: {
    top: 'auto',
    bottom: 0,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    
    hide: {
      display: 'none',
    },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}});

const StyledToolbar = styled(Toolbar)`
  align-items: center;
  justify-content: space-between;
`;

class BottomAppBar extends React.Component {

  handleRightDrawerOpen = () => {
    this.props.handleRightDrawerOpen()
  };

  handleLeftDrawerOpen = () => {
    this.props.handleLeftDrawerOpen()
  };

  handleSelectTranscriptClose = name => {
    this.props.handleClose(name)
  };

  handleSelectTranscriptClickOpen = () => {
    this.props.handleClickOpen();
  }



  render(){
    const { classes, leftOpen, rightOpen } = this.props;

    let transcriptDialog;
    transcriptDialog = 
    <SimpleDialogDemo 
      selectedTranscript={this.props.selectedTranscript}
      transcriptId={this.props.transcriptId}
      handleClose={this.handleSelectTranscriptClose}
      handleClickOpen={this.handleSelectTranscriptClickOpen}
      transcriptList={this.props.transcriptList}
    />

    return (
      <React.Fragment>
        <CssBaseline />
        <AppBar 
          position="fixed" 
          color="primary" 
          className={classNames(classes.appBar, {
            [classes.appBarShift]: leftOpen,
          })}
        >
          <StyledToolbar className="toolbar" disableGutters={!leftOpen || !rightOpen}>
              <IconButton 
                color="inherit"
                aria-label="Open Left drawer"
                onClick={this.handleLeftDrawerOpen}
                className={classNames(classes.searchButton, leftOpen && classes.hide)}
              >
                <SearchIcon />
              </IconButton>
            {transcriptDialog}
            <div>
              <IconButton 
                color="inherit" 
                aria-label="Open Right drawer"
                onClick={this.handleRightDrawerOpen}
                className={classNames(classes.mapButton, rightOpen && classes.hide)}
              >
                <MenuIcon />
              </IconButton>
            </div>
          </StyledToolbar>
        </AppBar>
      </React.Fragment>
    );
  }
  
  
}

BottomAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(BottomAppBar);
