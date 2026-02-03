const urlBase = 'http://www.tempclassproject.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
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
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime() + (minutes * 60 * 1000));

	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString() + ";path=/";
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
	document.cookie = "lastName=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
	document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
	window.location.href = "index.html";
}

function getContacts()
{
	document.getElementById("results").innerHTML = "";

	let tmp = { userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/GetContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error && jsonObject.error !== "")
				{
					document.getElementById("results").innerHTML = jsonObject.error;
					return;
				}

				renderContacts(jsonObject.results);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("results").innerHTML = err.message;
	}
}

function searchContacts()
{
	let srch = document.getElementById("searchText").value.trim();
	document.getElementById("results").innerHTML = "";

	// If empty, just load all contacts
	if (srch === "")
	{
		getContacts();
		return;
	}

	let tmp = { search: srch, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContacts.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.error && jsonObject.error !== "")
				{
					document.getElementById("results").innerHTML = jsonObject.error;
					return;
				}

				renderContacts(jsonObject.results);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("results").innerHTML = err.message;
	}
}

function renderContacts(list)
{
	// Show contacts in a simple table
	let html = "<table style='width:100%; font-size:22px;'><tr><th>Name</th><th>Phone</th><th>Email</th></tr>";

	for (let i = 0; i < list.length; i++)
	{
		let c = list[i];
		let name = `${c.firstName} ${c.lastName}`;
		html += `<tr>
			<td>${escapeHtml(name)}</td>
			<td>${escapeHtml(c.phone)}</td>
			<td>${escapeHtml(c.email)}</td>
		</tr>`;
	}

	html += "</table>";
	document.getElementById("results").innerHTML = html;
}

function escapeHtml(s)
{
	return String(s ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}
function goToRegister()
{
  window.location.href = "register.html";
}

function doRegister()
{
  let firstName = document.getElementById("firstName").value.trim();
  let lastName  = document.getElementById("lastName").value.trim();
  let login     = document.getElementById("login").value.trim();
  let password  = document.getElementById("password").value;

  document.getElementById("registerResult").innerHTML = "";

  let tmp = { firstName:firstName, lastName:lastName, login:login, password:password };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/Register.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  xhr.onreadystatechange = function()
  {
    if (this.readyState == 4)
    {
      let jsonObject = {};
      try { jsonObject = JSON.parse(xhr.responseText); } catch(e) {}

      if (this.status != 200 || (jsonObject.error && jsonObject.error !== ""))
      {
        document.getElementById("registerResult").innerHTML =
          jsonObject.error ? jsonObject.error : "Registration failed";
        return;
      }

      document.getElementById("registerResult").innerHTML = "Registered! Go log in.";
      window.location.href = "index.html";
    }
  };

  xhr.send(jsonPayload);
}
