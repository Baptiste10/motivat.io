import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import FilledTextFields from './ClauseParameters'

const styles = theme => ({
  card: {
    width: "100%",
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(90deg)',
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(0deg)',
  },
});

class SentenceCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };
  }

  handleExpandClick = () => {
    this.setState({expanded: !this.state.expanded});
  }

  handleCardChange = event => {
    this.props.handleCardChange(event, this.props.clause.id.toString())
  }

  render(){
    const { classes } = this.props;
    

    return (
      <Card className={classes.card}>
        <CardActions className={classes.actions} disableActionSpacing>
          <IconButton aria-label="Add to favorites">
            <FavoriteIcon />
          </IconButton>
          <Typography color="textSecondary" gutterBottom>
            {this.props.clause.text}
            </Typography>
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
            <FilledTextFields 
              key={this.props.clause.id.toString()}
              node={this.props.clause.attributes}
              handleCardChange={this.handleCardChange}
            />
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

export default withStyles(styles)(SentenceCard);
