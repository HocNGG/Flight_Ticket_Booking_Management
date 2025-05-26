import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Flight from './pages/Flight';
import Home from './pages/Home';
import Ticket from './pages/Ticket';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/flight" element={<Flight />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-ticket" element={<Ticket />} />
        {/* <Route path="/airport" element={<Airport />} />
        <Route path="/class" element={<Class />} />
        <Route path="/revenue" element={<Revenue />} /> */}
      </Routes>
    </Router>
  )
}

export default App;
