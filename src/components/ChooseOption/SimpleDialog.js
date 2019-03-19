import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import SimpleDialogStyle from './SimpleDialogStyle.css'

const emails = ['username@gmail.com', 'user02@gmail.com', 'anotherone@gmail.com'];

function UploadButton() {
  return (
    <div>
      <input
        accept="text/*"
        className="TranscriptInput"
        id="text-button-file"
        multiple
        type="file"
      />
      <label htmlFor="text-button-file">
        <Button component="span" className="TextButton">
          Upload
        </Button>
      </label>
    </div>
  )
}

function SimpleDialog(props) {
  const { onClose, selectedValue, ...other } = props;

  function handleClose() {
    onClose(selectedValue);
  }

  function handleListItemClick(value) {
    onClose(value);
  }

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" {...other}>
      <DialogTitle id="simple-dialog-title">Set the transcript to analyse</DialogTitle>
      <div>
        <List>
          {emails.map(email => (
            <ListItem button onClick={() => handleListItemClick(email)} key={email}>
              <ListItemText primary={email} />
            </ListItem>
          ))}
          <ListItem>
            <UploadButton/>
          </ListItem>
        </List>
      </div>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func,
  selectedValue: PropTypes.string,
};

function SimpleDialogDemo() {
  const [open, setOpen, intervalIsSet] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState('No transcript selected');

  function handleClickOpen() {
    setOpen(true);
  }

  const handleClose = value => {
    setOpen(false);
    setSelectedValue(value);
  };

  function componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  };

  // our first get method that uses our backend api to 
  // fetch data from our data base
  const getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };


  return (
    <div>
      <Typography variant="subtitle1">Selected: {selectedValue}</Typography>
      <br />
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Switch to a different transcript
      </Button>
      <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
    </div>
  );
}



export default SimpleDialogDemo;
