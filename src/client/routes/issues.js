import React, { Component } from "react";
import { Link } from "react-router-dom";
import { processResponse } from "../utils";

import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import HealingIcon from "@material-ui/icons/Healing";
import FiberNewIcon from "@material-ui/icons/FiberNew";
import BugReportIcon from "@material-ui/icons/BugReport";

let styles = {
  container: {
    margin: "20px"
  },
  inline: {
    display: "inline-block"
  },
  gridItem: {
    padding: "10px",
    minWidth: "375px"
  },
  primaryText: {
    fontSize: "1.5rem"
  },
  secondaryText: {
    color: "#383838",
    "word-break": "break-word"
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

  renderIcon(labelText) {
    if (labelText === "enhancement") {
      return <FiberNewIcon />;
    } else if (labelText === "bug") {
      return <BugReportIcon />;
    } else if (labelText === "chore") {
      return <HealingIcon />;
    } else {
      return <BugReportIcon />;
    }
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
          <a
            href="https://github.com/robdel12/weatherstation-server/issues/new"
            target="_blank"
          >
            open an issue here.
          </a>
        </Typography>

        <List>
          {issues.map(data => {
            let issue = data.node;
            let firstLabel = issue.labels.edges[0].node;

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
                  primary={
                    <>
                      <Typography
                        variant="h3"
                        className={classes.primaryText}
                        color="textPrimary"
                      >
                        <Typography component="span" className={classes.inline}>
                          {this.renderIcon(firstLabel.name)}
                        </Typography>
                        {issue.title} (#
                        {issue.number})
                      </Typography>
                    </>
                  }
                  secondary={
                    <>
                      <Typography
                        component="span"
                        className={classes.secondaryText}
                        dangerouslySetInnerHTML={{
                          __html: issue.bodyHTML
                        }}
                      />
                    </>
                  }
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
