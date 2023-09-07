async function loginCheck(event) {
  event.preventDefault();
  const emailId = document.getElementById("emailId").value;
  const password = document.getElementById("password").value;

  if (!checkEmailId(emailId)) {
    console.log("HERRE");
    document.getElementsByClassName("hidden-info")[0].style.display = "block";
    document.getElementById("msg-for-failure").innerHTML = "Incorrect Email Id";
    return;
  }

  data = {
    emailId: emailId,
    password: password,
  };

  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    redirect: "follow",
  });

  if (response.status == 401) {
    document.getElementsByClassName("hidden-info")[0].style.display = "block";
    document.getElementById("msg-for-failure").innerHTML =
      "Unauthorized. Please enter correct credentials";
    return;
  }

  console.log(response);
  const HTMLtext = await response.text();
  window.location.href = "/dashboard";
  // console.log(HTMLtext);
  // document.open();
  // document.write(HTMLtext);
  // document.close();
}

async function createUserSubmit() {
  // Fetch Input from Forms
  const emailId = document.getElementById("emailId").value;
  const password = document.getElementById("password").value;
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const role = document.getElementById("role-selector").value;

  payload = {
    emailId: emailId,
    password: password,
    firstname: firstname,
    lastname: lastname,
    role: role,
  };

  const response = await fetch("/create_user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status == 401) {
    document.getElementsByClassName("hidden-info")[0].style.display = "block";
    document.getElementById("msg-for-failure").innerHTML =
      "Unauthorized. Please enter correct credentials";
    return;
  }

  const jsonData = await response.json();
  if (jsonData.msg == true) {
    document.getElementsByClassName("hidden-info")[0].style.display = "block";
    document.getElementById(
      "msg-for-failure-sucess"
    ).innerHTML = `Successfully created user with email-id - ${emailId}`;
    // document.redirect("/dashboard");
  } else {
    document.getElementsByClassName("hidden-info")[0].style.display = "block";
    document.getElementById(
      "msg-for-failure-sucess"
    ).innerHTML = `There was some issue while creating the user. Check server logs for more details`;
  }
}

async function updateUserSubmit() {
  // Fetch the input form data
  const emailId = document.getElementById("emailId").value;
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;

  payload = {
    emailId: emailId,
    firstname: firstname,
    lastname: lastname,
  };

  const response = await fetch("/update_user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(payload),
  });

  if (response.status == 401) {
    document.getElementsByClassName("hidden-info")[0].style.display = "block";
    document.getElementById("msg-for-failure").innerHTML =
      "Unauthorized. Please Login Again";
    return;
  }

  const jsonData = await response.json();
  if (jsonData.msg == true) {
    document.getElementsByClassName("hidden-info")[0].style.display = "block";
    document.getElementById(
      "msg-for-failure-success"
    ).innerHTML = `Successfully udpated user with email-id - ${emailId}`;
  } else {
    document.getElementsByClassName("hidden-info")[0].style.display = "block";
    document.getElementById(
      "msg-for-failure-success"
    ).innerHTML = `There was some issue while updating the user. Check server logs for more details`;
  }
}

async function logout() {
  try {
    const response = await fetch("/logout", {
      method: "GET",
      redirect: "follow",
    });

    if (response.redirected) {
      window.location.href = response.url; // Redirect to the provided URL
    } else {
      console.log("Logout response not redirected.");
    }
  } catch (error) {
    console.error("Error during logout:", error);
  }
}

function toggleGlow() {
  const submitButton = document.getElementById("submit");
  submitButton.classList.toggle("glow-button");
}

async function clearInputFields() {
  document.getElementById("emailId").value = "";
  document.getElementById("password").value = "";
  document.getElementsByClassName("hidden-info")[0].style.display = "none";
  document.getElementById("msg-for-failure").innerHTML = "";
}

function checkEmailId(emailID) {
  var re = /\S+@\S+\.\S+/;
  return re.test(emailID);
}
