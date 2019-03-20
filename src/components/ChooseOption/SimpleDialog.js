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
import MongoStitch from '../../StitchApp/MongoStitch'



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
  const transcriptNames = ["Sunday 34th February", "Friday 23 April", "Monday 6th July", "Tuesday 30th February"];

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
          {transcriptNames.map(transcriptName => (
            <ListItem button onClick={() => handleListItemClick(transcriptName)} key={transcriptName}>
              <ListItemText primary={transcriptName} />
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

function SimpleDialogDemo(props) {
  const {transcriptName} = props;
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  const handleClose = value => {
    setOpen(false);
    props.handleClose(value)
  };


  return (
    <div>
      <Typography variant="subtitle1">Selected: {props.selectedTranscript}</Typography>
      <br />
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Switch to a different transcript
      </Button>
      <SimpleDialog selectedValue={props.selectedTranscript} open={open} onClose={handleClose} />
    </div>
  );
}



export default SimpleDialogDemo;
