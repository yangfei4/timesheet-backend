import * as React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";

import { login_api } from "../../services/authServices";
import { getJwtPayload } from "../../utils/jwtParser";
import { setLogin_action, getProfile_action, getSummaryList_action } from "../../actions/actions";

import "./SignIn.scss";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://yangfei4.github.io/">
        Yangfei
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignIn() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("demo123");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
      try {
          // API service call
          const data = await login_api(username, password);
          const jwt = data?.token;

          if(jwt) {
            // parse jwt token
            const decodedToken = getJwtPayload(jwt);
            const userId = decodedToken.sub;

            // if successful, set localStorage
            localStorage.setItem('JWT', jwt);
            
            localStorage.setItem('userId', userId);
            dispatch(setLogin_action(true));
            dispatch(getProfile_action(userId));
            dispatch(getSummaryList_action(userId));

            setMessage("Login Successful");
            setDialogOpen(true);
          }
          else {
            setMessage("Invalid username or password");
            setDialogOpen(true);
          }
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
    <div>
          <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSubmit}
            >
              Sign In
            </Button>
            </Grid>
            <Grid container justifyContent="flex-end">
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item> 
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
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
    </div>
  );
}
