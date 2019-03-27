import React, { Component } from 'react';
import './App.css';

import PersistentDrawerLeft from './components/PersistentDrawerLeft'
import PersistentDrawerRight from './components/PersistentDrawerRight'
import SimpleDialogDemo from './components/ChooseOption/SimpleDialog'
import MongoStitch from './StitchApp/MongoStitch'
import PreviewButton from './components/PreviewButton'

const db = new MongoStitch();

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      transcriptId: null,
      transcriptOwners: [],
      setSelectedTranscript: 'No transcript picked',
      transcriptList: [],
      previewButtonEnabled: true
    };

    this.handleClose = this.handleClose.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
  }

  handleClose = name => {
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

  handleClickOpen = function() {
    db.getAllTranscripts().then(val => {
      this.setState({
        transcriptList: val
      })
    })
  }

  handlePreviewButton = (value) => {
    this.setState({previewButtonEnabled: value})
  }
  
  
  render() {
    console.log('Active transcript ID: ', this.state.transcriptId)
    let transcriptDialog
    // Render the transcript dialog only if the user hasn't picked any transcript to analyse yet.
    transcriptDialog = <SimpleDialogDemo 
      selectedTranscript={this.state.selectedTranscript}
      transcriptId={this.state.transcriptId}
      handleClose={this.handleClose}
      handleClickOpen={this.handleClickOpen}
      transcriptList={this.state.transcriptList}
    />

    let mapPanel = <PersistentDrawerRight 
      db={db}
      transcriptId={this.state.transcriptId}
      owners={this.state.transcriptOwners}
      handlePreviewButton={this.handlePreviewButton}
    />

    let searchPanel = <PersistentDrawerLeft 
      db={db}
      transcriptId={this.state.transcriptId}
      owners={this.state.transcriptOwners}
    />

    
    
    return (
      <div className ='App'>
        {searchPanel}
        {transcriptDialog}
        <PreviewButton disabled={this.state.previewButtonEnabled}/>
      </div>
    );
  }
}

export default App;
