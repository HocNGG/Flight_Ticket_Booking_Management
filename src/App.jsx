import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Flights from './pages/Flights';
import CreateTicket from './pages/CreateTicket';
import Tickets from './pages/Tickets';
import CreateFlight from './pages/CreateFlight';
import UpdateFlight from './pages/UpdateFlight';
import MonthRevenue from './pages/MonthRevenue';
import YearRevenue from './pages/YearRevenue';
import Airports from './pages/Airports';
import CreateAirport from './pages/CreateAirport';
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
        <Route path="/tickets" element={<Tickets />} />
        {/* <Route path="/class" element={<Class />} />
        <Route path="/revenue" element={<Revenue />} /> */}
        <Route path="/create-flight" element={<CreateFlight />} />
        <Route path="/update-flight" element={<UpdateFlight />} />
        <Route path="/detail-revenue" element={<MonthRevenue />} />
        <Route path="/overall-revenue" element={<YearRevenue />} />
        <Route path="/airport" element={<Airports />} />
        <Route path="/create-airport" element={<CreateAirport />} />
      </Routes>
    </Router>
  );
}

export default App;
