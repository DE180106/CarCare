import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import BookingForm from "./services";
import StoreSystem from "./garages";
import Contact from "./contact";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/services" />} />
      <Route path="/services" element={<BookingForm />} />
      <Route path="/garages" element={<StoreSystem />} />
      <Route path="/contact/:userId/:garageId" element={<Contact />} /> {/* Dynamic route */}
    </Routes>
  );
}

export default App;