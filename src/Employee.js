import React, { useEffect, useState } from 'react';
import './Employee.css'; // Import the CSS file
import { Modal } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { db, collection, addDoc, getDocs, query, where, getCountFromServer } from './firebase'; // Import Firestore and necessary functions

const Employee = () => {
  const [ideas, setIdeas] = useState([]);
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [employeeId, setEmployeeId] = useState(''); // Assume this is set upon login

  // Fetch all ideas and their vote count
  const fetchIdeas = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'ideas'));
      const ideasList = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const ideaData = doc.data();
          const votes = await getVoteCount(doc.id); // Get the vote count for each idea
          return { id: doc.id, ...ideaData, votes };
        })
      );
      setIdeas(ideasList);
    } catch (error) {
      console.error('Error fetching ideas:', error);
    }
  };

  // Get the vote count for a specific idea
  const getVoteCount = async (ideaId) => {
    try {
      const voteQuery = query(
        collection(db, 'votes'),
        where('ideaId', '==', ideaId) // Filter votes by ideaId
      );
      const voteSnapshot = await getDocs(voteQuery);
      return voteSnapshot.size; // The number of votes for this idea
    } catch (error) {
      console.error('Error getting vote count:', error);
      return 0; // Return 0 if there are no votes or error occurs
    }
  };

  // Handle idea submission
  const handleIdeaSubmit = async (event) => {
    event.preventDefault();

    const idea = {
      title: ideaTitle,
      description: ideaDescription,
      status: 'Pending', // Default status
      submissionDate: new Date(),
    };

    try {
      await addDoc(collection(db, 'ideas'), idea);
      alert('Idea submitted successfully!');
      setIdeaTitle('');
      setIdeaDescription('');
      fetchIdeas(); // Refresh ideas table
    } catch (error) {
      console.error('Error submitting idea:', error);
    }
  };

  // Handle voting (upvote or downvote)
  const handleVote = async (ideaId, voteValue) => {
    try {
      // Create a vote in the 'votes' collection
      await createVote(employeeId, ideaId, voteValue);
      
      // After voting, fetch the updated ideas list
      fetchIdeas();
      alert(`You have ${voteValue}d this idea!`);
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

  // Create a vote in Firestore
  const createVote = async (employeeId, ideaId, voteValue) => {
    try {
      await addDoc(collection(db, 'votes'), {
        employeeId,
        ideaId,
        voteValue, // 'upvote' or 'downvote'
      });
      console.log('Vote submitted');
    } catch (error) {
      console.error('Error creating vote:', error);
    }
  };

  // Fetch ideas on component mount
  useEffect(() => {
    fetchIdeas();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center">Employee Dashboard</h1>

      {/* Idea Submission Form */}
      <div className="card mt-4">
        <div className="card-header">
          <h3>Submit a New Idea</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleIdeaSubmit}>
            <div className="form-group">
              <label htmlFor="ideaTitle">Idea Title</label>
              <input
                type="text"
                className="form-control"
                id="ideaTitle"
                placeholder="Enter your idea title"
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="ideaDescription">Idea Description</label>
              <textarea
                className="form-control"
                id="ideaDescription"
                rows="4"
                placeholder="Describe your idea"
                value={ideaDescription}
                onChange={(e) => setIdeaDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Submit Idea</button>
          </form>
        </div>
      </div>

      {/* Submitted Ideas Table */}
      <div className="card mt-4">
        <div className="card-header">
          <h3>Ideas for Collaboration and Voting</h3>
        </div>
        <div className="card-body">
          <table className="table table-bordered" id="employeeIdeasTable">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Votes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea) => (
                <tr key={idea.id}>
                  <td>{idea.id}</td>
                  <td>{idea.title}</td>
                  <td>{idea.description}</td>
                  <td>{idea.status}</td>
                  <td>{idea.votes || 0}</td> {/* Display the number of votes */}
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => handleVote(idea.id, 'upvote')}
                    >
                      Upvote
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleVote(idea.id, 'downvote')}
                    >
                      Downvote
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employee;
