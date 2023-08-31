import React, { useState } from "react";
import { Container } from "@mui/material";
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
import Program from "./pages/program/Program";
import Finanz from "./pages/finanz/Finanz";
import Predict from "./pages/predict/Predict";
import Jugend from "./pages/jugend/Jugend";
import Kinder from "./pages/kinder/Kinder";
import Help from "./pages/help/Help";

const App = () => {
  //const [currentId, setCurrentId] = useState(null);

  const classes = useStyles();

  return (
    <BrowserRouter>
      <Container maxWidth="lg">
        <Navbar />
         <Switch>
          <Route path="/fullgospelchurchegk" exact component={Home} />
          <Route path="/fullgospelchurchegk/auth" exact component={Auth} /> 
          <Route path="/fullgospelchurchegk/program" exact component={Program} />
          <Route path="/fullgospelchurchegk/mezmur" exact component={AllMezmurs} />
          <Route path="/fullgospelchurchegk/finanz" exact component={Finanz} />
          <Route path="/fullgospelchurchegk/predict" exact component={Predict} />
          <Route path="/fullgospelchurchegk/jugend" exact component={Jugend} />
          <Route path="/fullgospelchurchegk/kinder" exact component={Kinder} />
          <Route path="/fullgospelchurchegk/help" exact component={Help} />
          <Route path="/fullgospelchurchegk/mezmur/addmezmur" exact component={Add_new_mezmur} />
          <Route path="/fullgospelchurchegk/mezmur/list" exact component={MezmurList}></Route>
          <Route path="/fullgospelchurchegk/mezmur/:id" exact component={SingleMezmur}></Route>
        </Switch>
      </Container>
    </BrowserRouter>
  );
};

export default App;
