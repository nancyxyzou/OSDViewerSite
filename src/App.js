// Filename - src/App.js
// routing and rendering different pages

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { GlobalStyle } from "./styles/viewerStyles";
import { Viewer } from "./pages/OSDViewer";

function App() {
  return (
    <div style={GlobalStyle}>
      <Router>
        <div style={{ display: 'flex' }}>
          <Routes>
            <Route path="/OSDViewer" element ={<Viewer />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;