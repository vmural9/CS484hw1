function changeInput(value) {
  // Write code to get the element for "input"
  // Set the inputElement.value as value
}

async function handleEdit(e) {
  console.log(e);
}

async function populateHistory() {
  try {
    const response = await fetch("/get_prompt_list", {
      method: "GET",
    });

    if (response.status === 200) {
      const promptList = await response.json();
      historyElement.innerHTML = "";

      promptList.msg.forEach((promptObj) => {
        const divElement = document.createElement("div");
        divElement.classList.add("chat-entry");
        divElement.setAttribute("data-id", promptObj.id);

        const textField = document.createElement("p");
        textField.textContent = promptObj.prompt;
        textField.addEventListener("click", (event) => {
          changeInput(textField.textContent);
          inputElement.dataset.editId = promptObj.id;
        });

        const deleteButton = document.createElement("button");
        deleteButton.innerHTML = "&#128465;";

        // TO DO Complete the delete Prompt functionality of the element.
        // 1. Attach an event listener to the click of the deleteButton. Look at the textField for your reference.
        // 2. The event listener method takes a callback function as its argument.Use an asynchronous function and inside the function definition:
        //    2.1 Get the attribute from "data-id", say id.
        //    2.2 Call the deletePrompt() and pass id as argument. See if it is an async function or sync function. You need to handle promise in case of async.
        //    2.3 Remove the divElement.

        // 3. Append textField and deleteButton as children to the divElement.

        // 4. Append the divElement as a child to the historyElemenet.
      });
    } else {
      console.log("Error fetching prompt list");
    }
  } catch (error) {
    console.error("Error while fetching prompt list:", error);
  }
}

async function deletePrompt(incomingId) {
  const editId = inputElement.dataset.editId;
  if (incomingId === editId) {
    delete inputElement.dataset.editId;
  }

  try {
    const response = await fetch(`/delete_user_prompt/${incomingId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      const result = await response.json();
      if (result.msg === true) {
        console.log(`Prompt with ID ${incomingId} has been deleted.`);
        await populateHistory();
      } else {
        console.log("Failed to delete Prompt.");
      }
    } else {
      console.log("Error deleting Prompt.");
    }
  } catch (error) {
    console.error("Error while deleting Prompt:", error);
  }
}

async function updateUserPrompt(promptId, updatedPrompt) {
  const payload = {
    prompt: updatedPrompt,
  };

  // 1. Make a PUT request to the update_user_prompt. Use fetch.
  // 2. For your reference: Have a look at other functions and how requests are being made.
  // 3. Get the jsonData from response's json.
  // 4. Check if jsonData.msg is true? If yes return true: Else return false
  try {
    // const response = Make PUT request. Replace with Code.
    if (response.status === 200) {
      // Write code here.
    } else {
      console.log("Error updating Prompt.");
    }
  } catch (error) {
    console.error("Error while updating Prompt:", error);
  }
  return false;
}

async function createUserPrompt(incomingPrompt) {
  const inputPrompt = incomingPrompt;

  payload = {
    prompt: incomingPrompt,
  };

  const response = await fetch("/create_user_prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "same-origin",
    body: JSON.stringify(payload),
  });

  if (response.status != 200) {
    document.getElementsByClassName("hidden-info")[0].style.display = "block";
    document.getElementById("msg-for-failure").innerHTML =
      "Something went wrong. Please try again.";
    return false;
  }
  const jsonData = await response.json();
  console.log(jsonData);
  if (jsonData.msg == true) {
    return true;
  } else {
    return false;
  }
}

async function chat() {
  const editId = inputElement.dataset.editId;
  console.log("Edit ID", editId);
  if (editId) {
    const response = await updateUserPrompt(editId, inputElement.value);
    if (response) {
      await populateHistory();
      inputElement.value = "";
      delete inputElement.dataset.editId; // Clear the edit ID
    }
  } else {
    const response = await fetch(
      "https://official-joke-api.appspot.com/random_joke",
      {
        method: "GET",
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      console.log(data);
      let joke = data.setup + "....." + data.punchline;
      outputElement.textContent = joke;
    } else {
      outputElement.textContent = "Something's Cooking!";
    }

    if (inputElement.value) {
      console.log(inputElement.value);
      const response = await createUserPrompt(inputElement.value);
      if (response) {
        await populateHistory();
        inputElement.value = "";
      }
    }
  }
}

function clearInput() {
  inputElement.value = "";
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

async function editAccount() {
  const updatePageURL = "/update-user";
  window.location.href = updatePageURL;
}

const submitButton = document.querySelector("#submit");
const outputElement = document.querySelector("#output");
const inputElement = document.querySelector("input");
const historyElement = document.querySelector(".history");
const buttonElement = document.querySelector("button");
window.addEventListener("load", populateHistory);
submitButton.addEventListener("click", chat);
buttonElement.addEventListener("click", clearInput);

inputElement.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    chat();
  }
});
