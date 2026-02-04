const urlBase = 'http://www.tempclassproject.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// LOGIN
function doLogin() {
	userId = 0;
	firstName = "";
	lastName = "";

	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;

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

// COOKIE FUNCTIONS
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

// LOGOUT
function doLogout() {
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// REGISTER
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
	let url = urlBase + '/Register.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.send(jsonPayload);
	} catch (err) {
		console.log(err);
	}
}

// GET ALL CONTACTS
function getContacts() {
	let tmp = { userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/GetContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				let results = jsonObject.results;

				let resultList = "";
				for (let i = 0; i < results.length; i++) {
					let contact = results[i];
					resultList += `Name: ${contact.firstName} ${contact.lastName}, Phone: ${contact.phone}, Email: ${contact.email}<br>`;
				}

				document.getElementById("allResults").innerHTML = resultList;
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("allResults").innerHTML = err.message;
	}
}

// SEARCH CONTACTS
function searchContacts() {
	let srch = document.getElementById("searchText").value;
	document.getElementById("searchResults").innerHTML = "";

	let tmp = { search: srch, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try {
		xhr.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				let jsonObject = JSON.parse(xhr.responseText);
				let results = jsonObject.results;

				let resultList = "";
				for (let i = 0; i < results.length; i++) {
					let contact = results[i];
					resultList += `Name: ${contact.firstName} ${contact.lastName}, Phone: ${contact.phone}, Email: ${contact.email}<br>`;
				}

				document.getElementById("searchResults").innerHTML = resultList;
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		document.getElementById("searchResults").innerHTML = err.message;
	}
}

// ADD CONTACT
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
					alert("Error: " + jsonObject.error);
				} else {
					alert("Contact added successfully!");
				}
			}
		};
		xhr.send(jsonPayload);
	} catch (err) {
		alert("Request failed: " + err.message);
	}
}

// TOGGLE ADD CONTACT FORM
function toggleAddContact() {
    const form = document.getElementById("addContactForm");
    form.style.display = (form.style.display === "none") ? "block" : "none";
}