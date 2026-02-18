const urlBase = 'http://www.tempclassproject.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let selectedContactId = 0;

// Login
function doLogin() {
        userId = 0;
        firstName = "";
        lastName = "";

        let login = document.getElementById("loginName").value;
        let password = md5(document.getElementById("loginPassword").value);

        document.getElementById("loginResult").innerHTML = "";

        let tmp = { login: login, password: password };
        let jsonPayload = JSON.stringify(tmp);
        let url = urlBase + '/login.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try {
                xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                                let jsonObject = JSON.parse(xhr.responseText);
                                userId = jsonObject.id;

                                if (userId < 1) {
                                        document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                                        return;
                                }

                                firstName = jsonObject.firstName;
                                lastName = jsonObject.lastName;

                                saveCookie();
                                window.location.href = "contacts.html";
                        }
                };
                xhr.send(jsonPayload);
        } catch (err) {
                document.getElementById("loginResult").innerHTML = err.message;
        }
}

// Cookie functions
function saveCookie() {
        let minutes = 20;
        let date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie() {
        userId = -1;
        let data = document.cookie;
        let splits = data.split(",");
        for (let i = 0; i < splits.length; i++) {
                let thisOne = splits[i].trim();
                let tokens = thisOne.split("=");
                if (tokens[0] === "firstName") {
                        firstName = tokens[1];
                } else if (tokens[0] === "lastName") {
                        lastName = tokens[1];
                } else if (tokens[0] === "userId") {
                        userId = parseInt(tokens[1].trim());
                }
        }

        if (userId < 0) {
                window.location.href = "index.html";
        }
}

// Logout
function doLogout() {
        userId = 0;
        firstName = "";
        lastName = "";
        document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "index.html";
}

// Go to login
function goToLogin() {
    window.location.href = "index.html";
}

// Register
function goToRegister() {
        window.location.href = "register.html";
}

function doRegister() {
        let firstName = document.getElementById("firstName").value;
        let lastName = document.getElementById("lastName").value;
        let login = document.getElementById("login").value;
        let password = document.getElementById("password").value;

        let hash = md5(password);

        let tmp = {
                firstName: firstName,
                lastName: lastName,
                login: login,
                password: hash
        };

        let jsonPayload = JSON.stringify(tmp);
        let url = urlBase + '/register.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");


        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("Response:", xhr.responseText);
                    let jsonObject = JSON.parse(xhr.responseText);
                    if (jsonObject.error !== "") {
                        document.getElementById("registerResult").innerHTML = "Error: " + jsonObject.error;
                    } else {
                        document.getElementById("registerResult").innerHTML = "Account created successfully!";
                        // Optional: redirect after 1.5s
                        setTimeout(() => window.location.href = "index.html", 1500);
                    }
                }
            };
            xhr.send(jsonPayload);
        } catch (err) {
            console.log("Register request failed:", err.message);
            document.getElementById("registerResult").innerHTML = "Request failed: " + err.message;
        }
}

