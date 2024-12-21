import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";  // Import necessary components from react-bootstrap
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { auth } from "./firebase";  // Import Firebase auth

const OverviewPage = () => {
  const navigate = useNavigate(); // Hook for navigation

  // Function to handle the navigation based on role
  const handleRoleSelection = (role) => {
    if (role === "Admin") {
      navigate("/admin");
    } else if (role === "Manager") {
      navigate("/manager");
    } else if (role === "Employee") {
      navigate("/employee");
    }
  };

  return (
    <Container className="text-center my-5">
      <h1>Welcome to IMS-Connect</h1>
      <p>Please select your role to continue:</p>
      
      <Row className="justify-content-center">
        <Col md={3} className="mb-3">
          <Button 
            variant="primary" 
            onClick={() => handleRoleSelection("Admin")}
            className="w-100"
          >
            Admin
          </Button>
        </Col>

        <Col md={3} className="mb-3">
          <Button 
            variant="success" 
            onClick={() => handleRoleSelection("Manager")}
            className="w-100"
          >
            Manager
          </Button>
        </Col>

        <Col md={3} className="mb-3">
          <Button 
            variant="info" 
            onClick={() => handleRoleSelection("Employee")}
            className="w-100"
          >
            Employee
          </Button>
        </Col>
      </Row>
      
      {/* Log out button */}
      <Button 
        variant="danger" 
        onClick={() => auth.signOut()} 
        className="mt-4"
      >
        Log Out
      </Button>
    </Container>
  );
};

export default OverviewPage;
