// Filename - components/SideBar.js
// side bar for View.js

import * as React from 'react';
// import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

// styling for sidebar boxes, items of the sidebar, and icons
import { sidebarBoxStyle, sidebarItemStyle, IconStyle } from '../styles/viewerStyles';

// import side bar icons and divider
import FullscreenIcon from '@mui/icons-material/Fullscreen'; // full screen icon
import { CgViewSplit } from "react-icons/cg"; // splitscreen icon
import SyncIcon from '@mui/icons-material/Sync'; // sync view on icon
import SyncDisabledIcon from '@mui/icons-material/SyncDisabled'; // sync view off icon
import { Divider } from '@mui/material';

// Sidebar component representing the side bar for the  viewer
const SideBar = ({toggleRSide, toggleFullscreen, RSideVisible, syncChecked}) => {
  
  return (
    <Box sx={{ ...sidebarBoxStyle, justifyContent: 'space-around' }}>
      <List style={{ ...sidebarItemStyle, justifyContent: 'space-around' }}>
        <Divider />

        {/* full screen */}
        <ListItem disablePadding style={{ justifyContent: 'center' }}>
          <IconButton onClick={toggleFullscreen} style={IconStyle} title="Toggle Fullscreen View">
            <FullscreenIcon style={{ fontSize: '130%' }} />
          </IconButton>
        </ListItem>
        
        <Divider />

        {/* split screen */}
        <ListItem disablePadding style={{ justifyContent: 'center' }}>
          <IconButton onClick={toggleRSide} style={IconStyle} title="Toggle Split Screen View">
            {<CgViewSplit style={{ fontSize: '120%' }} />}
          </IconButton>
        </ListItem>

        <Divider />

        {/* sync disabled with 1 viewer */}
        {!RSideVisible && (
          <ListItem disablePadding style={{ justifyContent: 'center' }}>
            <IconButton style={IconStyle} title="Disabled: Toggle Synchronized Viewers">
              {<SyncDisabledIcon style={{ fontSize: '120%' }} />}
            </IconButton>
          </ListItem>
        )}
        {/* sync with 2 viewers (enabled when sync is set) */}
        {RSideVisible && (
          <ListItem disablePadding style={{ justifyContent: 'center' }}>
            <IconButton id="synced-viewer-option" style={IconStyle} title="Toggle Synchronized Viewers" >
              {syncChecked ? <SyncIcon style={{ fontSize: '120%' }} /> : <SyncDisabledIcon style={{ fontSize: '120%' }} />}
            </IconButton>
          </ListItem>
        )}
        
        <Divider />
      </List>
    </Box>
  );
}

export default SideBar;