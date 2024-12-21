import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { auth } from "./firebase"; // Import firebase auth
import Admin from './Admin';
import Manager from './Manager';
import Employee from './Employee';
import Login from './Login';
import Register from './Register';
import OverviewPage from './OverviewPage';  // Import OverviewPage

function App() {
  const [user, setUser] = useState(null);

  // Listen for user state change
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Overview Page after login */}
          <Route path="/overview" element={user ? <OverviewPage /> : <Navigate to="/login" />} />
          
          {/* Role-based pages */}
          <Route path="/admin" element={<Admin />} />
          <Route path="/manager" element={<Manager />} />
          <Route path="/employee" element={<Employee />} />

          {/* Default route */}
          <Route path="/" element={user ? <Navigate to="/overview" /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
