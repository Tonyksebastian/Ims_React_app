import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import './Manager.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db, collection, getDocs, addDoc, updateDoc, doc } from './firebase';

const ManagerDashboard = () => {
    const [ideas, setIdeas] = useState([]);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showVoteModal, setShowVoteModal] = useState(false);
    const [currentIdeaId, setCurrentIdeaId] = useState(null);
    const [currentStatus, setCurrentStatus] = useState("");
    const [currentVote, setCurrentVote] = useState("");
    const [entriesPerPage, setEntriesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch ideas from Firestore
    const fetchIdeas = async () => {
        const querySnapshot = await getDocs(collection(db, "ideas"));
        const fetchedIdeas = [];
        querySnapshot.forEach((doc) => {
            fetchedIdeas.push({ ...doc.data(), id: doc.id });
        });
        setIdeas(fetchedIdeas);
    };

    // Use effect to load ideas initially
    useEffect(() => {
        fetchIdeas();
    }, []);

    // Handle status update
    const handleStatusUpdate = (id, status) => {
        setCurrentIdeaId(id);
        setCurrentStatus(status);
        setShowStatusModal(true);
    };

    // Submit the updated status
    const submitStatusUpdate = async () => {
        try {
            const ideaRef = doc(db, "ideas", currentIdeaId);
            await updateDoc(ideaRef, {
                status: currentStatus,
            });
            alert(`Idea status updated to: ${currentStatus}`);
            setShowStatusModal(false);
            fetchIdeas(); // Refresh ideas after update
        } catch (error) {
            console.error('Error updating idea status:', error);
        }
    };

    // Handle voting action
    const handleVote = (id) => {
        setCurrentIdeaId(id);
        setShowVoteModal(true);
    };

    // Submit the vote
    const submitVote = async () => {
        try {
            await addDoc(collection(db, "votes"), {
                ideaId: currentIdeaId,
                voteValue: currentVote,
            });
            alert(`Your ${currentVote} has been recorded!`);
            setShowVoteModal(false);
        } catch (error) {
            console.error('Error submitting vote:', error);
        }
    };

    // Get current page ideas
    const indexOfLastIdea = currentPage * entriesPerPage;
    const indexOfFirstIdea = indexOfLastIdea - entriesPerPage;
    const currentIdeas = ideas.slice(indexOfFirstIdea, indexOfLastIdea);

    // Page change handler
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Change entries per page handler
    const handleEntriesPerPageChange = (e) => {
        setEntriesPerPage(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page
    };

    // Total pages calculation
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(ideas.length / entriesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container mt-5">
            <h2>Manager Dashboard - Assigned Projects</h2>

            {/* Entries per page selector */}
            <div className="mb-3">
                <label htmlFor="entriesPerPage" className="form-label">Entries per page</label>
                <select 
                    id="entriesPerPage" 
                    className="form-control" 
                    value={entriesPerPage} 
                    onChange={handleEntriesPerPageChange}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
            </div>

            {/* Project Table */}
            <table id="assignedProjectsTable" className="table table-striped mt-3">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Project Name</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentIdeas.map(idea => (
                        <tr key={idea.id}>
                            <td>{idea.id}</td>
                            <td>{idea.title}</td>
                            <td>{idea.description}</td>
                            <td>{idea.status}</td>
                            <td>
                                <div className="d-flex justify-content-start">
                                    <button className="btn btn-success btn-sm mr-2" onClick={() => handleStatusUpdate(idea.id, idea.status)}>Update Status</button>
                                    <button className="btn btn-primary btn-sm" onClick={() => handleVote(idea.id)}>Vote</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination controls */}
            <nav aria-label="Page navigation">
                <ul className="pagination">
                    {pageNumbers.map(number => (
                        <li key={number} className="page-item">
                            <button 
                                className="page-link" 
                                onClick={() => paginate(number)}
                            >
                                {number}
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Status Update Modal */}
            <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Idea Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <select className="form-control" value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)}>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowStatusModal(false)}>Close</button>
                    <button className="btn btn-primary" onClick={submitStatusUpdate}>Update Status</button>
                </Modal.Footer>
            </Modal>

            {/* Vote Modal */}
            <Modal show={showVoteModal} onHide={() => setShowVoteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cast Your Vote</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <select className="form-control" value={currentVote} onChange={(e) => setCurrentVote(e.target.value)}>
                        <option value="upvote">Upvote</option>
                        <option value="downvote">Downvote</option>
                    </select>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowVoteModal(false)}>Close</button>
                    <button className="btn btn-primary" onClick={submitVote}>Submit Vote</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManagerDashboard;
