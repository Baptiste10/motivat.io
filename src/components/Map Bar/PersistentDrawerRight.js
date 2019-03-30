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
import PrecisionSelect from './PrecisionSelect'
import OwnerSelect from './OwnerSelect'
import KeywordSelect from './KeywordSelect'
import NestedTree from '../NestedTree/NestedTree'
import SubtypeCards from './SubtypeCards'


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
      selectedPrecision: '',
      clientKeyword: '',
      coachKeyword: '',
      name: 'hai'
    };
  }

  handleSelectChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    if (event.target.name==="selectedMap"){
      this.setState({
        selectedPOV: '',
        clientKeyword: '',
        coachKeyword: '',
        subtypeList: null
      })
    }
    if (event.target.name==="selectedPrecision"){
      this.props.db.miMap(this.props.transcriptId, this.props.owners[0][0], event.target.value).then(
        subtypesList =>{
          this.setState({subtypeList: subtypesList})
        }
      );
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

    //Render Map selector Button
    let mapSelector = 
    <SimpleSelect
      handleSelectChange={this.handleSelectChange}
      selectedMap={this.state.selectedMap}
    />

    //Render the Precision Button selector
    let precisionSelector;
    //Only if user picked the MI Map
    if (this.state.selectedMap === 'MI Map') {
      precisionSelector = 
      <PrecisionSelect
        selectedPrecision={this.state.selectedPrecision}
        handleSelectChange={this.handleSelectChange}
      />
    }

    // Render a list of Subtype Cards 
    let miList;
    if (this.state.subtypeList !== null && this.state.subtypeList !== undefined){
       miList = (<ul>
          {this.state.subtypeList.map(
            (subtype) =>
              <SubtypeCards 
                key={subtype.subtype.toString()}
                content={subtype}
              />
            )}
        </ul>);
    }

    // Render the owner selector
    let ownerSelector;
    //Only if the map chosen is the Keyword Map
    if (this.state.selectedMap==='Keyword Map'){
      ownerSelector=
      <OwnerSelect
        owners={this.props.owners}
        handleSelectChange={this.handleSelectChange}
        selectedPOV={this.state.selectedPOV}
      />
    }

    //Render the keyword selector
    let keywordSelector;
    //Only if the Keyword Map were selected
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

    //Render a nested tree
    let nestedTree;
    //Only if a POV and at least one keyword had been selected
    if (this.state.selectedPOV !=='' && (this.state.clientKeyword !=='' || this.state.coachKeyword !== '')){
      nestedTree = <NestedTree
        previewButton={this.handlePreviewButton}
        mapName={this.state.selectedMap+" from "+this.state.selectedPOV+" POV"}
      />;
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
          {precisionSelector}
          {miList}
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
