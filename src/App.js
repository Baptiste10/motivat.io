import React, { Component } from 'react';
import './App.css';

import PersistentDrawerLeft from './components/PersistentDrawerLeft'
import SimpleDialogDemo from './components/ChooseOption/SimpleDialog'
import MongoStitch from './StitchApp/MongoStitch'



class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      setTranscriptId: null,
      setSelectedTranscript: 'No transcript picked'
    };

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose = value => {
    this.setState({
      selectedTranscript: value,
      setTranscriptId: MongoStitch()
    });
  };


  
  
  render() {
    return (
      <div className ='App'>
        <PersistentDrawerLeft/>
        <SimpleDialogDemo 
          selectedTranscript={this.state.selectedTranscript}
          transcriptId={this.state.transcriptId}
          handleClose={this.handleClose}
        />
      </div>
    );
  }
}

export default App;
