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

import { signup_api } from '../../services/authServices';
import { getJwtPayload } from "../../utils/jwtParser";
import { setLogin_action, getProfile_action, getSummaryList_action } from "../../actions/actions";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="gfei4.github.io">
        Yangfei
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const defaultTheme = createTheme();

export default function SignUp() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    // event.preventDefault();
    // const data = new FormData(event.currentTarget);
    // console.log({
    //   email: data.get('email'),
    //   password: data.get('password'),
    // });
    try {
      // API service call
      const data = await signup_api(username, email, password);
      const jwt = data?.token;

      if(jwt) {
        // parse jwt token
        const decodedToken = getJwtPayload(jwt);
        console.log(decodedToken);
        const userId = decodedToken.sub;
        
        // if successful, set localStorage
        localStorage.setItem('JWT', jwt);
        localStorage.setItem('userId', userId);
        dispatch(setLogin_action(true));
        dispatch(getProfile_action(userId));
        dispatch(getSummaryList_action(userId));

        setMessage("SignUp Successful");
        setDialogOpen(true);
      }
      else {
        setMessage("Invalid credentials");
        setDialogOpen(true);
      }
  } catch (error) {
      // else, display error message in Dialog
      console.error('Error signing up:', error);
      setMessage("Invalid credentials");
      setDialogOpen(true);
  }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    if(message === "SignUp Successful") {
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
              Sign up
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid>
              </Grid>
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleSubmit}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>
      </ThemeProvider>
      <Dialog
          open={dialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
      >
          <DialogTitle id="alert-dialog-title">Sign Up</DialogTitle>
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
