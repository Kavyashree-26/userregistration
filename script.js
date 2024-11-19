const userForm = document.getElementById("userForm");
const userTableBody = document.querySelector("#userTable tbody");

let users = []; // Array to store user data
let isEditing = false;
let editingUserId = null;


function fetchUsers() {
  fetch("http://localhost:5000/users")
    .then((response) => response.json())
    .then((data) => {
      users = data;
      renderUsers();
    })
    .catch((error) => console.error("Error fetching users:", error));
}

// Render users in the table
function renderUsers() {
  userTableBody.innerHTML = ""; // Clear the table

  users.forEach((user) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.dob}</td>
      <td>
        <button onclick="editUser(${user.id})">Edit</button>
        <button onclick="deleteUser(${user.id})">Delete</button>
      </td>
    `;

    userTableBody.appendChild(row);
  });
}

// Handle form submission
userForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const dob = document.getElementById("dob").value;

  if (isEditing) {
    updateUser(editingUserId, { name, email, dob });
  } else {
    createUser({ name, email, dob });
  }

  userForm.reset(); 
  isEditing = false;
  editingUserId = null;
});

// Create a new user
function createUser(user) {
  fetch("http://localhost:5000/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then(() => fetchUsers())
    .catch((error) => console.error("Error creating user:", error));
}

// Edit a user
function editUser(id) {
  const user = users.find((u) => u.id === id);
  if (user) {
    isEditing = true;
    editingUserId = id;

    document.getElementById("name").value = user.name;
    document.getElementById("email").value = user.email;
    document.getElementById("dob").value = user.dob;
  }
}

// Update an existing user
function updateUser(id, user) {
  fetch(`http://localhost:5000/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  })
    .then(() => fetchUsers())
    .catch((error) => console.error("Error updating user:", error));
}

// Delete a user
function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    fetch(`http://localhost:5000/users/${id}`, {
      method: "DELETE",
    })
      .then(() => fetchUsers())
      .catch((error) => console.error("Error deleting user:", error));
  }
}


fetchUsers();
