import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { fade } from '@material-ui/core/styles/colorManipulator';

import SimpleSelect from './SimpleSelect'
import OwnerSelect from './OwnerSelect'
import Maps from '../StitchApp/MapsBuilder'
import KeywordSelect from './KeywordSelect'


const drawerWidth = 400;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },
  hide: {
    display: 'none',
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
      open: false,
      selectedMap: '',
      selectedPOV: '',
      clientKeyword: '',
      coachKeyword: '',
      name: 'hai'
    };

    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.getMapOptions = this.getMapOptions.bind(this)
  }

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    console.log('Map picked: ', event.target.value)
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  
  getMapOptions = () => {
    var mapNames = Object.getOwnPropertyNames(Maps.prototype);
    var index = mapNames.indexOf('constructor');
    if (index > -1) {
      mapNames.splice(index, 1);
    return mapNames;
  }
  

  }
  render() {
    const { classes, theme } = this.props;
    const { open } = this.state;
    const mapOptions = this.getMapOptions();

    let mapSelector = <SimpleSelect
      handleSelectChange={this.handleSelectChange}
      selectedMap={this.state.selectedMap}
    />
    let ownerSelector;
    if (this.state.selectedMap=='Keyword Map'){
      ownerSelector=<OwnerSelect
        owners={this.props.owners}
        handleSelectChange={this.handleSelectChange}
        selectedPOV={this.state.selectedPOV}
      />
    }
    let keywordSelector;
    if (this.state.selectedMap=='Keyword Map'){
      keywordSelector=<KeywordSelect
        owners={this.props.owners}
        handleSelectChange={this.handleSelectChange}
        clientKeyword={this.state.clientKeyword}
        coachKeyword={this.state.coachKeyword}
      />

    }

    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap>
              Motivat.io
            </Typography>
          </Toolbar>
        </AppBar>
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
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            <h1>Map Maker</h1>
            <Divider />
          </div>
          
          {mapSelector}
          {keywordSelector}
          {ownerSelector}
          
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
