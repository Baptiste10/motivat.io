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
    minWidth: 175,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class KeywordSelect extends React.Component {
  state = {
    labelWidth: 0,
    clientKeywords: [], 
    coachKeywords: []
  };

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth, 
    });
    this.getKeywordList();
  }

  handleSelectChange = event => {
    this.props.handleSelectChange(event);
  };

  getKeywordList(){
    this.props.db.getTranscriptKeywords(this.props.transcriptId).then(({clientKeywords, coachKeywords}) => {
      this.setState({
        clientKeywords: clientKeywords, 
        coachKeywords: coachKeywords
      })
    })
  }
  
  render() {
    const { classes } = this.props;

    let coachList = this.state.coachKeywords.map(keyword => {
      return <MenuItem value={keyword}>{keyword}</MenuItem>
    });
    let clientList = this.state.clientKeywords.map(keyword => {
      return <MenuItem value={keyword}>{keyword}</MenuItem>
    });

    return (
        <div className={classes.root}>
            <form  autoComplete="off">
                <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel
                        ref={ref => {
                        this.InputLabelRef = ref;
                        }}
                        htmlFor="outlinedle-map-simp"
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
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                        {clientList}
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
                        <MenuItem value="">
                        <em>None</em>
                        </MenuItem>
                        {coachList}
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