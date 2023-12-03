import './App.scss';

import React from 'react';

import Navbar from './components/Navbar';
import Summary from './components/Summary';
import Timesheet from './components/Timesheet';
import Profile from './components/Profile';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <Navbar />
        </header>
        <Routes>
          <Route path="/summary" element={<Summary/>} />
          <Route path="/timesheet" element={<Timesheet/>} />
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;