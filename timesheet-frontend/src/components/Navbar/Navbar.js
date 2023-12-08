import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

const Navbar = () => {
    const profile = useSelector(state => state.user_profile);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark container-fluid">
            <NavLink className="navbar-brand m-0" to="/">
                <img src='https://www.freeiconspng.com/uploads/website-icon-21.png' width="50" type="image" padding='10px' />
            </NavLink>
            <div className="navbar-nav ms-auto">
                <NavLink className="nav-item nav-link" to="/summary">Summary</NavLink>
                <NavLink className="nav-item nav-link" to="/timesheet">Timesheet</NavLink>
                <NavLink className="nav-item nav-link" to="/profile">Profile</NavLink>
            </div>
        </nav>
    )
};

export default Navbar;