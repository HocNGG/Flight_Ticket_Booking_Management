import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Flights from './pages/Flights';
import Home from './pages/Home';
import CreateTicket from './pages/CreateTicket';
import Tickets from './pages/Tickets';
import CreateFlight from './pages/CreateFlight';
import UpdateFlight from './pages/UpdateFlight';
import MonthRevenue from './pages/MonthRevenue';
import YearRevenue from './pages/YearRevenue';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/flights" element={<Flights />} />
        <Route path="/home" element={<Home />} />
        <Route path="/create-ticket" element={<CreateTicket />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/create-flight" element={<CreateFlight />} />
        <Route path="/update-flight" element={<UpdateFlight />} />
        <Route path="/detail-revenue" element={<MonthRevenue />} />
        <Route path="/overall-revenue" element={<YearRevenue />} />
      </Routes>
    </Router>
  )
}

export default App;
