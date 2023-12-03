import './App.scss';

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Summary from './components/Summary';
import Timesheet from './components/Timesheet';
import Profile from './components/Profile';
import WelcomePage from './components/Pages/WelcomePage';
import NotFoundPage from './components/Pages/NotFoundPage';

import 'bootstrap/dist/css/bootstrap.min.css';

function isLoggedIn() {
  let curJWT = localStorage.getItem('JWT');
  let curUserId = localStorage.getItem('userId');
  // return curJWT && curUserId;
  return true;
}

function App() {

  return (
    isLoggedIn() ? 
      (<div className="App">
        <header className="App-header">
          <Navbar />
        </header>
        <Routes>
          <Route path="/summary" element={<Summary/>} />
          <Route path="/timesheet" element={<Timesheet/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/" element={<Navigate to="/summary" />} />
          <Route path="*" element={<NotFoundPage/>} />
        </Routes>
      </div>
      )
      :
      (
        <WelcomePage />
      )
  );
}

export default App;