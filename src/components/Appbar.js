// Filename - Appbar.js
// top app bar for the viewer (OSDViewer.js)

import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MuiAppBar from '@mui/material/AppBar';
import { NavLink } from 'react-router-dom';

// ButtonAppBar component representing the top app bar for the viewer
const ButtonAppBar = ({ toggleDropdownChangeL, toggleDropdownChangeR, selectedImageL, selectedImageR, RSideVisible, dropdownOptions }) => {
    return (
      <Box sx={{ flexGrow: 1, width: '100%' }}>
        <MuiAppBar position="static">
            <Toolbar style={{display: 'flex', flexDirection: 'row'}} sx={{bgcolor: '#004643'}}> 
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <NavLink to='/' style={{ color: 'white', textDecoration: 'none' }}>OpenSeadragon Gallery</NavLink>
                </Typography>

                {/* dropdown menu for single viewer display */}
                <div style={{display: 'flex' }}>
                    {!RSideVisible && (
                        <div style={{display: 'flex'}}>
                            <p>Image:</p>
                            <select id="image-dropdownL" 
                                value={selectedImageL} 
                                onChange={toggleDropdownChangeL} 
                                style={{margin: '5px'}}
                            >
                                {dropdownOptions}
                            </select>
                        </div>
                    )}


                    {/* dropdown menus for splitscreen viewers display */}
                    {RSideVisible && (
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{display: 'flex', width: '' }}>
                                <p>Image 1: </p>
                                <select id="image-dropdownL" 
                                    value={selectedImageL} 
                                    onChange={toggleDropdownChangeL} 
                                    style={{margin: '5px'}}
                                >
                                    {dropdownOptions}
                                </select>
                            </div>

                            <div style={{display: 'flex', width: '47.1vw', justifyContent: 'right' }}>
                                <p>Image 2:</p>
                                <select id="image-dropdownR" 
                                    value={selectedImageR} 
                                    onChange={toggleDropdownChangeR} 
                                    style={{margin: '5px'}}
                                >
                                    {dropdownOptions}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </Toolbar>
        </MuiAppBar>
      </Box>
    );
}

export default ButtonAppBar;