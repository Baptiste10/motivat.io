import React from 'react';
import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
  },
}));

function SentencesList() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([1]);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <List dense className={classes.root}>
      {[0, 1, 2, 3].map(value => (
        <ListItem key={value} button>
          <ListItemText primary={`Sentence ${value + 1}`} />
          <ListItemSecondaryAction>
            <Checkbox onChange={handleToggle(value)} checked={checked.indexOf(value) !== -1} />
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}

export default SentencesList;
