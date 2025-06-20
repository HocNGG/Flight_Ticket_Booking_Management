import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import UserHome from './pages/UserHome';
import Flights from './pages/Flights';
import CreateTicket from './pages/CreateTicket';
import Tickets from './pages/Tickets';
import CreateFlight from './pages/CreateFlight';
import MonthRevenue from './pages/MonthRevenue';
import YearRevenue from './pages/YearRevenue';
import Airports from './pages/Airports';
import CreateAirport from './pages/CreateAirport';
import TicketClasses from './pages/TicketClasses';
import CreateTicketClass from './pages/CreateTicketClass';
import Regulations from './pages/Regulations';
import Login from './pages/Login';
import BookTicket from './pages/BookTicket';
import ChooseSeat from './pages/ChooseSeat';
import PaymentReturn from './pages/PaymentReturn';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<UserHome />} />
        <Route path="/book-ticket/:flightId" element={<BookTicket />} />
        <Route path="/choose-seat/:flightId" element={<ChooseSeat />} />
        
        {/* Protected Routes */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/flights" element={
          <ProtectedRoute>
            <Flights />
          </ProtectedRoute>
        } />
        <Route path="/tickets" element={
          <ProtectedRoute>
            <Tickets />
          </ProtectedRoute>
        } />
        <Route path="/create-ticket" element={
          <ProtectedRoute>
            <CreateTicket />
          </ProtectedRoute>
        } />
        <Route path="/create-flight" element={
          <ProtectedRoute>
            <CreateFlight />
          </ProtectedRoute>
        } />
        <Route path="/detail-revenue" element={
          <ProtectedRoute>
            <MonthRevenue />
          </ProtectedRoute>
        } />
        <Route path="/overall-revenue" element={
          <ProtectedRoute>
            <YearRevenue />
          </ProtectedRoute>
        } />
        <Route path="/airport" element={
          <ProtectedRoute>
            <Airports />
          </ProtectedRoute>
        } />
        <Route path="/create-airport" element={
          <ProtectedRoute>
            <CreateAirport />
          </ProtectedRoute>
        } />
        <Route path="/class" element={
          <ProtectedRoute>
            <TicketClasses />
          </ProtectedRoute>
        } />
        <Route path="/create-ticket-class" element={
          <ProtectedRoute>
            <CreateTicketClass />
          </ProtectedRoute>
        } />
        <Route path="/regulations" element={
          <ProtectedRoute>
            <Regulations />
          </ProtectedRoute>
        } />
        <Route path="/payment_return" element={<PaymentReturn />} />
      </Routes>
    </Router>
  );
}

export default App;
