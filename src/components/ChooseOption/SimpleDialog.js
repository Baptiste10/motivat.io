import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import SimpleDialogStyle from './SimpleDialogStyle.css'


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
  const { onClose, selectedValue,transcriptList, ...other } = props;
  const transcriptNames = transcriptList;

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
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
    props.handleClickOpen();
  }

  const handleClose = value => {
    setOpen(false);
    props.handleClose(value)
  };


  return (
    <div>
      <Typography variant="subtitle1">Selected: {props.selectedTranscript}</Typography>
      <br />
      <Fab color="secondary" aria-label="Add" onClick={handleClickOpen} className="fabButton">
        <AddIcon />
      </Fab>
      <SimpleDialog selectedValue={props.selectedTranscript} open={open} onClose={handleClose} transcriptList={props.transcriptList} />
    </div>
  );
}



export default SimpleDialogDemo;
