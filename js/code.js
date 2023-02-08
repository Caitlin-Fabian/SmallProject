var urlBase = 'http://firstcontactme.site//LAMPAPI';
var extension = 'php';

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

        window.location.href = 'contacts.html';
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
  let flag = validatePassword(password);
  
  if(flag == true){ //valid password
  
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
  
          window.location.href = 'contacts.html';
        } else {
          console.log('help');
        }
      };
      xhr.send(jsonPayload);
    } catch (err) {
      document.getElementById('loginResult').innerHTML = err.message;
    }
  }else{
    console.log('missing password requirements');
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
    // document.getElementById('userName').innerHTML =
    //   'Logged in as ' + firstName + ' ' + lastName;
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

  if (validateEmail(newEmail) == true) {
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
            'Contact has been added';
        }
      };
      xhr.send(jsonPayload);
    } catch (err) {
      document.getElementById('colorAddResult').innerHTML = err.message;
    }
  } else {
    console.log('Invalid email!');
  }
}

function validateEmail(email) {
  const ret = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  return Boolean(ret);
}

//checks that password is 8 characters long, contains lowercase, uppercase, and a number
function validatePassword(psw){
  if(psw.length<8 && psw.search(/[a-z]/)<0 && psw.search(/[A-Z]/)<0 && psw.search(/[0-9]/)<0){
    return false;
  }else{
    return true;
  }
}

function searchColor() {
  let srch = document.getElementById('searchText').value;
  // document.getElementById('colorSearchResult').innerHTML = '';

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
        // document.getElementById('colorSearchResult').innerHTML =
        console.log('Color(s) has been retrieved');
        let jsonObject = JSON.parse(xhr.responseText);

        for (let i = 0; i < jsonObject.results.length; i++) {
          colorList += jsonObject.results[i];
          if (i < jsonObject.results.length - 1) {
            colorList += '<br />\r\n';
          }
        }

        // document.getElementsByTagName('p')[0].innerHTML = colorList;
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    // document.getElementById('colorSearchResult').innerHTML = err.message;
  }
}

function deleteContact(id) {
  let tmp = { ID: id };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/Delete.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log('THIS IS DELETED');
      } else {
        console.log('did not delete');
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    console.log(err);
  }
}
function editContact(id) {
  let tmp = { ID: id };
  let jsonPayload = JSON.stringify(tmp);

  let url = urlBase + '/UpdateContact.' + extension;

  let xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
  try {
    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        console.log('THIS IS DELETED');
      } else {
        console.log('did not edit');
      }
    };
    xhr.send(jsonPayload);
  } catch (err) {
    console.log(err);
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

          // Passes the Name, phone, and email to the function show contact
          for (let i = 0; i < jsonObject.results.length; i++) {
            showContact(
              jsonObject.results[i]['ID'],
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
function showContact(id, name, phone, email, break_obj) {
  var cardDiv = document.createElement('div');
  var cardBody = document.createElement('div');
  var cardHeading = document.createElement('h5');
  var cardUL = document.createElement('ul');
  var cardPhone = document.createElement('li');
  var cardEmail = document.createElement('li');
  var cardDeleteDiv = document.createElement('div');
  var cardDeleteButton = document.createElement('button');
  var cardEditButton = document.createElement('button');
  var cardEditDiv = document.createElement('div');

  // if (break_obj % 2 != 0) {
  //   cardDiv.setAttribute('class', 'col card mt-2 mb-4 bg-secondary');
  // } else {
  // }
  cardDiv.setAttribute('class', ' card m-4 bg-secondary');

  cardDiv.setAttribute('style', 'width: 18rem');

  cardBody.setAttribute('class', 'card-body');
  cardHeading.setAttribute('class', 'card-title');
  cardHeading.textContent = name;

  cardUL.setAttribute('class', 'list-group list-group-flush');
  cardPhone.setAttribute('class', 'list-group-item bg-secondary');
  cardEmail.setAttribute('class', 'list-group-item bg-secondary');
  cardPhone.textContent = phone;
  cardEmail.textContent = email;

  cardDeleteDiv.setAttribute(
    'class',
    'card-body text-center d-flex justify-content-around'
  );
  cardDeleteButton.setAttribute('class', 'btn btn-primary');
  var id_string = `deleteContact(${id}); window.location.reload(); `;

  cardDeleteButton.setAttribute('onClick', id_string);

  cardDeleteButton.textContent = 'Delete';

  cardEditButton.setAttribute('class', 'btn btn-primary');
  // var id_string = `EditContact(${id}); window.location.reload(); `;

  // cardEditButton.setAttribute('onClick', id_string);

  cardEditButton.textContent = 'Edit';

  let section = document.getElementById('contactSection');

  // if (break_obj % 3 == 0) {
  //   cardDiv.setAttribute('class', row);
  // }

  section.appendChild(cardDiv);
  cardDiv.appendChild(cardBody);
  cardBody.appendChild(cardHeading);
  cardDiv.appendChild(cardUL);
  cardUL.appendChild(cardPhone);
  cardUL.appendChild(cardEmail);
  cardDiv.appendChild(cardDeleteDiv);
  cardDeleteDiv.appendChild(cardEditButton);
  cardDeleteDiv.appendChild(cardDeleteButton);
}
