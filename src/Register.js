import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css'; // Import custom styles
import { Button, Form, Card } from 'react-bootstrap';
import { auth, db } from './firebase'; // Import Firebase Auth and Firestore
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Register user using Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save additional user information to Firestore
      await setDoc(doc(db, "users", user.uid), {
        username,
        email,
        role,
      });

      alert("Registration successful!");
      window.location.href = '/login'; // Redirect to login page
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="ims ims--register">
      <div className="container py-5">
        <h1 className="ims-title text-center mb-5">IMS-Connect</h1>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <Card className="shadow">
              <Card.Body>
                <h2 className="card-title text-center mb-4">Register</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Innovation Manager</option>
                      <option value="admin">Admin</option>
                    </Form.Select>
                  </Form.Group>
                  <Button type="submit" variant="primary" className="w-100">
                    Register
                  </Button>
                </Form>
                <p className="text-center mt-3">
                  Already have an account? <a href="/login">Login</a>
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
