const urlBase = 'http://firstcontactme.site//LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = '';
let lastName = '';

function doLogin() {
  userId = 0;
  firstName = '';
  lastName = '';

  let login = document.getElementById('loginName').value;
  let password = document.getElementById('loginPassword').value;
  //	var hash = md5( password );

  document.getElementById('loginResult').innerHTML = '';

  let tmp = { login: login, password: password };
  //	var tmp = {login:login,password:hash};
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/Login.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        if (userId < 1) {
          document.getElementById('loginResult').innerHTML =
            'User/Password combination incorrect';
          return;
        }

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();

        window.location.href = 'color.html';
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById('loginResult').innerHTML = err.message;
  }
}

function doRegister() {
  userId = 0;

  let firstName = document.getElementById('firstName').value;
  let lastName = document.getElementById('lastName').value;
  let login = document.getElementById('userName').value;
  let password = document.getElementById('loginPassword').value;
  //	var hash = md5( password );

  document.getElementById('loginResult').innerHTML = '';

  let tmp = {
    firstName: firstName,
    lastName: lastName,
    userName: login,
    loginPassword: password,
  };
  console.log(tmp);

  //	var tmp = {login:login,password:hash};
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/Register.' + extension;

  let xhr = new XMLHttpRequest();
  try {
    xhr.open('POST', url, true);
  } catch (err) {
    console.log(err);

    console.log('here');
  }
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let jsonObject = JSON.parse(xhr.responseText);
        userId = jsonObject.id;

        //if (userId < 1) {
        //document.getElementById('loginResult').innerHTML =
        //'User/Password combination incorrect';
        //return;
        //}

        firstName = jsonObject.firstName;
        lastName = jsonObject.lastName;

        saveCookie();

        window.location.href = 'color.html';
      } else {
        console.log('help');
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById('loginResult').innerHTML = err.message;
  }
}

function saveCookie() {
  let minutes = 20;
  let date = new Date();
  date.setTime(date.getTime() + minutes * 60 * 1000);
  document.cookie =
    'firstName=' +
    firstName +
    ',lastName=' +
    lastName +
    ',userId=' +
    userId +
    ';expires=' +
    date.toGMTString();
}

function readCookie() {
  userId = -1;
  let data = document.cookie;
  let splits = data.split(',');
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split('=');
    if (tokens[0] == 'firstName') {
      firstName = tokens[1];
    } else if (tokens[0] == 'lastName') {
      lastName = tokens[1];
    } else if (tokens[0] == 'userId') {
      userId = parseInt(tokens[1].trim());
    }
  }

  if (userId < 0) {
    window.location.href = 'index.html';
  } else {
    document.getElementById('userName').innerHTML =
      'Logged in as ' + firstName + ' ' + lastName;
  }
}

function doLogout() {
  userId = 0;
  firstName = '';
  lastName = '';
  document.cookie = 'firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT';
  window.location.href = 'index.html';
}

function addColor() {
  let newContactName = document.getElementById('newContactName').value;
  let newPhone = document.getElementById('phone').value;
  let newEmail = document.getElementById('email').value;

  document.getElementById('colorAddResult').innerHTML = '';

  let tmp = {
    contact: newContactName,
    phone: newPhone,
    email: newEmail,
    userId,
    userId,
  };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/AddContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById('colorAddResult').innerHTML =
          'Color has been added';
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById('colorAddResult').innerHTML = err.message;
  }
}

function searchColor() {
  let srch = document.getElementById('searchText').value;
  document.getElementById('colorSearchResult').innerHTML = '';

  let colorList = '';

  let tmp = { search: srch, userId: userId };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/SearchColors.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById('colorSearchResult').innerHTML =
          'Color(s) has been retrieved';
        let jsonObject = JSON.parse(xhr.responseText);

        for (let i = 0; i < jsonObject.results.length; i++) {
          colorList += jsonObject.results[i];
          if (i < jsonObject.results.length - 1) {
            colorList += '<br />\r\n';
          }
        }

        document.getElementsByTagName('p')[0].innerHTML = colorList;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    document.getElementById('colorSearchResult').innerHTML = err.message;
  }
}

function loadData() {
  // Taken from read cookie
  let data = document.cookie;
  let splits = data.split(',');
  for (var i = 0; i < splits.length; i++) {
    let thisOne = splits[i].trim();
    let tokens = thisOne.split('=');
    if (tokens[0] == 'firstName') {
      firstName = tokens[1];
    } else if (tokens[0] == 'lastName') {
      lastName = tokens[1];
    } else if (tokens[0] == 'userId') {
      userId = parseInt(tokens[1].trim());
    }
  }

  // I wanted to get the userID, If user ID is -1, it logs out
  // Other wise it will pass the userID to the API key load, which loads the contacts onto the page.
  if (userId < 0) {
    window.location.href = 'index.html';
  } else {
    let tmp = { userId: userId };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Load.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    try {
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          let jsonObject = JSON.parse(xhr.responseText);
          // console.log(jsonObject.results[0]['Name']);
          // console.log('hello');

          // for (let i = 0; i < jsonObject.results.length; i++) {
          //   contactList += jsonObject.results[i];
          //   if (i < jsonObject.results.length - 1) {
          //     contactList += '<br />\r\n';
          //   }
          // }

          // Passes the Name, phone, and email to the function show conatct
          for (let i = 0; i < jsonObject.results.length; i++) {
            showContact(
              jsonObject.results[i]['Name'],
              jsonObject.results[i]['Phone'],
              jsonObject.results[i]['Email']
            );
          }
        }
      };
      xhr.send(jsonPayload);
    } catch (err) {
      document.getElementById('colorSearchResult').innerHTML = err.message;
    }
  }
}

// This function takes in 3 strings and prints them out by making new html elements and adding them to a div
function showContact(name, phone, email) {
  const div = document.createElement('div');
  const heading = document.createElement('h4');
  const paraPhone = document.createElement('p');
  const paraEmail = document.createElement('p');

  heading.textContent = name;
  paraPhone.textContent = 'Phone: ' + phone;
  paraEmail.textContent = 'Email: ' + email;

  let section = document.getElementById('contactList');

  section.appendChild(div);
  div.appendChild(heading);
  div.appendChild(paraPhone);
  div.appendChild(paraEmail);
}
