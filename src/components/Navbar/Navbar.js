import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Avatar, Button, Typography, Container, Box, Drawer, List, useMediaQuery, useTheme, ThemeProvider } from "@material-ui/core";
import { ListItemButton, ListItemText } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useStyles from "./stylesNavbar";
import camera from "../../images/camera.png";
import karte from "../../images/karte.png";
import logo from "../../images/logo.jpg";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import decode from "jwt-decode";

const pagesArr = ["Program", "Mezmur", "Finanz", "Predict", "Jugend", "Kinder", "Help?"];
const pagesArrD = ["Program", "Mezmur", "Finanz", "Predict", "Jugend", "Kinder", "Help?"];

const Navbar = () => {
  const classes = useStyles();
  //const user = null;

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("profile"))); //we want to fetch real user from local storage

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const theme = useTheme();
  console.log(theme);
  const isMatch = useMediaQuery(theme.breakpoints.down('sm'));
  console.log(isMatch);

  const logout = () => {
    //we need to dispatch an action
    dispatch({ type: "LOGOUT" });
    history.push("/");
    setUser(null);
  };

  console.log("User: ", user);

  useEffect(() => {
    const token = user?.token;
    //JWT..
    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) logout();
    }

    setUser(JSON.parse(localStorage.getItem("profile")));
  }, [location]);

  return (
    <Container>
      <AppBar className={classes.appBar} position="static" color="inherit">
        {
          isMatch ? (
            <>
              <Typography><img src={logo} alt="icon" height="70" /></Typography>

              <button onClick={() => setOpen(true)}><MenuIcon style={{ color: "rgba(0,183,255, 1)" }} /></button>
              <Drawer open={open} onClose={() => setOpen(false)}>
                <List sx={{ bgcolor: '#1976d2', color: 'white', marginTop: '38PX', fontWeight: 'medium', variant: 'body2', fontSize: 25 }}>
                  {pagesArrD.map((page, index) => (
                    <ListItemButton key={index} onClick={() => setOpen(false)} component={Link} to={`/${page}`} style={{ color: "rgba(0,183,255, 1)", fontWeight: "700" }}>

                      <ListItemText primary={page} />

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
              <div className={classes.brandContainer}>
                <Typography
                  component={Link}
                  to="/"
                  className={classes.heading}
                  variant="h5"
                  align="center"
                >
                  &nbsp; Eritrean full Gospel Cologne &nbsp;
                </Typography>
                <img className={classes.image} src={logo} alt="icon" height="140" />
              </div>
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




            </>
          )
        }
      </AppBar>
      {isMatch ? (<Typography style={{textAlign: "center", color: "lightblue"}}>For more links press the burger butten</Typography>) : (
      <Toolbar className={classes.appBarUnten} position="static" color="inherit">
        {pagesArrD.map((page, index) => (
          <ListItemButton key={index} component={Link} to={`/${page}`} style={{ color: "rgba(0,183,255, 1)", fontWeight: "700" }}>

            <ListItemText primary={page} />

          </ListItemButton>))}
      </Toolbar>)
}

    </Container>
  );
};

export default Navbar;
