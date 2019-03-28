import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import TurnCard from './TurnCard'

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 2 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: "100%",
  },
});

class FullWidthTabs extends React.Component {
  
  handleTabChange = (event, tabValue) => {
    this.props.handleTabChange(event, tabValue);
  };

  handleTabChangeIndex = index => {
    this.props.handleTabChangeIndex(index);
  };

  handleCardChange = (event, id) => {
    this.props.db.updateClause(id, event.target.label, event.target.value)
  };


  render() {
    const { classes, theme } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.props.tabValue}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Client" />
            <Tab label="Coach" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.props.tabValue}
          onChangeIndex={this.handleTabChangeIndex}
        >
          <TabContainer dir={theme.direction}>
          <ul>
            {this.props.clientSentenceList.map(
              (sentenceObject) =>
                <TurnCard 
                  key={sentenceObject.sentence.id.toString()}
                  content={sentenceObject}
                  db={this.props.db}
                  handleCardChange={this.handleCardChange}
                />
             )}
          </ul>
          </TabContainer>
          <TabContainer dir={theme.direction}>
          <ul>
            {this.props.coachSentenceList.map(
              (sentenceObject) =>
                <TurnCard 
                    key={sentenceObject.sentence.id.toString()}
                    content={sentenceObject} 
                    db={this.props.db}
                    handleCardChange={this.handleCardChange}
                />
             )}
          </ul>
          </TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};


export default withStyles(styles, { withTheme: true })(FullWidthTabs);
