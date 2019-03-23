import React from 'react';
import { makeStyles } from '@material-ui/styles';
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

const useStyles = makeStyles(theme => ({
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
}));

function SentenceCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  return (
    <Card className={classes.card}>
      <CardActions className={classes.actions} disableActionSpacing>
        <IconButton aria-label="Add to favorites">
          <FavoriteIcon />
        </IconButton>
        <Typography color="textSecondary" gutterBottom>
          {props.clause.text}
          </Typography>
        <IconButton
          className={classnames(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="Show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <FilledTextFields key={props.clause.id.toString()}
                            node={props.clause.attributes} />
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default SentenceCard;
