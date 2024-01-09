import './App.scss';

import React, { useEffect } from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Navbar from './components/Navbar';
import Summary from './components/Summary';
import Timesheet from './components/Timesheet';
import Profile from './components/Profile';
import WelcomePage from './components/Pages/WelcomePage';
import NotFoundPage from './components/Pages/NotFoundPage';
import Login from './components/Login';
import SignUp from './components/Signup';
import { ifJwtExpired } from './utils/jwtParser';

import { getProfile_action, getSummaryList_action, setLogin_action } from './actions/actions';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const dispatch = useDispatch();
  const isLoggedIn_store = useSelector(state => state.isLoggedIn);

  useEffect(() => {
    if(isLoggedIn_store) {
      if(!localStorage.getItem('JWT') || ifJwtExpired(localStorage.getItem('JWT'))) {
        dispatch(setLogin_action(false));
        localStorage.removeItem('JWT');
        localStorage.removeItem('userId');
      }
      else{
        dispatch(getProfile_action(localStorage.getItem('userId')));
        dispatch(getSummaryList_action(localStorage.getItem('userId')));
      }
    }
  }, [isLoggedIn_store]);

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
            <Route path="/" element={<Navigate to="/summary" />} />  
            <Route path="/welcome" element={<WelcomePage/>} />            
            <Route path="*" element={<NotFoundPage/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/signup" element={<SignUp/>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;