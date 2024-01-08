import React from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div className="App">
                    <div>
                        <h4>Welcome to Employee Timesheet System</h4>
                        <div>
                            <p>You have not logged in yet. </p>
                            <button
                            type="button"
                            className="btn btn-link"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/login');
                            }}
                            > Log In</button>
                        </div>
                    </div>
            </div>
        </div>
    )
}

export default WelcomePage;