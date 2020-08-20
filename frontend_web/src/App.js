import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Nav from './Nav';
import Companies from './Companies';
import Company from './Company.js';

function App() {
  // Fetching the data from the first json



  return (
    <Router>
      <div className="App">
        <Nav />
        <Switch>
          <Route path='/companies/:id' component={Company} />
          <Route path='/companies/' exact component={Companies} />
          <Route path='/' exact component={Companies} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
