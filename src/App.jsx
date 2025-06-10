import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Flights from './pages/Flights';
import Tickets from './pages/Tickets';
import CreateTicket from './pages/CreateTicket';
import CreateFlight from './pages/CreateFlight';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<Home />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/create-ticket" element={<CreateTicket />} />
        <Route path="/create-flight" element={<CreateFlight />} />
      </Routes>
    </Router>
  );
}

export default App;
