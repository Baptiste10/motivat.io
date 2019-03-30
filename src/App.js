import React, { Component } from 'react';
import './App.css';
import PersistentDrawerLeft from './components/PersistentDrawerLeft'
import PersistentDrawerRight from './components/PersistentDrawerRight'
import MongoStitch from './StitchApp/MongoStitch'
import PreviewButton from './components/PreviewButton'
import BottomAppBar from './components/AppBar/BottomAppBar'
import ImageGrid from './components/ImageGrid/ImageGrid'

const drawerWidth = 400;

const db = new MongoStitch();


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      previewClicked:false,
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

  handlePreviewClick = () => {
    this.setState({
      previewClicked:true,
      previewButtonEnabled:true
    })
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

    let imageGrid;
    if (this.state.previewClicked){
      imageGrid = <ImageGrid/>
    }

    
    
    return (
      <div className ='App'>
        {imageGrid}
        {bottomAppBar}
        {mapPanel}
        {searchPanel}
        <PreviewButton onClick={this.handlePreviewClick} disabled={this.state.previewButtonEnabled}/>
      </div>
    );
  }
}

export default App;
