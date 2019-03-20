import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

import PersistentDrawerLeft from './components/PersistentDrawerLeft'
import SimpleDialogDemo from './components/ChooseOption/SimpleDialog'


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      transcriptId: null,
      setSelectedTranscript: 'No transcript picked'
    };

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose = value => {
    this.setState({selectedTranscript: value});
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