/* Contact display  */
function displayContacts(contacts) {
    const grid = document.getElementById("contactGrid");
    
    if (contacts.length === 0) {
        grid.innerHTML = "<div class='no-contacts'>No contacts found</div>";
        return;
    }

    let html = '';
    contacts.forEach(contact => 
        {
        // Escape quotes for onclick handlers
        let first = escapeHtml(contact.firstName).replace(/'/g, "\\'");
        let last = escapeHtml(contact.lastName).replace(/'/g, "\\'");
        let phone = escapeHtml(contact.phone).replace(/'/g, "\\'");
        let email = escapeHtml(contact.email).replace(/'/g, "\\'");
        
        html += `
            <div class="contact-card" data-id="${contact.id}">
                <h3>${escapeHtml(contact.firstName)} ${escapeHtml(contact.lastName)}</h3>
                <div class="contact-info">
                    <div><label>Phone:</label> ${escapeHtml(contact.phone)}</div>
                    <div><label>Email:</label> ${escapeHtml(contact.email)}</div>
                </div>
                <div class="contact-actions">
                    <button class="action-btn" onclick="loadContactForEdit(${contact.id}, '${first}', '${last}', '${phone}', '${email}')" title="Edit">
                        <i class="fa fa-pencil"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteContact(${contact.id})" title="Delete">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        });

    grid.innerHTML = html;
}

/* Helper Function */
function escapeHtml(text) 
{
    if (!text) return '';
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Get all contacts EDIT: modified to work with the new layout
function getContacts() {
        let tmp = { userId: userId };
        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/GetContacts.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try {
                xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) 
                        {
                                let jsonObject = JSON.parse(xhr.responseText);
                                let results = jsonObject.results;

                                // Display in grid format
                                displayContacts(results);
                        }
                };
                xhr.send(jsonPayload);
        } catch (err) 
        {
                document.getElementById("contactGrid").innerHTML = "<div class='no-contacts'>Error: " + err.message + "</div>";
        }
}

// Search contacts EDIT: modified to work with the new layout
function searchContacts() {
    let srch = document.getElementById("searchText").value;

    let tmp = { search: srch, userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                let results = jsonObject.results;

                // Display in grid format
                displayContacts(results);
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("contactGrid").innerHTML = "<div class='no-contacts'>Error: " + err.message + "</div>";
    }
}


// Add contact
function addContact() {
        let firstName = document.getElementById("firstName").value;
        let lastName = document.getElementById("lastName").value;
        let phone = document.getElementById("phone").value;
        let email = document.getElementById("email").value;

        let tmp = {
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                email: email,
                userId: userId
        };

        let jsonPayload = JSON.stringify(tmp);
        let url = urlBase + '/CreateContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

        try {
                xhr.onreadystatechange = function () {
                        if (this.readyState == 4 && this.status == 200) {
                                let jsonObject = JSON.parse(xhr.responseText);
                                if (jsonObject.error !== "") {
                                        showStatus(jsonObject.error, "red");
                                } else {
                                        showStatus("Contact added", "green");

                                        //  Hide Add Contact form after success
                                        document.getElementById("addContactForm").style.display = "none";

                                        // Clear inputs
                                        document.getElementById("firstName").value = "";
                                        document.getElementById("lastName").value = "";
                                        document.getElementById("phone").value = "";
                                        document.getElementById("email").value = "";

                                        getContacts();
                                }
                        }
                };
                xhr.send(jsonPayload);
        } catch (err) {
                alert("Request failed: " + err.message);
        }
}

// Toggle add contact form
function toggleAddContact() {
    const form = document.getElementById("addContactForm");
    form.style.display = (form.style.display === "none") ? "block" : "none";
}

// Update contacts
/* function updateContact(contactId) {

    let firstName = document.getElementById("updateFirstName").value;
    let lastName  = document.getElementById("updateLastName").value;
    let phone     = document.getElementById("updatePhone").value;
    let email     = document.getElementById("updateEmail").value;

    let tmp = {
        id: contactId,
        userId: userId,   // global userId set on login
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + "/UpdateContact." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function ()
    {
        if (this.readyState === 4 && this.status === 200)
        {
            let response = JSON.parse(xhr.responseText);

            if (response.error !== "")
            {
                showStatus(response.error, "red");
            }
            else
            {
                showStatus("Contact updated", "green");
                // Hide Update Contact form after success
                document.getElementById("updateContactForm").style.display = "none";

                // Clear update inputs
                document.getElementById("updateFirstName").value = "";
                document.getElementById("updateLastName").value = "";
                document.getElementById("updatePhone").value = "";
                document.getElementById("updateEmail").value = "";
                getContacts(); // refresh list if you have this
            }
        }
    };

    xhr.send(jsonPayload);
} */

/* function loadContactForEdit(id, first, last, phone, email)
{
    selectedContactId = id;

    document.getElementById("updateFirstName").value = first;
    document.getElementById("updateLastName").value = last;
    document.getElementById("updatePhone").value = phone;
    document.getElementById("updateEmail").value = email;

    document.getElementById("updateContactForm").style.display = "block";
} */

// Delete Contact
function deleteContact(contactId)
{

    let tmp = {
        id: contactId,
        userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/DeleteContact." + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function ()
    {
        if (this.readyState === 4 && this.status === 200)
        {
            let response = JSON.parse(xhr.responseText);

            if (response.error !== "")
            {
                showStatus(response.error, "red");
            }
            else
            {
                showStatus("Contact deleted", "red");
                getContacts(); // refresh list
            }
        }
    };

    xhr.send(jsonPayload);
}

// Show status of updating
function showStatus(message, color = "red", target = "statusMessage") 
{
  const el = document.getElementById(target);
  if (!el) return;

  el.style.color = color;
  el.innerHTML = message;

  setTimeout(() => {
    el.innerHTML = "";
  }, 5000);
}


/* popup window */
//open modal
  function openAddContactModal() {
    const modal = document.getElementById('addContactModal');
    modal.style.display = 'flex';
    
    //animation
    setTimeout(() => {
      document.getElementById('modalContent').classList.add('active');
    }, 10);
    
    // go to first input
    document.getElementById('modalFirstName').focus();
  }

  // Close modal
  function closeAddContactModal() {
    const modalContent = document.getElementById('modalContent');
    modalContent.classList.remove('active');
    
    // Wait for animation to finish before hiding
    setTimeout(() => {
      document.getElementById('addContactModal').style.display = 'none';
      
      // Clear inputs
      document.getElementById('modalFirstName').value = '';
      document.getElementById('modalLastName').value = '';
      document.getElementById('modalPhone').value = '';
      document.getElementById('modalEmail').value = '';
    }, 300);
  }

  // Close modal if clicking outside content
  function closeModalIfOutside(event) {
    if (event.target.id === 'addContactModal') {
      closeAddContactModal();
    }
  }

  // Close modal with ESC key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && document.getElementById('addContactModal').style.display === 'flex') {
      closeAddContactModal();
    }
  });

  // Add contact from modal
  function addContactFromModal() {
    let firstName = document.getElementById("modalFirstName").value.trim();
    let lastName = document.getElementById("modalLastName").value.trim();
    let phone = document.getElementById("modalPhone").value.trim();
    let email = document.getElementById("modalEmail").value.trim();
    
    // Basic validation
    if (!firstName || !lastName || !phone) {
      showStatus("First Name, Last Name, and Phone are required", "red");
      return;
    }

    let tmp = {
      firstName: firstName,
      lastName: lastName,
      phone: phone,
      email: email,
      userId: userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/CreateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          try {
            let jsonObject = JSON.parse(xhr.responseText);
            if (jsonObject.error && jsonObject.error !== "") {
              showStatus(jsonObject.error, "red");
            } else {
              showStatus("Contact added successfully!", "green");
              closeAddContactModal();
              getContacts(); // Refresh contact grid
            }
          } catch (e) {
            showStatus("Invalid server response", "red");
          }
        } else {
          showStatus("Server error: " + this.status, "red");
        }
      }
    };

    xhr.send(jsonPayload);
  }

  // ===== VALIDATION FUNCTIONS =====
function isValidEmail(email) {
  // Basic email validation pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

function isValidPhone(phone) {
  // Remove all non-digit characters and check length
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10;
}

function validateContactData(firstName, lastName, phone, email) {
  // Required fields
  if (!firstName.trim()) {
    showStatus("First Name is required", "red", "modalStatusMessage");
    return false;
  }
  
  if (!lastName.trim()) {
    showStatus("Last Name is required", "red", "modalStatusMessage");
    return false;
  }
  
  // Phone validation
  if (!phone.trim()) {
    showStatus("Phone number is required", "red", "modalStatusMessage");
    return false;
  }
  
  if (!isValidPhone(phone)) {
    showStatus("Phone number must contain at least 10 digits", "red", "modalStatusMessage");
    return false;
  }
  
  // Email validation (optional but must be valid if provided)
  if (email.trim() && !isValidEmail(email)) {
    showStatus("Please enter a valid email address", "red", "modalStatusMessage");
    return false;
  }
  
  return true;
}

// ===== MODAL FUNCTIONS =====
function openAddContactModal() {
  const modal = document.getElementById('addContactModal');
  modal.style.display = 'flex';
  
  // Trigger animation
  setTimeout(() => {
    document.getElementById('modalContent').classList.add('active');
  }, 10);
  
  // Focus first input
  document.getElementById('modalFirstName').focus();
}

function closeAddContactModal() {
  const modalContent = document.getElementById('modalContent');
  modalContent.classList.remove('active');
  
  // Wait for animation to finish before hiding
  setTimeout(() => {
    document.getElementById('addContactModal').style.display = 'none';
    
    // Clear inputs
    document.getElementById('modalFirstName').value = '';
    document.getElementById('modalLastName').value = '';
    document.getElementById('modalPhone').value = '';
    document.getElementById('modalEmail').value = '';
  }, 300);
}

function closeModalIfOutside(event) {
  if (event.target.id === 'addContactModal') {
    closeAddContactModal();
  }
}

// Close modal with ESC key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && document.getElementById('addContactModal').style.display === 'flex') {
    closeAddContactModal();
  }
});

// Add contact from modal WITH VALIDATION
function addContactFromModal() {
  let firstName = document.getElementById("modalFirstName").value.trim();
  let lastName = document.getElementById("modalLastName").value.trim();
  let phone = document.getElementById("modalPhone").value.trim();
  let email = document.getElementById("modalEmail").value.trim();
  
  // Validate input
  if (!validateContactData(firstName, lastName, phone, email)) {
    return;
  }

  let tmp = {
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    email: email,
    userId: userId
  };

  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + '/CreateContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        try {
          let jsonObject = JSON.parse(xhr.responseText);
          if (jsonObject.error && jsonObject.error !== "") {
            showStatus(jsonObject.error, "red");
          } else {
            showStatus("Contact added successfully!", "green");
            closeAddContactModal();
            getContacts(); // Refresh contact grid
          }
        } catch (e) {
          showStatus("Invalid server response", "red");
        }
      } else {
        showStatus("Server error: " + this.status, "red");
      }
    }
  };

  xhr.send(jsonPayload);
}

// ===== ENHANCED UPDATE FUNCTION WITH VALIDATION =====
function updateContact(contactId) {
  let firstName = document.getElementById("updateFirstName").value.trim();
  let lastName  = document.getElementById("updateLastName").value.trim();
  let phone     = document.getElementById("updatePhone").value.trim();
  let email     = document.getElementById("updateEmail").value.trim();

  // Validate input before sending update
  if (!validateContactData(firstName, lastName, phone, email)) {
    return;
  }

  let tmp = {
    id: contactId,
    userId: userId,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    email: email
  };

  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/UpdateContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let response = JSON.parse(xhr.responseText);

      if (response.error !== "") {
        showStatus(response.error, "red");
      } else {
        showStatus("Contact updated", "green");
        // Hide Update Contact form after success
        document.getElementById("updateContactForm").style.display = "none";

        // Clear update inputs
        document.getElementById("updateFirstName").value = "";
        document.getElementById("updateLastName").value = "";
        document.getElementById("updatePhone").value = "";
        document.getElementById("updateEmail").value = "";
        getContacts(); // refresh list
      }
    }
  };

  xhr.send(jsonPayload);
}

// ===== delete confirmation =====
let contactToDelete = null;

function showDeleteConfirmModal(contactId, firstName, lastName) {
  contactToDelete = contactId;
  document.getElementById('deleteContactName').textContent = `${firstName} ${lastName}`;
  
  const modal = document.getElementById('deleteConfirmModal');
  modal.style.display = 'flex';
  
  // Trigger animation
  setTimeout(() => {
    document.getElementById('deleteModalContent').classList.add('active');
  }, 10);
}

function closeDeleteConfirmModal() {
  const modalContent = document.getElementById('deleteModalContent');
  modalContent.classList.remove('active');
  
  setTimeout(() => {
    document.getElementById('deleteConfirmModal').style.display = 'none';
    contactToDelete = null;
  }, 300);
}

function closeDeleteModalIfOutside(event) {
  if (event.target.id === 'deleteConfirmModal') {
    closeDeleteConfirmModal();
  }
}

function confirmDeleteContact() {
  if (contactToDelete) {
    // Call the original delete function
    executeDeleteContact(contactToDelete);
    closeDeleteConfirmModal();
  }
}

// Modified deleteContact function - now shows confirmation modal instead of direct deletion
function deleteContact(contactId) {
  // Find the contact name from the DOM to show in confirmation
  const card = document.querySelector(`.contact-card[data-id="${contactId}"]`);
  if (card) {
    const nameParts = card.querySelector('h3').textContent.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    showDeleteConfirmModal(contactId, firstName, lastName);
  } else {
    // Fallback if card not found (shouldn't happen)
    if (confirm('Are you sure you want to delete this contact?')) {
      executeDeleteContact(contactId);
    }
  }
}

// Actual deletion logic (renamed from original deleteContact)
function executeDeleteContact(contactId) {
  let tmp = {
    id: contactId,
    userId: userId
  };

  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/DeleteContact." + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let response = JSON.parse(xhr.responseText);

      if (response.error !== "") {
        showStatus(response.error, "red");
      } else {
        showStatus("Contact deleted", "red");
        getContacts(); // refresh list
      }
    }
  };

  xhr.send(jsonPayload);
}

// Add ESC key support for delete modal
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    if (document.getElementById('deleteConfirmModal').style.display === 'flex') {
      closeDeleteConfirmModal();
    } else if (document.getElementById('addContactModal').style.display === 'flex') {
      closeAddContactModal();
    }
  }
});

// ===== INLINE EDITING FUNCTIONS =====
function editContactInline(contactId) {
  const card = document.querySelector(`.contact-card[data-id="${contactId}"]`);
  if (!card) return;
  
  // Store original HTML for cancel functionality
  card.dataset.originalHtml = card.innerHTML;
  
  // Extract current data
  const nameParts = card.querySelector('h3').textContent.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  
  const infoDivs = card.querySelectorAll('.contact-info div');
  const phone = infoDivs[0] ? infoDivs[0].textContent.replace('Phone:', '').trim() : '';
  const email = infoDivs[1] ? infoDivs[1].textContent.replace('Email:', '').trim() : '';
  
  // Switch to edit mode
  card.className = 'contact-card edit-mode';
  card.innerHTML = `
    <div class="contact-edit-fields">
      <input type="text" class="edit-first" value="${escapeHtml(firstName)}" placeholder="First Name">
      <input type="text" class="edit-last" value="${escapeHtml(lastName)}" placeholder="Last Name">
    </div>
    <div class="contact-info">
      <div>
        <label>Phone:</label>
        <input type="text" class="edit-phone" value="${escapeHtml(phone)}" placeholder="Phone">
      </div>
      <div>
        <label>Email:</label>
        <input type="text" class="edit-email" value="${escapeHtml(email)}" placeholder="Email">
      </div>
    </div>
    <div class="contact-actions">
      <button class="action-btn cancel" onclick="cancelEditInline(${contactId})" title="Cancel">
        <i class="fa fa-times"></i>
      </button>
      <button class="action-btn save" onclick="saveContactInline(${contactId})" title="Save">
        <i class="fa fa-check"></i>
      </button>
    </div>
  `;
  
  // Focus first name field
  card.querySelector('.edit-first').focus();
}

function cancelEditInline(contactId) {
  const card = document.querySelector(`.contact-card[data-id="${contactId}"]`);
  if (!card || !card.dataset.originalHtml) return;
  
  // Restore original HTML
  card.className = 'contact-card';
  card.innerHTML = card.dataset.originalHtml;
}

function saveContactInline(contactId) {
  const card = document.querySelector(`.contact-card[data-id="${contactId}"]`);
  if (!card) return;
  
  // Get edited values
  const firstName = card.querySelector('.edit-first').value.trim();
  const lastName = card.querySelector('.edit-last').value.trim();
  const phone = card.querySelector('.edit-phone').value.trim();
  const email = card.querySelector('.edit-email').value.trim();
  
  // Validate input
  if (!validateContactData(firstName, lastName, phone, email)) {
    return;
  }
  
  // Prepare update payload
  let tmp = {
    id: contactId,
    userId: userId,
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    email: email
  };
  
  let jsonPayload = JSON.stringify(tmp);
  let url = urlBase + "/UpdateContact." + extension;
  
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
  xhr.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let response = JSON.parse(xhr.responseText);
      
      if (response.error !== "") {
        showStatus(response.error, "red");
      } else {
        showStatus("Contact updated", "green");
        // Refresh the entire contact grid to show updated data
        getContacts();
      }
    }
  };
  
  xhr.send(jsonPayload);
}

// Updated displayContacts function with inline editing support
function displayContacts(contacts) {
  const grid = document.getElementById("contactGrid");
  
  if (contacts.length === 0) {
    grid.innerHTML = "<div class='no-contacts'>No contacts found</div>";
    return;
  }
  
  let html = '';
  contacts.forEach(contact => {
    // Escape quotes for safety
    let first = escapeHtml(contact.firstName);
    let last = escapeHtml(contact.lastName);
    let phone = escapeHtml(contact.phone);
    let email = escapeHtml(contact.email);
    
    html += `
      <div class="contact-card" data-id="${contact.id}">
        <h3>${first} ${last}</h3>
        <div class="contact-info">
          <div><label>Phone:</label> ${phone}</div>
          <div><label>Email:</label> ${email || '—'}</div>
        </div>
        <div class="contact-actions">
          <button class="action-btn" onclick="editContactInline(${contact.id})" title="Edit">
            <i class="fa fa-pencil"></i>
          </button>
          <button class="action-btn delete" onclick="deleteContact(${contact.id})" title="Delete">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  });
  
  grid.innerHTML = html;
}