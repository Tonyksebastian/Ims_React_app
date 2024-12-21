import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';  // Importing Bootstrap CSS
import './Login.css';  // Import your custom styles
import { Button, Form, Card } from 'react-bootstrap';
import { signInWithEmailAndPassword } from "firebase/auth"; // Import the signIn function from Firebase
import { auth } from "./firebase"; // Import Firebase auth
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection

const Login = () => {
  const [email, setEmail] = useState(""); // Use email instead of username
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For error handling
  const [successMessage, setSuccessMessage] = useState(""); // For success message
  const navigate = useNavigate(); // Hook for navigation after login

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Use Firebase to sign in with email and password
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // Display success message
        setSuccessMessage("Login successful! Redirecting...");
        setError(""); // Clear any previous error messages
        // Redirect to the OverviewPage
        setTimeout(() => navigate("/overview"), 2000); // Wait 2 seconds before redirecting
      })
      .catch((error) => {
        setError("Invalid email or password.");
        setSuccessMessage(""); // Clear success message in case of error
        console.error("Login error: ", error.message);
      });
  };

  return (
    <div className="ims ims--login">
      <div className="container py-5">
        <div className="row justify-content-center">
          {/* Title Section */}
          <h1 className="ims-title text-center mb-5">IMS-Connect</h1>

          <div className="col-md-6">
            <Card className="shadow">
              <Card.Body>
                <h2 className="card-title text-center mb-4">Login</h2>
                <Form onSubmit={handleSubmit}>
                  {/* Email input */}
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>

                  {/* Password input */}
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>

                  {/* Error message */}
                  {error && <p className="text-danger">{error}</p>}

                  {/* Success message */}
                  {successMessage && <p className="text-success">{successMessage}</p>}

                  {/* Submit button */}
                  <Button type="submit" variant="primary" className="w-100">
                    Login
                  </Button>
                </Form>

                {/* Registration link */}
                <p className="text-center mt-3">
                  Don't have an account? <a href="/register">Register</a>
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
