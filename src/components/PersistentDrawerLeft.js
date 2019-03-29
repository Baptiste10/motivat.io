import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';

import FullWidthTabs from './OwnersTabs'


const drawerWidth = 400;

const styles = theme => ({
  root: {
    display: 'flex',
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
    justifyContent: 'flex-end',
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





class PersistentDrawerLeft extends React.Component {
  constructor(props){
    super(props);
    this.db = props.db;
    this.state = {
      coachSentenceList: [],
      clientSentenceList: [],
      tabValue: 0,
      activeOwnerId: 0
    };
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
    this.handleSearchQuery = this.handleSearchQuery.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleTabChangeIndex = this.handleTabChangeIndex.bind(this);
  }

  handleTabChange = (event, tabValue) => {
    var newOwnerId = 'pick a transcript first';
    var newOwnerName = 'pick a transcript first';
    try{
      newOwnerId = this.props.owners[tabValue][0];
      newOwnerName = this.props.owners[tabValue][1];
    }catch(e){};
    console.log('New Active Owner: ', newOwnerName);
    this.setState({ 
      tabValue, 
      activeOwnerId: newOwnerId
    });
  };

  handleTabChangeIndex = index => {
    this.setState({ 
      tabValue: index,
    });
  };

  handleDrawerOpen = () => {
    this.props.handleDrawerOpen();
  };

  handleDrawerClose = () => {
    this.props.handleDrawerClose()
  };

  handleSearchQuery = (text) => {
    if(text[text.length -1]==="."){
      text = text.replace('/.','');
      this.db.searchHandler(text, this.props.transcriptId, this.state.activeOwnerId).then(result =>{
        if(typeof result[1] !== 'undefined' && result[1].length > 0){
          this.setState({coachSentenceList: result[1]});
        }
        if(typeof result[0] !== 'undefined' && result[0].length > 0){
          this.setState({clientSentenceList: result[0]});
        }
      });
    }
  }

  render() {
    const { classes, theme, open } = this.props;

    return (
      <div className={classes.root}>
       <Drawer 
          className={classes.drawer}
          variant="persistent"
          anchor="left"
          open={open}
          id={'drawer-fixed'}
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <div className={classes.drawerHeader}>
            <div className={classes.search}>
              <IconButton 
                className={classes.searchIcon} 
                aria-label="Search"
                >
                <SearchIcon />
              </IconButton>
              <InputBase
                placeholder="Search…"
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                onChange={e => {
                  let text = e.target.value;
                  this.handleSearchQuery(text);
                }}
            />
          </div>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
            <Divider />
          </div>
          
          

          <FullWidthTabs
            tabValue={this.state.tabValue}
            handleTabChange={this.handleTabChange}
            handleTabChangeIndex={this.handleTabChangeIndex}
            coachSentenceList={this.state.coachSentenceList}
            clientSentenceList={this.state.clientSentenceList}
            db={this.props.db}
          />

          
        </Drawer>
      </div>
    );
  }
}

PersistentDrawerLeft.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(PersistentDrawerLeft);
