import React from "react";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";

import MenuIcon from "@material-ui/icons/Menu";
import HomeIcon from "@material-ui/icons/Home";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import TrendingDownIcon from "@material-ui/icons/TrendingDown";
import EqualizerIcon from "@material-ui/icons/Equalizer";
import WhatshotIcon from "@material-ui/icons/Whatshot";

import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { Link } from "react-router-dom";

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
};

function WeatherAppBar(props) {
  let { classes, drawerIsOpen, onMenuTap, closeDrawer, openDrawer } = props;

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={onMenuTap}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
            weather.deluca.house
          </Typography>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        open={drawerIsOpen}
        onClose={closeDrawer}
        onOpen={openDrawer}
      >
        <List style={{ width: "200px" }}>
          <ListItem component={Link} to="/" button onClick={closeDrawer}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem component={Link} to="/live" button onClick={closeDrawer}>
            <ListItemIcon>
              <WhatshotIcon />
            </ListItemIcon>
            <ListItemText primary="Live" />
          </ListItem>
          <ListItem
            component={Link}
            to="/averages"
            button
            onClick={closeDrawer}
          >
            <ListItemIcon>
              <EqualizerIcon />
            </ListItemIcon>
            <ListItemText primary="Averages" />
          </ListItem>
          <ListItem component={Link} to="/highs" button onClick={closeDrawer}>
            <ListItemIcon>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText primary="Highs" />
          </ListItem>
          <ListItem component={Link} to="/lows" button onClick={closeDrawer}>
            <ListItemIcon>
              <TrendingDownIcon />
            </ListItemIcon>
            <ListItemText primary="Lows" />
          </ListItem>
        </List>
      </SwipeableDrawer>
    </div>
  );
}

export default withStyles(styles)(WeatherAppBar);
