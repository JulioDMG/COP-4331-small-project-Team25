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
function updateContact(contactId) {

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
}

function loadContactForEdit(id, first, last, phone, email)
{
    selectedContactId = id;

    document.getElementById("updateFirstName").value = first;
    document.getElementById("updateLastName").value = last;
    document.getElementById("updatePhone").value = phone;
    document.getElementById("updateEmail").value = email;

    document.getElementById("updateContactForm").style.display = "block";
}

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
function showStatus(message, color = "red") {
    const el = document.getElementById("statusMessage");
    el.style.color = color;
    el.innerHTML = message;

    // Clear after 5 seconds
    setTimeout(() => {
        el.innerHTML = "";
    }, 5000);
}
