// Filename - components/NavbarElements.js
// used in - Appbar.js

import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

// define styled component
export const NavLink = styled(Link)`
    color: #808080;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;
    &.active {
        color: #4d4dff;
    }
`