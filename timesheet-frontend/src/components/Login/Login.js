import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { InputLabel, OutlinedInput, FormControl, TextField, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

import "./Login.scss";
import { login_api } from "../../services/authServices";
import { getJwtPayload } from "../../utils/jwtParser";
import { setLogin_action, getProfile_action, getSummaryList_action } from "../../actions/actions";

const Login = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [message, setMessage] = useState("");

    const signIn = async () => {
        try {
            // API service call
            const data = await login_api(username, password);
            const jwt = data?.token;
            console.log("User logged in successfully");

            // parse jwt token
            const decodedToken = getJwtPayload(jwt);
            const userId = decodedToken.sub;

            // if successful, set localStorage
            localStorage.setItem('JWT', jwt);
            localStorage.setItem('userId', userId);
            dispatch(setLogin_action(true));
            dispatch(getProfile_action(localStorage.getItem('userId')));
            dispatch(getSummaryList_action(localStorage.getItem('userId')));

            setMessage("Login Successful");
            setDialogOpen(true);
        } catch (error) {
            // else, display error message in Dialog
            console.error('Error logging in:', error);
            setMessage("Invalid username or password");
            setDialogOpen(true);
        }
    }

    const handleDialogClose = () => {
        setDialogOpen(false);
        if(message === "Login Successful") {
            navigate('/summary');
        }
    }

    return (
        <div className="App">
        <header className="App-header">
            <div className="Login">
                <TextField
                    variant="standard"
                    placeholder="Username"
                    margin="normal"
                    required
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    label="Username"
                />
                <TextField
                    variant="standard"
                    placeholder="Password"
                    margin="normal"
                    required
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    label="Password"
                />

                <div className="Button">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={signIn}
                    >
                        Log In
                    </Button>
                        
                </div>
            </div>
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Sign In</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Okay
                    </Button>
                </DialogActions>
            </Dialog>
        </header>
    </div>
    );
}

export default Login;