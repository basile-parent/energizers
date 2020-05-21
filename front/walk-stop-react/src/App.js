import React from 'react';
import './App.css';
import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import WalkStop from "./page/walk-stop/WalkStop";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/walk-stop" component={WalkStop} exact />
        <Route path="/walk-stop/:room" component={WalkStop}/>
        <Redirect to="/walk-stop"/>
      </Switch>
    </div>
  );
}

export default App;
