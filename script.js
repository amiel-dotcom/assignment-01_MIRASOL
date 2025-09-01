const generateBtn = document.getElementById("generateBtn");
const userCountInput = document.getElementById("userCount");
const userTable = document.getElementById("userTable");
const nameTypeSelect = document.getElementById("nameType");

// modal references
const modal = new bootstrap.Modal(document.getElementById("userModal"));
const modalImg = document.getElementById("modalImg");
const modalName = document.getElementById("modalName");
const modalAddress = document.getElementById("modalAddress");
const modalEmail = document.getElementById("modalEmail");
const modalPhone = document.getElementById("modalPhone");
const modalDob = document.getElementById("modalDob");
const modalGender = document.getElementById("modalGender");
const deleteBtn = document.getElementById("deleteBtn");
const editBtn = document.getElementById("editBtn");

let currentUsers = [];
let selectedUserIndex = null;

// fetch users
function fetchUsers(count) {
  return new Promise(function(resolve, reject) {
    fetch("https://randomuser.me/api/?results=" + count)
      .then(function(response) {
        if (!response.ok) {
          reject("API request failed with status " + response.status);
        }
        return response.json();
      })
      .then(function(data) {
        resolve(data.results);
      })
      .catch(function(error) {
        reject("Network error: " + error);
      });
  });
}

// display users
function displayUsers(users) {
  userTable.innerHTML = "";
  const nameType = nameTypeSelect.value;

  users.forEach(function(user, index) {
    const row = document.createElement("tr");

    const nameCell = document.createElement("td");
    nameCell.textContent = nameType === "first" ? user.name.first : user.name.last;

    const genderCell = document.createElement("td");
    genderCell.textContent = user.gender;

    const emailCell = document.createElement("td");
    emailCell.textContent = user.email;

    const countryCell = document.createElement("td");
    countryCell.textContent = user.location.country;

    row.appendChild(nameCell);
    row.appendChild(genderCell);
    row.appendChild(emailCell);
    row.appendChild(countryCell);

    // double click to open modal
    row.addEventListener("dblclick", function() {
      openUserModal(user, index);
    });

    userTable.appendChild(row);
  });
}

// open modal
function openUserModal(user, index) {
  selectedUserIndex = index;
  modalImg.src = user.picture.large;
  modalName.textContent = `${user.name.title} ${user.name.first} ${user.name.last}`;
  modalAddress.textContent = `${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state}, ${user.location.country}, ${user.location.postcode}`;
  modalEmail.textContent = user.email;
  modalPhone.textContent = user.phone;
  modalDob.textContent = new Date(user.dob.date).toLocaleDateString();
  modalGender.textContent = user.gender;
  modal.show();
}

// delete user
deleteBtn.addEventListener("click", function() {
  if (selectedUserIndex !== null) {
    currentUsers.splice(selectedUserIndex, 1);
    displayUsers(currentUsers);
    modal.hide();
  }
});

// edit user (example: change email)
editBtn.addEventListener("click", function() {
  if (selectedUserIndex !== null) {
    const newEmail = prompt("Enter new email:", currentUsers[selectedUserIndex].email);
    if (newEmail) {
      currentUsers[selectedUserIndex].email = newEmail;
      displayUsers(currentUsers);
      openUserModal(currentUsers[selectedUserIndex], selectedUserIndex); // refresh modal
    }
  }
});

// validate input
function validateInput(count) {
  if (isNaN(count) || count < 0 || count > 1000) {
    alert("Please enter a number between 0 and 1000.");
    return false;
  }
  return true;
}

// handle generate
function handleGenerateClick() {
  const count = parseInt(userCountInput.value);

  if (!validateInput(count)) {
    return;
  }

  fetchUsers(count)
    .then(function(users) {
      currentUsers = users; // store globally
      displayUsers(currentUsers);
    })
    .catch(function(error) {
      alert("Error: " + error);
    });
}

// handle name type change
function handleNameTypeChange() {
  if (currentUsers.length > 0) {
    displayUsers(currentUsers);
  }
}

generateBtn.addEventListener("click", handleGenerateClick);
nameTypeSelect.addEventListener("change", handleNameTypeChange);
