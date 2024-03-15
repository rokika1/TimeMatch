import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventForm from './Form';
import EventDetails from './Event';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EventForm />} />
        <Route path="/event/:eventKey" element={<EventDetails />} />
      </Routes>
    </Router>
  );
}

export default App;