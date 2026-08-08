import React from "react";
import { Container } from "@mui/material";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import useStyles from "./stylesApp";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import Add_new_mezmur from "./pages/mezmur/Add_new_mezmur";
import MezmurList from "./pages/mezmur/MezmurList";
import SingleMezmur from "./pages/mezmur/SingleMezmur";
import AllMezmurs from "./pages/mezmur/Mezmur.js";
import Program from "./pages/program/Program";
import Finanz from "./pages/finanz/Finanz";
import Predict from "./pages/predict/Predict";
import Jugend from "./pages/jugend/Jugend";
import Kinder from "./pages/kinder/Kinder";
import Help from "./pages/help/Help";

const App = () => {
  useStyles();

  return (
    <BrowserRouter>
      <Container maxWidth="lg">
        <Navbar />
         <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/auth" exact component={Auth} />
          <Route path="/program" exact component={Program} />
          <Route path="/mezmur" exact component={AllMezmurs} />
          <Route path="/finanz" exact component={Finanz} />
          <Route path="/predict" exact component={Predict} />
          <Route path="/jugend" exact component={Jugend} />
          <Route path="/kinder" exact component={Kinder} />
          <Route path="/help" exact component={Help} />
          <Route path="/mezmur/addmezmur" exact component={Add_new_mezmur} />
          <Route path="/mezmur/list" exact component={MezmurList} />
          <Route path="/mezmur/:id" exact component={SingleMezmur} />
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;
