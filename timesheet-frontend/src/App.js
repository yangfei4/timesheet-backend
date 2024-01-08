import './App.scss';

import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Navbar from './components/Navbar';
import Summary from './components/Summary';
import Timesheet from './components/Timesheet';
import Profile from './components/Profile';
import WelcomePage from './components/Pages/WelcomePage';
import NotFoundPage from './components/Pages/NotFoundPage';

import { getProfile_action, getSummaryList_action, setSelectedTimesheet_action } from './actions/actions';

import 'bootstrap/dist/css/bootstrap.min.css';
import { Flag } from '@mui/icons-material';

function App() {
  const dispatch = useDispatch();

  let isLoggedIn = () => {
    // remove localStorage first
    localStorage.removeItem('userId');
    let curJWT = localStorage.getItem('JWT');
    let curUserId = localStorage.getItem('userId');
    return curJWT && curUserId;
  }

  if(isLoggedIn) {
    console.log("User is logged in");
    // localStorage.setItem('userId', "6562a47d15353d2dfd584127"); // To be removed, Alex
    localStorage.setItem('userId', "6562a44315353d2dfd584126"); // To be removed, Yangfei
    dispatch(getProfile_action(localStorage.getItem('userId')));
    dispatch(getSummaryList_action(localStorage.getItem('userId')));
  }

  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Navbar />
        </header>
        <main className='page-container'>
          <Routes>
            <Route path="/summary" element={<Summary/>} />
            <Route path="/timesheet" element={<Timesheet/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/" element={
              (isLoggedIn) ? (<Navigate to="/summary" />) : (<WelcomePage/>)
            } />
            <Route path="*" element={<NotFoundPage/>} />
            <Route path="/login" element={<WelcomePage/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;