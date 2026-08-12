import React from "react";
import { Container } from "@mui/material";
import { BrowserRouter, Switch, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import Auth from "./components/Auth/Auth";
import SingleMezmur from "./pages/mezmur/SingleMezmur";
import AllMezmurs from "./pages/mezmur/Mezmur.js";
import Program from "./pages/program/Program";
import Predict from "./pages/predict/Predict";
import Jugend from "./pages/jugend/Jugend";
import Kinder from "./pages/kinder/Kinder";
import Help from "./pages/help/Help";
import NotFound from "./pages/NotFound";
import PostDetail from "./pages/PostDetail";
import MezmurPrint from "./pages/mezmur/MezmurPrint";
import AdminPortal from "./pages/admin/AdminPortal";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const AppContent = () => (
  <Switch>
    <Route path="/mezmur/:id/print" exact component={MezmurPrint} />
    <Route>
      <Container maxWidth="lg">
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/auth" exact component={Auth} />
          <Route path="/posts/:id" exact component={PostDetail} />
          <Route path="/program" exact component={Program} />
          <Route path="/mezmur" exact component={AllMezmurs} />
          <Route path="/predict" exact component={Predict} />
          <Route path="/jugend" exact component={Jugend} />
          <Route path="/kinder" exact component={Kinder} />
          <Route path="/help" exact component={Help} />
          <Route path="/admin/mezmur/add" exact component={AdminPortal} />
          <Route path="/admin/mezmur/:id/edit" exact component={AdminPortal} />
          <Route path="/admin" exact component={AdminPortal} />
          <Route path="/mezmur/:id" exact component={SingleMezmur} />
          <Route component={NotFound} />
        </Switch>
      </Container>
    </Route>
  </Switch>
);

const App = () => (
  <BrowserRouter>
    <ScrollToTop />
    <AppContent />
  </BrowserRouter>
);

export default App;
