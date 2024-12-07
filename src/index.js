document.addEventListener('DOMContentLoaded', function() {
  fetchUsers();
  setupFunctionSelector();

  // refresh
  document.querySelector('#refresh-table-btn').onclick = fetchUsers;
});

function fetchUsers() {
  fetch('http://localhost:5050/getAll')
      .then(response => response.json())
      .then(data => loadUserTable(data.data))
      .catch(error => console.error('Error:', error));
}

function loadUserTable(data) {
  const table = document.querySelector('#user-table tbody');
  table.innerHTML = ""; 

  if (data.length === 0) {
      table.innerHTML = "<tr><td colspan='10'>No Data Available</td></tr>";
      return;
  }

  data.forEach(user => {
      const row = table.insertRow();
      row.innerHTML = `
          <td>${user.id}</td>
          <td>${user.username}</td>
          <td>${user.firstname}</td>
          <td>${user.lastname}</td>
          <td>${user.creditinfo}</td>
          <td>${user.address}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>
          <td><button class="delete-btn" data-id="${user.id}">Delete</button></td>
          <td><button class="edit-btn" data-id="${user.id}">Edit</button></td>
      `;
  });

  document.querySelectorAll('.delete-btn').forEach(button => {
      button.addEventListener('click', deleteUser);
  });

  document.querySelectorAll('.edit-btn').forEach(button => {
      button.addEventListener('click', showEditForm);
  });
}

function setupFunctionSelector() {
  const functionSelect = document.querySelector('#function-select');
  const sections = document.querySelectorAll('.function-section');

  functionSelect.addEventListener('change', () => {
      const selectedFunction = functionSelect.value;

      sections.forEach(section => {
          section.style.display = 'none';
      });

      if (selectedFunction) {
          document.querySelector(`#${selectedFunction}-section`).style.display = 'block';
      }
  });
}

// add user
document.querySelector('#add-user-btn').onclick = function() {
  const username = document.querySelector('#username-input').value;
  const password = document.querySelector('#password-input').value;
  const firstname = document.querySelector('#firstname-input').value;
  const lastname = document.querySelector('#lastname-input').value;
  const creditinfo = parseFloat(document.querySelector('#creditinfo-input').value);
  const address = document.querySelector('#address-input').value;
  const email = document.querySelector('#email-input').value;
  const phone = document.querySelector('#phone-input').value;

  fetch('http://localhost:5050/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, firstname, lastname, creditinfo, address, email, phone })
  })
  .then(response => response.json())
  .then(data => {
      console.log('User added:', data);
      fetchUsers(); // Refresh table
      document.querySelector('#username-input').value = "";
      document.querySelector('#password-input').value = "";
      document.querySelector('#firstname-input').value = "";
      document.querySelector('#lastname-input').value = "";
      document.querySelector('#creditinfo-input').value = "";
      document.querySelector('#address-input').value = "";
      document.querySelector('#email-input').value = "";
      document.querySelector('#phone-input').value = "";
  })
  .catch(error => console.error('Error:', error));
};

// delete user
function deleteUser(event) {
  const id = event.target.getAttribute('data-id');

  fetch(`http://localhost:5050/delete/${id}`, {
      method: 'DELETE'
  })
  .then(response => response.json())
  .then(data => {
      if (data.success) {
          fetchUsers();
      } else {
          console.error("Failed to delete user");
      }
  })
  .catch(error => console.error('Error:', error));
}

// edit form
function showEditForm(event) {
  const id = event.target.getAttribute('data-id');

  fetch(`http://localhost:5050/searchByID/${id}`)
      .then(response => response.json())
      .then(data => {
          const user = data.data[0];
          if (user) {
              document.querySelector('#update-row').hidden = false;
              document.querySelector('#update-firstname-input').value = user.firstname;
              document.querySelector('#update-lastname-input').value = user.lastname;
              document.querySelector('#update-creditinfo-input').value = user.creditinfo;
              document.querySelector('#update-email-input').value = user.email;
              document.querySelector('#update-phone-input').value = user.phone;
              document.querySelector('#update-address-input').value = user.address;
              document.querySelector('#update-user-btn').setAttribute('data-id', id);
          }
      })
      .catch(error => console.error('Error:', error));
}
