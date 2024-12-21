import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBj39nL-QHbPbFdFmTpm8jo5kAf6USdCd0",
  authDomain: "ims-connect-9a5ad.firebaseapp.com",
  projectId: "ims-connect-9a5ad",
  storageBucket: "ims-connect-9a5ad.firebasestorage.app",
  messagingSenderId: "533091819799",
  appId: "1:533091819799:web:bd2931f5c58d8c96b35752",
  measurementId: "G-C7X0TWWWXG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const Admin = () => {
  const [employees, setEmployees] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [votes, setVotes] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ employeeId: '', name: '', email: '', role: '' });
  const [editEmployee, setEditEmployee] = useState(null);
  const [newIdea, setNewIdea] = useState({ title: '', description: '', status: 'Pending' });
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showEditEmployeeModal, setShowEditEmployeeModal] = useState(false);
  const [showIdeaModal, setShowIdeaModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
    fetchIdeas();
    fetchVotes();
  }, []);

  const fetchEmployees = async () => {
    const employeeSnapshot = await getDocs(collection(db, 'employees'));
    const employeeList = employeeSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setEmployees(employeeList);
  };

  const fetchIdeas = async () => {
    const ideaSnapshot = await getDocs(collection(db, 'ideas'));
    const ideaList = ideaSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    setIdeas(ideaList);
  };

  const fetchVotes = async () => {
    const voteSnapshot = await getDocs(collection(db, 'votes'));
    const voteList = voteSnapshot.docs.map(doc => doc.data());
    setVotes(voteList);
  };

  const handleAddEmployee = async () => {
    const { employeeId, name, email, role } = newEmployee;
    const employeeRef = collection(db, 'employees');
    
    // Check if employee already exists
    const employeeQuery = query(employeeRef, where('employeeId', '==', employeeId));
    const employeeSnapshot = await getDocs(employeeQuery);
    if (!employeeSnapshot.empty) {
      setError("Employee with this ID already exists!");
      return;
    }

    try {
      await addDoc(employeeRef, { employeeId, name, email, role });
      setShowEmployeeModal(false);
      fetchEmployees(); // Reload employee list
    } catch (err) {
      setError("Error adding employee: " + err.message);
    }
  };

  const handleEditEmployee = async () => {
    const { employeeId, name, email, role } = editEmployee;
    const employeeRef = doc(db, 'employees', editEmployee.id);
    try {
      await updateDoc(employeeRef, { employeeId, name, email, role });
      setShowEditEmployeeModal(false);
      fetchEmployees(); // Reload employee list
    } catch (err) {
      setError("Error editing employee: " + err.message);
    }
  };

  const handleAddIdea = async () => {
    const { title, description, status } = newIdea;
    const ideaRef = collection(db, 'ideas');
    
    // Check if idea already exists
    const ideaQuery = query(ideaRef, where('title', '==', title));
    const ideaSnapshot = await getDocs(ideaQuery);
    if (!ideaSnapshot.empty) {
      setError("Idea with this title already exists!");
      return;
    }
    
    try {
      await addDoc(ideaRef, { title, description, status, submissionDate: new Date() });
      setShowIdeaModal(false);
      fetchIdeas(); // Reload ideas list
    } catch (err) {
      setError("Error adding idea: " + err.message);
    }
  };

  const handleApproveIdea = async (ideaId) => {
    const ideaRef = doc(db, 'ideas', ideaId);
    await updateDoc(ideaRef, { status: 'Approved' });
    fetchIdeas(); // Reload ideas list
  };

  const handleRejectIdea = async (ideaId) => {
    const ideaRef = doc(db, 'ideas', ideaId);
    await updateDoc(ideaRef, { status: 'Rejected' });
    fetchIdeas(); // Reload ideas list
  };

  const handleDeleteIdea = async (ideaId) => {
    const ideaRef = doc(db, 'ideas', ideaId);
    await deleteDoc(ideaRef);
    fetchIdeas(); // Reload ideas list
  };

  const handleDeleteEmployee = async (employeeId) => {
    const employeeRef = doc(db, 'employees', employeeId);
    await deleteDoc(employeeRef);
    fetchEmployees(); // Reload employee list
  };

  const countVotesForIdea = (ideaId) => {
    const ideaVotes = votes.filter(vote => vote.ideaId === ideaId);
    const upvotes = ideaVotes.filter(vote => vote.voteValue === 'upvote').length;
    const downvotes = ideaVotes.filter(vote => vote.voteValue === 'downvote').length;
    return { upvotes, downvotes };
  };

  const handleEditEmployeeClick = (employee) => {
    setEditEmployee(employee); // Set the employee to edit
    setShowEditEmployeeModal(true); // Open the edit modal
  };

  return (
    <div className="container">
      <h1>Admin Panel</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <h2>Employees</h2>
      <Button variant="primary" onClick={() => setShowEmployeeModal(true)}>Add New Employee</Button>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.employeeId}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.role}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditEmployeeClick(employee)}>Edit</Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteEmployee(employee.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Ideas</h2>
      <Button variant="primary" onClick={() => setShowIdeaModal(true)}>Add New Idea</Button>
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Votes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ideas.map(idea => {
            const { upvotes, downvotes } = countVotesForIdea(idea.id);
            return (
              <tr key={idea.id}>
                <td>{idea.title}</td>
                <td>{idea.description}</td>
                <td>{idea.status}</td>
                <td>{upvotes} Upvotes, {downvotes} Downvotes</td>
                <td>
                  <Button variant="success" onClick={() => handleApproveIdea(idea.id)}>Approve</Button>{' '}
                  <Button variant="danger" onClick={() => handleRejectIdea(idea.id)}>Reject</Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteIdea(idea.id)}>Delete</Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Add Employee Modal */}
      <Modal show={showEmployeeModal} onHide={() => setShowEmployeeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Employee ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Employee ID"
                value={newEmployee.employeeId}
                onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Name"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter Email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Role"
                value={newEmployee.role}
                onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEmployeeModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddEmployee}>
            Add Employee
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal show={showEditEmployeeModal} onHide={() => setShowEditEmployeeModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editEmployee && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Employee ID</Form.Label>
                <Form.Control
                  type="text"
                  value={editEmployee.employeeId}
                  onChange={(e) => setEditEmployee({ ...editEmployee, employeeId: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editEmployee.name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editEmployee.email}
                  onChange={(e) => setEditEmployee({ ...editEmployee, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Control
                  type="text"
                  value={editEmployee.role}
                  onChange={(e) => setEditEmployee({ ...editEmployee, role: e.target.value })}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditEmployeeModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditEmployee}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Idea Modal */}
      <Modal show={showIdeaModal} onHide={() => setShowIdeaModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Idea</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Idea Title"
                value={newIdea.title}
                onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Idea Description"
                value={newIdea.description}
                onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowIdeaModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddIdea}>
            Add Idea
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Admin;
