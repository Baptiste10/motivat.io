import React from "react";
import { withStyles } from '@material-ui/core/styles';
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  dense: {
    marginTop: 1
  },
  textField: {
    marginLeft: "5px",
    marginRight: "5px",
    width: "45%"
  }
});

class FilledTextFields extends React.Component {
  constructor(props) {
    super(props)
    this.state = {values: props.node }
  }

  handleCardChange = name => event => {
    this.setState(prevState => ({
      values: {
          ...prevState.values,
          name: [event.target.value]
      }
  }))
  };

  handleSubmit = event => {
    this.props.handleCardChange(event);
  }

  render(){
    const { classes } = this.props;
    return (
      <form className={classes.container} noValidate autoComplete="off">
        <ul>
          {Object.keys(this.state.values).map(attribute => (
            <TextField
              key={attribute}
              label={attribute}
              className={classes.textField}
              defaultValue={this.state.values[attribute]}
              onChange={this.handleSubmit}
              variant="filled"
              margin="dense"
            />
          ))}
        </ul>
      </form>
    );
  }
}

export default withStyles(styles)(FilledTextFields);