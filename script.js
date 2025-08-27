const generateBtn = document.getElementById("generateBtn");
const userCountInput = document.getElementById("userCount");
const userTable = document.getElementById("userTable");
const nameTypeSelect = document.getElementById("nameType");

// fetches users 
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

// displays users
function displayUsers(users) {
  userTable.innerHTML = ""; // clear old data
  const nameType = nameTypeSelect.value;

  users.forEach(function(user) {
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

    userTable.appendChild(row);
  });
}

// checks for valid input
function validateInput(count) {
  if (isNaN(count) || count < 0 || count > 1000) {
    alert("Please enter a number between 0 and 1000.");
    return false;
  }
  return true;
}

// Generate button
function handleGenerateClick() {
  const count = parseInt(userCountInput.value);

  if (!validateInput(count)) {
    return;
  }

  fetchUsers(count)
    .then(function(users) {
      displayUsers(users);
    })
    .catch(function(error) {
      alert("Error: " + error);
    });
}

// Name type change(last name and first name )
function handleNameTypeChange() {
  const rows = userTable.querySelectorAll("tr");
  if (rows.length > 0) {
    handleGenerateClick(); // re-fetch with new setting
  }
}


generateBtn.addEventListener("click", handleGenerateClick);
nameTypeSelect.addEventListener("change", handleNameTypeChange);
