import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

import PersistentDrawerLeft from './components/PersistentDrawerLeft'
import SimpleDialogDemo from './components/ChooseOption/SimpleDialog'
import MongoStitch from './StitchApp/MongoStitch'

console.log(MongoStitch())

class App extends Component {

  state = {
    persons: [
        {name: 'Max', age: 28},
        {name: 'Baptiste', age: 20},
        {name: 'Antoni', age: 22}
      ]
  };
  
  render() {
    return (
      <div className ='App'>
        <PersistentDrawerLeft/>
        <SimpleDialogDemo/>
      </div>
    );
  }
}

export default App;
