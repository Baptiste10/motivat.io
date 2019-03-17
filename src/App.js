import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';

import PersistentDrawerLeft from './components/PersistentDrawerLeft'
import Person from './Person/Person';
import './Person/Person.css'

class App extends Component {

  state = {
    persons: [
        {name: 'Max', age: 28},
        {name: 'Baptiste', age: 20},
        {name: 'Antoni', age: 22}
      ]
  };

  switchNameHandler = (newName) => {
    this.setState({
      persons: [
        {name: newName, age: 29},
        {name: 'Baptiste', age: 20},
        {name: 'Antoni', age: 22}
      ]
    } )
  }

  nameChangeHandler = (event) => {
    this.setState({
      persons: [
        {name: 'Max', age: 29},
        {name: event.target.value, age: 20},
        {name: 'Antoni', age: 22}
      ]
    } )
  }
  
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
        <Person 
          name={this.state.persons[0].name} 
          age={this.state.persons[0].age}/>
        <Person 
          name={this.state.persons[1].name} 
          age={this.state.persons[1].age}
          click={this.switchNameHandler.bind(this, 'Just Max')}
          changed = {this.nameChangeHandler}>My Hobbies: Hacking</Person>
        <Person 
          name={this.state.persons[2].name} 
          age={this.state.persons[2].age}/>
      </div>
    );
  }
}

export default App;
