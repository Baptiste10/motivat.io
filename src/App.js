import React, { Component } from 'react';
import './App.css';

import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import PersistentDrawerLeft from './components/PersistentDrawerLeft'
import PersistentDrawerRight from './components/PersistentDrawerRight'
import MongoStitch from './StitchApp/MongoStitch'
import PreviewButton from './components/PreviewButton'
import BottomAppBar from './components/BottomAppBar'

const drawerWidth = 400;

const db = new MongoStitch();


const styles = theme => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
})

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      leftDrawerOpen: false,
      rightDrawerOpen: false,
      transcriptId: null,
      transcriptOwners: [],
      setSelectedTranscript: 'No transcript picked',
      transcriptList: [],
      previewButtonEnabled: true
    };

  }

  handleSelectTranscriptClose = name => {
    db.getTranscriptId(name).then(
      id => {db.getTranscriptOwners(id).then(
        owners => {
          this.setState({
          selectedTranscript: name,
          transcriptId: id,
          transcriptOwners: owners,
          })
        }
      )}
    )
  };

  handleSelectTranscriptClickOpen = () => {
    db.getAllTranscripts().then(val => {
      this.setState({
        transcriptList: val
      })
    })
  }

  handlePreviewButton = (value) => {
    this.setState({previewButtonEnabled: value})
  }

  handleLeftDrawerOpen = () => {
    this.setState({ leftDrawerOpen: true });
  };

  handleLeftDrawerClose = () => {
    this.setState({ leftDrawerOpen: false });
  };

  handleRightDrawerOpen = () => {
    this.setState({ rightDrawerOpen: true });
  };

  handleRightDrawerClose = () => {
    this.setState({ rightDrawerOpen: false });
  };
  
  
  
  render() {
    const { classes, theme } = this.props; 

    let bottomAppBar =
    <BottomAppBar
      openLeft={this.state.leftDrawerOpen}
      openRight={this.state.rightDrawerOpen}
      handleLeftDrawerOpen={this.handleLeftDrawerOpen}
      handleRightDrawerOpen={this.handleRightDrawerOpen}
      selectedTranscript={this.state.selectedTranscript}
      transcriptId={this.state.transcriptId}
      handleClose={this.handleSelectTranscriptClose}
      handleClickOpen={this.handleSelectTranscriptClickOpen}
      transcriptList={this.state.transcriptList}
    />

    let mapPanel = 
    <PersistentDrawerRight 
      open={this.state.rightDrawerOpen}
      handleDrawerClose={this.handleRightDrawerClose}
      db={db}
      transcriptId={this.state.transcriptId}
      owners={this.state.transcriptOwners}
      handlePreviewButton={this.handlePreviewButton}
    />

    let searchPanel = <PersistentDrawerLeft 
      open={this.state.leftDrawerOpen}
      handleDrawerClose={this.handleLeftDrawerClose}
      db={db}
      transcriptId={this.state.transcriptId}
      owners={this.state.transcriptOwners}
    />

    
    
    return (
      <div className ='App'>
        {bottomAppBar}
        {mapPanel}
        {searchPanel}
        <PreviewButton disabled={this.state.previewButtonEnabled}/>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: this.state.leftDrawerOpen,
          })}
        >
          <div className={classes.drawerHeader} />
        </main>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(App);
