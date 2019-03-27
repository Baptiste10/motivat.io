import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

import SimpleSelect from './SimpleSelect'
import OwnerSelect from './OwnerSelect'
import KeywordSelect from './KeywordSelect'
import NestedTree from './NestedTree/NestedTree'


const drawerWidth = 400;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    //width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    padding: 10,
    //pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  
});





class PersistentDrawerRight extends React.Component {
  constructor(props){
    super(props);
    this.db = props.db;
    this.state = {
      selectedMap: '',
      selectedPOV: '',
      clientKeyword: '',
      coachKeyword: '',
      name: 'hai'
    };

    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handlePreviewButton = this.handlePreviewButton.bind(this);
  }

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.name==="selectedMap"){
      this.setState({
        selectedPOV: '',
        clientKeyword: '',
        coachKeyword: ''
      })
    }
  };

  handleDrawerOpen = () => {
    this.props.handleDrawerOpen();
  };

  handleDrawerClose = () => {
    this.props.handleDrawerClose();
  };

  handlePreviewButton = (value) => {
    this.props.handlePreviewButton(value);
  }
  
  
  render() {
    const { classes, theme, open } = this.props;

    let mapSelector = 
    <SimpleSelect
      handleSelectChange={this.handleSelectChange}
      selectedMap={this.state.selectedMap}
    />

    let ownerSelector;
    if (this.state.selectedMap==='Keyword Map'){
      ownerSelector=
      <OwnerSelect
        owners={this.props.owners}
        handleSelectChange={this.handleSelectChange}
        selectedPOV={this.state.selectedPOV}
      />
    }

    let keywordSelector;
    if (this.state.selectedMap==='Keyword Map'){
      keywordSelector=
      <KeywordSelect
        owners={this.props.owners}
        transcriptId={this.props.transcriptId}
        db={this.db}
        handleSelectChange={this.handleSelectChange}
        clientKeyword={this.state.clientKeyword}
        coachKeyword={this.state.coachKeyword}
      />
    }

    let nestedTree;
    if (this.state.selectedPOV !=='' && (this.state.clientKeyword !=='' || this.state.coachKeyword !== '')){
      nestedTree = <NestedTree
        mapName={this.state.selectedMap+" from "+this.state.selectedPOV+" POV"}
      />;
      this.handlePreviewButton(false);
    }

    return (
      <div className={classes.root}>
       <Drawer 
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={open}
          id={'drawer-fixed'}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
            <h1>Map Maker</h1>
            <Divider />
          </div>
          
          {mapSelector}
          {keywordSelector}
          {ownerSelector}
          {nestedTree}
          
        </Drawer>
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open,
          })}
        >
          <div className={classes.drawerHeader} />
        </main>
      </div>
    );
  }
}


PersistentDrawerRight.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PersistentDrawerRight);
