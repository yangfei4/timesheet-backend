import './App.scss';

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Navbar from './components/Navbar';
import Summary from './components/Summary';
import Timesheet from './components/Timesheet';
import Profile from './components/Profile';
import WelcomePage from './components/Pages/WelcomePage';
import NotFoundPage from './components/Pages/NotFoundPage';

import { getProfile_action, getSummaryList_action, setSelectedTimesheet_action } from './actions/actions';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const dispatch = useDispatch();

  let isLoggedIn = () => {
    localStorage.setItem('userId', "6562a44315353d2dfd584126"); // To be removed
    let curJWT = localStorage.getItem('JWT');
    let curUserId = localStorage.getItem('userId');
    // return curJWT && curUserId;
    return true;
  }

  if(isLoggedIn) {
    localStorage.setItem('userId', "6562a44315353d2dfd584126"); // To be removed
    dispatch(getProfile_action(localStorage.getItem('userId')));
    dispatch(getSummaryList_action(localStorage.getItem('userId')));
  }

  return (
    isLoggedIn ? 
      (<div className="App">
        <header className="App-header">
          <Navbar />
        </header>
        <main className='page-container'>
          <Routes>
            <Route path="/summary" element={<Summary/>} />
            <Route path="/timesheet" element={<Timesheet/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/" element={<Navigate to="/summary" />} />
            <Route path="*" element={<NotFoundPage/>} />
          </Routes>
        </main>
      </div>
      )
      :
      (
        <WelcomePage />
      )
  );
}

export default App;