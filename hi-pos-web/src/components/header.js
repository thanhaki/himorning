import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import NavMenu from "./navMenu";
import Drawer from '@mui/material/Drawer';
import { connect } from 'react-redux';
import MenuRight from './menuRight';
import logoPng from '../assets/images/himorning-logo.jpg';
import { useNavigate } from 'react-router-dom';

function Header(props) {
    const [state, setState] = useState({
    left: false,
  });
  const navigate = useNavigate()
  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  const imageLogoClick = () => {
    navigate("/");
  } 
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer('left', true)}
          >
            {props.isLoggedIn && <MenuIcon />}
          </IconButton>
          <Box sx={{ flexGrow: 1, display: 'flex', pr:1, pt:1, pb:1}}>
            <img src={logoPng} width="64px" height="64px" style={{borderRadius: 0.25 + 'em', cursor: "pointer"}} onClick={() => imageLogoClick()}/>
          </Box>
          {props.isLoggedIn && <MenuRight />}
        </Toolbar>
      </AppBar>
      <React.Fragment>
        {props.isLoggedIn && <Drawer
          anchor={'left'}
          open={state['left']}
          onClose={toggleDrawer('left', false)}
        >
          <NavMenu />
        </Drawer>}
      </React.Fragment>
    </Box>
  );
}
function mapStateToProps(state) {
  const { isLoggedIn } = state.appReducers.auth;
  const { message } = state.appReducers.message;
  return {
    isLoggedIn,
    message
  };
}

export default connect(mapStateToProps)(Header);