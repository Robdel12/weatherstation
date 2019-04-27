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
import WarningIcon from "@material-ui/icons/Warning";
import RefreshIcon from "@material-ui/icons/Refresh";

import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { withStyles } from "@material-ui/core/styles";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { Link } from "react-router-dom";

const styles = {
  root: {
    flexGrow: 1,
    marginBottom: "80px"
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
  let {
    classes,
    drawerIsOpen,
    onMenuTap,
    closeDrawer,
    openDrawer,
    onRefresh
  } = props;

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Navigation"
            onClick={onMenuTap}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            weather.deluca.house
          </Typography>
          <IconButton
            color="inherit"
            onClick={onRefresh}
            aria-label="Refresh page"
          >
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        open={drawerIsOpen}
        onClose={closeDrawer}
        onOpen={openDrawer}
      >
        <List style={{ width: "215px" }}>
          <NavListItem to="/" onClick={closeDrawer}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </NavListItem>
          <NavListItem to="/live" onClick={closeDrawer}>
            <ListItemIcon>
              <WhatshotIcon />
            </ListItemIcon>
            <ListItemText primary="Live" />
          </NavListItem>
          <NavListItem to="/averages" onClick={closeDrawer}>
            <ListItemIcon>
              <EqualizerIcon />
            </ListItemIcon>
            <ListItemText primary="Averages" />
          </NavListItem>
          <NavListItem to="/highs" onClick={closeDrawer}>
            <ListItemIcon>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText primary="Highs" />
          </NavListItem>
          <NavListItem to="/lows" onClick={closeDrawer}>
            <ListItemIcon>
              <TrendingDownIcon />
            </ListItemIcon>
            <ListItemText primary="Lows" />
          </NavListItem>
          <NavListItem to="/issues" onClick={closeDrawer}>
            <ListItemIcon>
              <WarningIcon />
            </ListItemIcon>
            <ListItemText primary="Known issues" />
          </NavListItem>
        </List>
      </SwipeableDrawer>
    </div>
  );
}

function NavListItem(props) {
  let { children, ...restOfProps } = props;

  return (
    <ListItem
      button
      role={null}
      tabIndex={null}
      component={Link}
      {...restOfProps}
    >
      {children}
    </ListItem>
  );
}

export default withStyles(styles)(WeatherAppBar);
