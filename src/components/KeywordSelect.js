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
    justifyContent: "10px",
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 180,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class KeywordSelect extends React.Component {
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
        <div className={classes.root}>
            <form  autoComplete="off">
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel
                        ref={ref => {
                        this.InputLabelRef = ref;
                        }}
                        htmlFor="outlined-map-simple"
                    >
                        {this.props.owners[0][1]}
                    </InputLabel>
                    <Select
                        value={this.props.clientKeyword}
                        onChange={this.handleSelectChange}
                        input={
                        <OutlinedInput
                            labelWidth={this.state.labelWidth}
                            name="clientKeyword"
                            id="outlined-map-simple"
                        />
                        }
                    >
                        <MenuItem value={'client keyword 1'}>client keyword 1</MenuItem>
                        <MenuItem value={'client keyword 2'}>client keyword 2</MenuItem>
                    </Select>
                </FormControl>
            </form>
            <form autoComplete="off">
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel
                        ref={ref => {
                        this.InputLabelRef = ref;
                        }}
                        htmlFor="outlined-map-simple"
                    >
                        {this.props.owners[1][1]}
                    </InputLabel>
                    <Select
                        value={this.props.coachKeyword}
                        onChange={this.handleSelectChange}
                        input={
                        <OutlinedInput
                            labelWidth={this.state.labelWidth}
                            name="coachKeyword"
                            id="outlined-map-simple"
                        />
                        }
                    >
                        <MenuItem value={'coach keyword 1'}>coach keyword 1</MenuItem>
                        <MenuItem value={'coach keyword 2'}>coach keyword 2</MenuItem>
                    </Select>
                </FormControl>
            </form>
            
        </div>     
    );
  }
}

KeywordSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(KeywordSelect);