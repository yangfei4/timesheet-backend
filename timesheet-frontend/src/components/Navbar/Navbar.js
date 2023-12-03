import React from "react";

import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light container-fluid">
            <NavLink className="navbar-brand m-0" to="/">
                <img src='https://www.freeiconspng.com/uploads/website-icon-21.png' width="50" type="image" padding='10px' />
            </NavLink>
            <div className="navbar-nav">
                <NavLink className="nav-item nav-link" to="/summary">Summary</NavLink>
                <NavLink className="nav-item nav-link" to="/timesheet">Timesheet</NavLink>
                <NavLink className="nav-item nav-link" to="/profile">Profile</NavLink>
            </div>
        </nav>
    )
};

export default Navbar;