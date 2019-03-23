import React from "react";
import { makeStyles } from "@material-ui/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
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
}));

function FilledTextFields(props) {
  const classes = useStyles();

  const handleChange = event => {};
  console.log(typeof props.node, props.node)
  return (
    <form className={classes.container} noValidate autoComplete="off">
      <ul>
        {Object.keys(props.node).map(attribute => (
          <TextField
            key={attribute}
            label={attribute}
            className={classes.textField}
            value={props.node[attribute]}
            onChange={handleChange("name")}
            variant="filled"
            margin="dense"
          />
        ))}
      </ul>
    </form>
  );
}

export default FilledTextFields;
