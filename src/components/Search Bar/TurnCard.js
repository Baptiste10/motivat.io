import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import SentenceCard from './SentenceCard'

const styles = theme => ({
  card: {
    width: "100%",
    margin: '16px auto',
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(90deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(0deg)',
  },
});

class TurnCard extends React.Component {
  state = { expanded: false };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  handleCardChange = (event, id) => {
    this.props.handleCardChange(event, id)
  }

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardContent>
          <Typography component="p">
            {this.props.content.sentence.text}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton
            className={classnames(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <ul>
              {this.props.content.clauses.map(
                (clauseNode) =>
                  <SentenceCard 
                    key={clauseNode.id.toString()}
                    clause={clauseNode}
                    handleCardChange={this.props.handleCardChange}
                  />
              )}
            </ul>
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

TurnCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TurnCard);
