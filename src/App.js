import React, { useState } from "react";
import { Container } from "@material-ui/core";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import useStyles from "./stylesApp";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import Mezmur from "./pages/mezmur/Mezmur.js";
import Add_new_mezmur from "./pages/mezmur/Add_new_mezmur";
import MezmurList from "./pages/mezmur/MezmurList";
import SingleMezmur from "./pages/mezmur/SingleMezmur";
import AllMezmurs from "./pages/mezmur/Mezmur.js";

const App = () => {
  //const [currentId, setCurrentId] = useState(null);

  const classes = useStyles();

  return (
    <BrowserRouter>
      <Container maxWidth="lg">
        <Navbar />
        <Switch>
          <Route path="/home" exact component={Home} />
          <Route path="/auth" exact component={Auth} />
          <Route path="/mezmur" exact component={AllMezmurs} />
          <Route path="/mezmur/addmezmur" exact component={Add_new_mezmur} />
          <Route path="/mezmur/list" exact component={MezmurList}></Route>
          <Route path="/mezmur/:id" exact component={SingleMezmur}></Route>
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;
