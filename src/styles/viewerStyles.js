// Filename - styles/viewerStyles.js
// styles for OSDViewer.js

// Global style (Home.js) 
export const GlobalStyle = {
  backgroundColor: '#f0f0f0',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  overflow: 'hidden',
};

// styles for split screen view (OSDViewer.js)
export const splitViewStyle = {
  verticalAlign: 'middle',
  overflow: "hidden",
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
}

// styles for each OpenSeaDragon OSDViewer
export const OSDViewerStyle = {
  height: `calc(100vh - 64px - 54px)`,
  backgroundColor: '#D0D0D0 ',
  border: '1px solid #999',
}

export const imageEachDescStyle = {
  width: '47.1vw',
  paddingLeft: '5px',
  paddingTop: '6px',
  lineHeight: '1.3'
}

export const imageDescContainerStyle = {
  bgcolor: '#f0f0f0', 
  display: 'flex', 
  flexDirection: 'row', 
  fontSize: 'smaller',
}

// general styles for sidebar icons
export const iconStyle = {
  width: '100%',
  justifyContent: 'center',
  borderRadius: '0px',
}

// styles for OSDViewer.js sidebar icons
export const IconStyle = {
  ...iconStyle,
  height: '29vh',
}

// styles for overall sidebar box  
export const sidebarBoxStyle = {
  display: 'flex', 
  bgcolor: '#f3f3f3', 
  flexDirection: 'column',
}

// styles for sidebar items
export const sidebarItemStyle = { 
  height: '100%', 
  width: '5.8vw', 
  minWidth: '50px', 	
  display: 'flex', 
  flexDirection: 'column',
}