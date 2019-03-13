import React, { Component } from 'react';
import './App.css';
import PersistentDrawerLeft from './components/PersistentDrawerLeft'

class App extends Component {
  
  render() {

    const style = {
      backgroundColor: 'white',
      fonr: 'inherite',
      border: '1px solid blue',
      padding: '8px',
      cursor: 'pointer'
    };

    return (
      <div className ='App'>
      <PersistentDrawerLeft/>
        <h1>Hi I'm a React App</h1>
        <p>This is a paragraph</p>
        <button
          style={style}>I'm a button 
        </button>
      </div>
    );
  }
}

export default App;
