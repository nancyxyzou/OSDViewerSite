// Filename - pages/OSDViewer.js
// page displaying the  Viewer

import React, { useState, useEffect, useRef } from "react";
import OpenSeadragon from "openseadragon";
import ButtonAppBar from "../components/Appbar"; // top app bar
import SideBar from "../components/SideBar"; // side bar
import { splitViewStyle, OSDViewerStyle, imageEachDescStyle, imageDescContainerStyle } from "../styles/viewerStyles"; // stylings

const fetchDocuments = require("../api/fetchDummyDocs");    

export const Viewer = () => {
    // store the selected image for each viewer
    const [selectedImageL, setSelectedImageL] = useState(0); // L = left
    const [selectedImageR, setSelectedImageR] = useState(0); // R = right
    // store the previously selected image for each viewer
    const prevSelectedImageL = useRef(0);
    const prevSelectedImageR = useRef(0);

    // hold each OSD viewer instance
    const viewerLRef = useRef('');
    const viewerRRef = useRef('');

    // references to do with the sidebar
    const [RSideVisible, setRSideVisible] = useState(false); // store the viewable state of the right viewer & right dropdown
    const fullscreened = useRef(false); // store the fullscreen status of page
    const synced = useRef(false); // store the state of the synchronized viewer option
    const [syncChecked, setSyncChecked] = useState(false); // store the state of the synced button
    
    // references to do with the app bar
    const [dropdownOptions, setDropdownOptions] = useState([]); // store the dropdown options for both dropdown menus

    // stores the specific set of images from cosmos db
    const imagesGroup = useRef(0);
    const imageDescL = useRef("");
    const imageDescR = useRef("");

    useEffect(() => {
        // FETCH IMAGES INFORMATION - START //
        fetchDocuments().then(group => {
            imagesGroup.current = group.images; // set the specific set of images

            // get selected image from cosmos db to display in left viewer
            for ( var i = 0 ; i < imagesGroup.current.length ; i++ ) {
                if (i === JSON.parse(selectedImageL)) {
                    const imageInfoL = imagesGroup.current[i].source;
                    imageDescL.current = imagesGroup.current[i].description;
                    callViewerL(imageInfoL); // call left viewer with left image info
                }
            }
            
            // get selected image from cosmos db to display in right viewer
            for ( var j = 0 ; j < imagesGroup.current.length ; j++ ) {
                if (j === JSON.parse(selectedImageR)) {
                    const imageInfoR = imagesGroup.current[j].source;
                    imageDescR.current = imagesGroup.current[j].description;
                    callViewerR(imageInfoR); // call right viewer with right image info
                }
            }
            // FETCH IMAGES INFORMATION - END //    
            
            // INITIALIZE + CALL VIEWERS //
            function callViewerL(imageInfoL) { // left viewer
                // initialize viewer if it has not already been initialized
                if (!viewerLRef.current) {
                    viewerLRef.current = OpenSeadragon({
                        id: 'osd-viewerL',
                        prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
                        tileSources: imageInfoL,
                        showNavigator: true,
                        navigatorWidth: '200px',
                        navigatorHeight: '180px',
                    });
                }
                else {
                    // update viewer with the image selected in dropdown
                    viewerLRef.current.open(imageInfoL);
                }
            }
            
            function callViewerR(imageInfoR) { // right viewer       
                // initialize if right components are visible
                if (RSideVisible) {
                    if (!viewerRRef.current) {
                        viewerRRef.current = OpenSeadragon({
                            id: 'osd-viewerR',
                            prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
                            tileSources: imageInfoR,
                            showNavigator: true,
                            navigatorWidth: '200px',
                            navigatorHeight: '180px',
                        });
                    }
                    // to avoid generating extra viewers: if right viewer already exists, destroy and create a new one
                    else if (RSideVisible) {
                        viewerRRef.current.destroy(); 
                        viewerRRef.current = OpenSeadragon({
                            id: 'osd-viewerR',
                            prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
                            tileSources: imageInfoR,
                            showNavigator: true,
                            navigatorWidth: '200px',
                            navigatorHeight: '180px',
                        });
                    }
                    else {
                        // update viewer with the image selected in dropdown
                        viewerRRef.current.open(imageInfoR);
                    }
                }
            }
            // INITIALIZE VIEWERS //

            
            // POPULATE DROPDOWN MENUS - START //
            const options = [];
            // populate array with each image in the imagesGroup
            for (let i = 0; i < imagesGroup.current.length; i++) {
                options.push(
                    <option key={i} value={i}>
                        {imagesGroup.current[i].name}
                    </option>
                );
            }
            setDropdownOptions(options); // populate both menus with the same array
            // POPULATE DROPDOWN MENUS - END //


            // DROPDOWN MENUS - START //
            const dropdownL = document.getElementById('image-dropdownL');
            function switchImageL() { // switch to selected image from dropdown
                const selectedIndex = dropdownL.selectedIndex;
                const selectedValue = dropdownL.options[selectedIndex].value;
                setSelectedImageL(selectedValue);
            }
            dropdownL.addEventListener('change', switchImageL);

            const dropdownR = document.getElementById('image-dropdownR');
            function switchImageR() {
                const selectedIndex = dropdownR.selectedIndex;
                const selectedValue = dropdownR.options[selectedIndex].value;
                setSelectedImageR(selectedValue);
            }
            if (RSideVisible) { 
                dropdownR.addEventListener('change', switchImageR);
            }
            // DROPDOWN MENUS - END //


            // remove event listeners when components unmount
            return () => {
                dropdownL.removeEventListener('change', switchImageL);
                if (RSideVisible) {
                    dropdownR.removeEventListener('change', switchImageR);
                }
            };
        }).catch(error => {
            console.error("Error fetching documents:", error);
        });
    }, [selectedImageL, selectedImageR, viewerLRef, viewerRRef, RSideVisible])


    // FULL SCREEN TOGGLE - START //
    useEffect(() => {
        const handleFullscreenChange = () => {
            fullscreened.current = document.fullscreenElement;
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    })
    // FULL SCREEN TOGGLE - END //


    // SYNCED ANIMATION - START //
    useEffect(() => {
        const syncSwitch = document.getElementById('synced-viewer-option');
        
        // remove left synced handlers when: single view, changing images in splitview
        if (viewerLRef.current && (!RSideVisible || !(prevSelectedImageL.current === selectedImageL) || !(prevSelectedImageR.current === selectedImageR))) {
            viewerLRef.current.removeAllHandlers('animation');
            viewerLRef.current.removeAllHandlers('animation-finish');
            viewerLRef.current.removeAllHandlers('canvas-press');
            viewerLRef.current.removeAllHandlers('canvas-scroll');
            viewerLRef.current.removeAllHandlers('container-enter');
        }

        function setSync() {
            // set neither viewer to be leading
            var viewerLLeading = false;
            var viewerRLeading = false;

            // change synced status
            synced.current = !synced.current;
            setSyncChecked(synced.current);

            // turn off sync if unchecked and both viewers exist
            if (!synced.current && viewerLRef.current && viewerRRef.current) {
                // remove all animation handlers
                viewerLRef.current.removeAllHandlers('animation');
                viewerRRef.current.removeAllHandlers('animation');
                viewerLRef.current.removeAllHandlers('animation-finish');
                viewerRRef.current.removeAllHandlers('animation-finish');
    
                // remove all leading event handlers
                viewerLRef.current.removeAllHandlers('canvas-press');
                viewerRRef.current.removeAllHandlers('canvas-press');
                viewerLRef.current.removeAllHandlers('canvas-scroll');
                viewerRRef.current.removeAllHandlers('canvas-scroll');
                viewerLRef.current.removeAllHandlers('container-enter');
                viewerRRef.current.removeAllHandlers('container-enter');
            }
            else { // turning sync on
                var viewerLLeadingHandler = function() {
                    viewerLLeading = true; // set viewerL as lead
                    viewerRLeading = false; // unset viewerR as lead
                }
                var viewerRLeadingHandler = function() {
                    viewerLLeading = false; // unset viewerL as lead
                    viewerRLeading = true; // set viewerR as lead
                }

                var viewerLAnimationHandler = function() {
                    // sync zoom/pan from viewerL to viewerR
                    if (viewerLLeading) {
                        viewerRRef.current.viewport.zoomTo(viewerLRef.current.viewport.getZoom(true), null, true);
                        viewerRRef.current.viewport.panTo(viewerLRef.current.viewport.getCenter(true), true);
                    }
                };
                var viewerRAnimationHandler = function() {
                    // sync zoom/pan from viewerR to viewerL
                    if (viewerRLeading) {
                        viewerLRef.current.viewport.zoomTo(viewerRRef.current.viewport.getZoom(true), null, true);
                        viewerLRef.current.viewport.panTo(viewerRRef.current.viewport.getCenter(true), true);
                    }
                };

                // attach animation event handles to sync the zoom/pan between viewers
                viewerLRef.current.addHandler('animation',viewerLAnimationHandler);
                viewerRRef.current.addHandler('animation',viewerRAnimationHandler);
                viewerLRef.current.addHandler('animation-finish',viewerLAnimationHandler);
                viewerRRef.current.addHandler('animation-finish',viewerRAnimationHandler);

                // attach leading event handlers to update lead status when the viewer is interacted with
                viewerLRef.current.addHandler('canvas-press',viewerLLeadingHandler);
                viewerRRef.current.addHandler('canvas-press',viewerRLeadingHandler);
                viewerLRef.current.addHandler('canvas-scroll',viewerLLeadingHandler);
                viewerRRef.current.addHandler('canvas-scroll',viewerRLeadingHandler);
                viewerLRef.current.addHandler('container-enter',viewerLLeadingHandler);
                viewerRRef.current.addHandler('container-enter',viewerRLeadingHandler);
            }
        }
        if (RSideVisible) {
            syncSwitch.addEventListener('click', setSync);
        }

        return () => {
            if (RSideVisible) {
                syncSwitch.removeEventListener('click', setSync);
                synced.current = false;
                setSyncChecked(false);
            }
        }
    }, [RSideVisible, selectedImageL, selectedImageR])
    // SYNCED ANIMATION - END //
    
    
    // Toggle the visibility of the right components (ie. toggle split screen) via sidebar button
    const toggleRSide = () => {
        setRSideVisible(prevState => !prevState);
    };

    // Toggle the fullscreen status via sidebar button
    const toggleFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    };

    // toggle changes in left and right dropdowns
    const toggleDropdownChangeL = (event) => {
        setSelectedImageL(event.target.value);
    };
    const toggleDropdownChangeR = (event) => {
        setSelectedImageR(event.target.value);
    };

    return (
        <div>
            <ButtonAppBar
                toggleDropdownChangeL={toggleDropdownChangeL}
                toggleDropdownChangeR={toggleDropdownChangeR}
                selectedImageL={selectedImageL}
                selectedImageR={selectedImageR}
                RSideVisible={RSideVisible}
                dropdownOptions={dropdownOptions}
            />
            <div style={{display: 'flex'}}>
                <SideBar 
                    toggleRSide={toggleRSide} 
                    toggleFullscreen={toggleFullscreen}
                    RSideVisible={RSideVisible}
                    syncChecked={syncChecked}
                />
                <div style={{display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
                    <div style={splitViewStyle}> 
                        {RSideVisible ? <div id="osd-viewerL" style={{...OSDViewerStyle, width: '47.1vw'}} /> : <div id="osd-viewerL" style={{...OSDViewerStyle, width: '94.2vw'}} />}
                        {RSideVisible ? <div id="osd-viewerR" style={{...OSDViewerStyle, width: '47.1vw'}} /> : ''}
                    </div>
                    <div style={imageDescContainerStyle}>
                        {RSideVisible ? <div style={imageEachDescStyle}>
                            <b>Image 1 Description: </b> {imageDescL.current}
                        </div> : 
                        <div style={{width: '94.2vw', paddingTop: '10px', paddingLeft: '10px'}}>
                            <b>Image Description: </b> {imageDescL.current}
                        </div>}

                        {RSideVisible ? <div style={imageEachDescStyle}> 
                            <b>Image 2 Description: </b> {imageDescR.current}
                        </div> : ''}
                    </div>
                </div>
            </div>
        </div>
    );
}