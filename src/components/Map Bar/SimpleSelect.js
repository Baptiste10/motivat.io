import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 370,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class SimpleSelect extends React.Component {
  state = {
    labelWidth: 0,
  };

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
    });
  }

  handleSelectChange = event => {
    this.props.handleSelectChange(event);
  };

  render() {
    const { classes } = this.props;
    return (
        <div>
            <form className={classes.root} autoComplete="off">
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel
                        ref={ref => {
                        this.InputLabelRef = ref;
                        }}
                        htmlFor="outlined-map-simple"
                    >
                        Pick a map
                    </InputLabel>
                    <Select
                        value={this.props.selectedMap}
                        onChange={this.handleSelectChange}
                        input={
                        <OutlinedInput
                            labelWidth={this.state.labelWidth}
                            name="selectedMap"
                            id="outlined-map-simple"
                        />
                        }
                    >
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                        <MenuItem value={'Keyword Map'}>Keyword Map</MenuItem>
                        <MenuItem value={'MI Map'}>MI Map</MenuItem>
                        <MenuItem value={'Custom Map'}>Custom Map</MenuItem>
                    </Select>
                </FormControl>
            </form>
        </div>     
    );
  }
}

SimpleSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleSelect);