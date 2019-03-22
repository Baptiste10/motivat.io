import React, { Component } from 'react';
import './App.css';

import PersistentDrawerLeft from './components/PersistentDrawerLeft'
import SimpleDialogDemo from './components/ChooseOption/SimpleDialog'
import MongoStitch from './StitchApp/MongoStitch'

const db = new MongoStitch();

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      transcriptId: null,
      transcriptOwners: [],
      setSelectedTranscript: 'No transcript picked',
      transcriptList: []
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
          transcriptOwners: owners
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
    
    return (
      <div className ='App'>
        <PersistentDrawerLeft 
          db={db} 
          owners={this.state.transcriptOwners}
          transcriptID={this.state.transcriptId}
          />
        {transcriptDialog}
      </div>
    );
  }
}

export default App;
