import React from "react";
import { Switch, Route } from "react-router-dom";
import routes from "./routes";
import "./App.css";
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => {
  return (
    <div>

      <Navbar />

      <Switch>
        {routes.map((route, i) => <Route key={i} {...route} />)}
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
