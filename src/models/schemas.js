=======Collaboration Schema================

const collaborationRef = db.collection('collaborations');

async function createCollaboration(employees, ideaId) {
  const docRef = await collaborationRef.add({
    employees: employees, // Array of employee IDs
    ideaId: ideaId,       // Idea ID
    startDate: new Date()
  });
  console.log('Collaboration created with ID:', docRef.id);
}


============Employee Schema===================

const employeeRef = db.collection('employees');

async function createEmployee(employeeId, name, email, role) {
  const docRef = await employeeRef.add({
    employeeId: employeeId,
    name: name,
    email: email,
    role: role
  });
  console.log('Employee created with ID:', docRef.id);
}


=================== Idea Schema ==========


const ideaRef = db.collection('ideas');

async function createIdea(title, description, status) {
  const docRef = await ideaRef.add({
    title: title,
    description: description,
    status: status || 'Pending', // Default value if not provided
    submissionDate: new Date()
  });
  console.log('Idea created with ID:', docRef.id);
}


========== Reward Schema ==============

const rewardRef = db.collection('rewards');

async function createReward(employeeId, points, rewardType) {
  const docRef = await rewardRef.add({
    employeeId: employeeId,  // Reference to employee ID
    points: points,
    rewardType: rewardType
  });
  console.log('Reward created with ID:', docRef.id);
}


=============== User Schema ===================

const userRef = db.collection('users');

async function createUser(name, email, password, role) {
  const docRef = await userRef.add({
    name: name,
    email: email,
    password: password,
    role: role || 'Employee'  // Default role is 'Employee'
  });
  console.log('User created with ID:', docRef.id);
}


========Vote Schema=================

const voteRef = db.collection('votes');

async function createVote(employeeId, ideaId, voteValue) {
  const docRef = await voteRef.add({
    employeeId: employeeId, // Reference to employee ID
    ideaId: ideaId,         // Reference to idea ID
    voteValue: voteValue    // Either 'upvote' or 'downvote'
  });
  console.log('Vote created with ID:', docRef.id);
}
