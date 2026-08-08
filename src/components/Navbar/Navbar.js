import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Avatar, Button, Typography, Container, Drawer, List, useMediaQuery, useTheme } from "@mui/material";
import { ListItemButton, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useStyles from "./stylesNavbar";
import logo from "../../images/logo.jpg";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";

const pages = [
  { label: "Program", path: "/program" },
  { label: "Mezmur", path: "/mezmur" },
  { label: "Finanz", path: "/finanz" },
  { label: "Predict", path: "/predict" },
  { label: "Jugend", path: "/jugend" },
  { label: "Kinder", path: "/kinder" },
  { label: "Help?", path: "/help" },
];

const Navbar = () => {
  const classes = useStyles();
  //const user = null;

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile"))); //we want to fetch real user from local storage

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));

  const logout = () => {
    //we need to dispatch an action
    dispatch({ type: "LOGOUT" });
    history.push("/");
    setUser(null);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("profile"));
    const token = storedUser?.token;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < Date.now()) {
        dispatch({ type: "LOGOUT" });
        setUser(null);
        history.push("/");
        return;
      }
    }

    setUser(storedUser);
  }, [dispatch, history, location]);

  return (
    <Container>
      <AppBar className={classes.appBar} position="static" color="inherit">
        {
          isMatch ? (
            <>
              <Typography component={Link} to="/"><img src={logo} alt="Church logo" height="70" /></Typography>

              <button onClick={() => setOpen(true)}><MenuIcon 
                    style={{ color: "rgba(0,183,255, 1)" }} /></button>
              <Drawer open={open} onClose={() => setOpen(false)}>
                <List sx={{ bgcolor: '#1976d2', color: 'white', 
                          marginTop: '38PX', fontWeight: 'medium', 
                          variant: 'body2', fontSize: 25 }}>
                  {pages.map((page) => (
                    <ListItemButton key={page.path} onClick={() => setOpen(false)}
                    component={Link} to={page.path}
                    style={{ color: "rgba(0,183,255, 1)", fontWeight: "700" }}>

                      <ListItemText primary={page.label} />

                    </ListItemButton>))}
                  <ListItemButton>
                    <ListItemText>
                      {user ? (
                        <div className={classes.profilemobil}>
                          <Avatar
                            className={classes.purplemobil}
                            alt={user.result.name}
                            src={user.result.imageUrl}
                          >
                            {user.result.name.charAt(0)}
                          </Avatar>

                          <Button
                            variant="contained"
                            className={classes.logout}
                            color="secondary"
                            onClick={logout}
                          >
                            Logout
                          </Button>
                        </div>
                      ) : (
                        <Button
                          component={Link}
                          to="/auth"
                          variant="contained"
                          color="primary"
                        >
                          Sign In
                        </Button>
                      )}
                    </ListItemText>
                  </ListItemButton>
                </List>

              </Drawer>
            </>
          ) : (
            <>
              <div className={classes.brandContainer} style={{display: "flex", fontWeight: "700",
                  alignItems: "center", justifyContent: "space-between"}}>
                <Typography
                  component={Link}
                  to="/"
                  className={classes.heading}
                  variant="h5"
                  align="center"
                  color="red"
                  textDecoration={"none"}
                  border={"2px solid red"}
                  padding={"5px"}
                  margin={"3px"}
                >
                  &nbsp; Eritrean Full Gospel Cologne &nbsp;
                </Typography>
                <img className={classes.image} src={logo} alt="icon"  
                height="140" />
              {/* </div> */}
              <Toolbar className={classes.toolbar}>
                {user ? (
                  <div className={classes.profile}>
                    <Avatar
                      className={classes.purple}
                      alt={user.result.name}
                      src={user.result.imageUrl}
                    >
                      {user.result.name.charAt(0)}
                    </Avatar>
                    <Typography className={classes.userName} variant="h6">
                      {user.result.name}
                    </Typography>
                    <Button
                      variant="contained"
                      className={classes.logout}
                      color="secondary"
                      onClick={logout}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    component={Link}
                    to="/auth"
                    variant="contained"
                    color="primary"
                  >
                    Sign In
                  </Button>
                )}
              </Toolbar>
          </div>
            </>
          )
        }
      </AppBar>
      {isMatch ? (<Typography style={{textAlign: "center", color: "yellow"}}>For more links press the burger butten</Typography>) : (
      <Toolbar className={classes.appBarUnten} position="static" color="inherit">
        {pages.map((page) => (
          <ListItemButton key={page.path} component={Link} to={page.path} style={{ color: "rgba(0,183,255, 1)", fontWeight: 700 }}>

            <ListItemText primary={page.label} />

          </ListItemButton>))}
      </Toolbar>)
}

    </Container>
  );
};

export default Navbar;
