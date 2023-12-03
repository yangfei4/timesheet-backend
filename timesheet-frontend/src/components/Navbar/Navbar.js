import React from "react";

import { NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <NavLink className="navbar-brand" to="/">Timesheet</NavLink>
            <div className="navbar-nav">
                <NavLink className="nav-item nav-link" to="/summary">Summary</NavLink>
                <NavLink className="nav-item nav-link" to="/timesheet">Timesheet</NavLink>
                <NavLink className="nav-item nav-link" to="/profile">Profile</NavLink>
            </div>
        </nav>
    )
};

export default Navbar;