import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
    return (
        <div>
            <Navbar>
                <nav className="navbar navbar-expand-lg navbar-light bg-light container-fluid">
                    <Nav.Item>
                        <Link className="navbar-brand m-0" to="/">
                        <img src='https://www.freeiconspng.com/uploads/website-icon-21.png' width="50" type="image" padding='10px' />
                        </Link>
                    </Nav.Item>
                </nav>
            </Navbar>
            <div className="App">
                    <div>
                        <p>Welcome to Employee Timesheet System</p>
                        <div>
                            <p>You have not logged in yet. </p>
                            <button
                            type="button"
                            className="btn btn-link"
                            onClick={(e) => {
                                e.preventDefault();
                                window.location.href='http://localhost:3001';
                            }}
                            > Log In</button>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default WelcomePage;