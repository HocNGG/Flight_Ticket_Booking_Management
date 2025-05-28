import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Flights from './pages/Flights';
import Home from './pages/Home';
import CreateTicket from './pages/CreateTicket';
import Tickets from './pages/Tickets';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-ticket" element={<CreateTicket />} />
        <Route path="/tickets" element={<Tickets />} />
        {/* <Route path="/class" element={<Class />} />
        <Route path="/revenue" element={<Revenue />} /> */}
      </Routes>
    </Router>
  )
}

export default App;
