import React, { Component } from "react";
import { Link } from "react-router-dom";
import { processResponse } from "../utils";

import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";

let styles = {
  container: {
    margin: "20px"
  },
  gridItem: {
    padding: "10px",
    minWidth: "375px"
  },
  primaryText: {
    fontSize: "1.5rem"
  },
  secondaryText: {
    color: "#383838"
  }
};

class Issues extends Component {
  state = {
    issues: [],
    isLoading: true
  };

  componentDidMount() {
    fetch("/v1/issues")
      .then(res => processResponse(res))
      .then(({ issues }) => {
        this.setState({
          issues,
          isLoading: false
        });
      });
  }

  render() {
    let { classes } = this.props;
    let { issues, isLoading } = this.state;

    if (isLoading) {
      return <h1>Loading...</h1>;
    }

    return (
      <div className={classes.container}>
        <Typography variant="h3" gutterBottom>
          Known issues
        </Typography>

        <Typography paragraph gutterBottom>
          These are currently known issues with the weather station. If you
          notice anything and would like to report it, you can{" "}
          <a href="https://github.com/robdel12/weatherstation-server/issues/new">
            open an issue here.
          </a>
        </Typography>

        <List>
          {issues.map(data => {
            let issue = data.node;

            return (
              <ListItem
                component="a"
                key={issue.id}
                href={issue.url}
                button
                divider
                disableGutters
              >
                <ListItemText
                  primary={`${issue.title} (#${issue.number})`}
                  secondary={issue.body}
                  classes={{
                    primary: classes.primaryText,
                    secondary: classes.secondaryText
                  }}
                />
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  }
}

export default withStyles(styles)(Issues);
