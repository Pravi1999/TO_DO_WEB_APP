let todo = localStorage.getItem("todo")
  ? JSON.parse(localStorage.getItem("todo"))
  : new Array();
let done = localStorage.getItem("done")
  ? JSON.parse(localStorage.getItem("done"))
  : new Array();

window.onload = () => {
  const form1 = document.querySelector("#TODO_TASKS");
  let items = document.getElementById("items");
  let submit = document.getElementById("Add_task");
  let completedItems = document.getElementById("completedItems");

  form1.addEventListener("submit", addItem);
  items.addEventListener("click", handleToDoButtonClick);
  completedItems.addEventListener("click", handleToDoButtonClickForCompleted);

  // restore in-progress
  if (todo.length !== 0) {
    for (let i = 0; i < todo.length; i++) {
      item = todo[i];
      let li = createMainLiTaskElement(item);
      li.appendChild(createTaskButtons());

      items.appendChild(li);
    }
  }

  // restore done
  if (done.length !== 0) {
    for (let i = 0; i < done.length; i++) {
      item = done[i];
      let li = createMainLiTaskElement(item);
      li.appendChild(createButtonForCompletedTasks());
      completedItems.appendChild(li);
    }
  }
};

function useAlert(msg, success = true) {
  var div = document.createElement("div");
  var alertClass = success ? "alert-success" : "alert-danger";
  div.className = "alert " + alertClass;
  div.role = "alert";
  div.innerHTML = msg;
  return div.outerHTML;
}

function operationCompleted(msg) {
  document.getElementById("lblsuccess").innerHTML = msg;
  document.getElementById("lblsuccess").style.display = "block";

  setTimeout(function () {
    document.getElementById("lblsuccess").style.display = "none";
  }, 3000);
}
//replace todo-text    :item
function addItem(e) {
  e.preventDefault();
  let newItem = document.getElementById("todo-text").value;
  if (submit.value != "Add Todo") {
    console.log("Hello");

    if (newItem.trim() == "" || newItem.trim() == null) {
      operationCompleted(useAlert("Please enter a task in todo!", false));
    } else {
      editItem.target.parentNode.parentNode.childNodes[0].data =
        document.getElementById("todo-text").value;

      submit.value = "Add Todo";
      document.getElementById("todo-text").value = "";
      document.getElementById("lblsuccess").style.display = "block";
      setTimeout(function () {
        document.getElementById("lblsuccess").style.display = "none";
      }, 3000);

      return false;
    }
  }

  if (newItem.trim() == "" || newItem.trim() == null) {
    document.getElementById("lblsuccess").innerHTML = useAlert(
      "Please enter some data!",
      false
    );

    document.getElementById("lblsuccess").style.display = "block";

    setTimeout(function () {
      document.getElementById("lblsuccess").style.display = "none";
    }, 3000);

    return false;
  } else document.getElementById("todo-text").value = "";
  let li = createMainLiTaskElement(newItem);
  li.appendChild(createTaskButtons());
  items.appendChild(li);
  addlocaltodo(newItem);
}
function handleToDoButtonClick(e) {
  e.preventDefault();

  // Handle delete todo button click
  if (e.target.classList.contains("delete")) {
    if (confirm("Are you sure to delete a task ?")) {
      let li = e.target.parentNode.parentNode;
      items.removeChild(li);
      removelocaltodo(li.childNodes[0].data);
      document.getElementById("lblsuccess").innerHTML = useAlert(
        "Task deleted successfully"
      );

      document.getElementById("lblsuccess").style.display = "block";

      setTimeout(function () {
        document.getElementById("lblsuccess").style.display = "none";
      }, 3000);
    }
  }
  // Handle complete todo button click
  if (e.target.classList.contains("comp")) {
    if (confirm("Are you Sure?")) {
      let li = e.target.parentNode.parentNode;
      li.removeChild(li.childNodes[1]);
      completeTask(li.innerText);
      items.removeChild(li);
      removelocaltodo(li.childNodes[0].data);
      addlocaldone(li.childNodes[0].data);
      document.getElementById("lblsuccess").innerHTML = useAlert(
        "Successfully Marked as Completed!"
      );

      document.getElementById("lblsuccess").style.display = "block";

      setTimeout(function () {
        document.getElementById("lblsuccess").style.display = "none";
      }, 3000);
    }
  }

  // Handle important todo button click
  if (e.target.classList.contains("imp")) {
    let button = e.target;
    let li = button.parentNode.parentNode;

    if (li.classList.contains("important")) {
      button.innerText = "Mark as important";
      li.classList.remove("important");
      removelocalimp(li.childNodes[0].data);
    } else {
      button.innerText = "Mark as normal";
      li.classList.add("important");
      items.insertBefore(li, items.childNodes[0]);
      addlocalimp(li.childNodes[0].data);
    }
  }
}

function toggleButton(ref, btnID) {
  document.getElementById(btnID).disabled = false;
}

function completeTask(innerText) {
  let li = createMainLiTaskElement(innerText);
  li.appendChild(createButtonForCompletedTasks());
  completedItems.appendChild(li);
}

function createTaskButtons() {
  let actions = document.createElement("div");
  actions.className = "actions flex-grow-0 align-self-start ml-2";

  let deleteButton = document.createElement("button");

  deleteButton.className = "btn-danger btn btn-sm mr-2 mb-2 delete";

  deleteButton.appendChild(document.createTextNode("Delete Task  "));

  //icon for delete button
  var img = document.createElement("img");
  img.src = "icons/delete.png";
  deleteButton.appendChild(img);

  let compButton = document.createElement("button");

  compButton.className = "btn-success btn btn-sm mr-2 mb-2 comp";

  compButton.appendChild(document.createTextNode("Mark as Complete  "));

  var doneImg = document.createElement("img");
  doneImg.src = "icons/done.png";
  compButton.appendChild(doneImg);

  let editButton = document.createElement("button");

  editButton.className = "btn-warning btn btn-sm mr-2 mb-2 edit";

  editButton.appendChild(document.createTextNode("Edit Task  "));

  //icon for edit button
  var editImg = document.createElement("img");
  editImg.src = "icons/edit.png";
  editButton.appendChild(editImg);

  actions.appendChild(deleteButton);
  actions.appendChild(compButton);
  return actions;
}

function handleToDoButtonClickForCompleted(e) {
  e.preventDefault();

  //Handle inProgress task button click
  if (e.target.classList.contains("inpro")) {
    if (confirm("Are you Sure?")) {
      let completedTaskLi = e.target.parentNode.parentNode;
      completedTaskLi.removeChild(completedTaskLi.childNodes[1]);
      let li = createMainLiTaskElement(completedTaskLi.innerText);
      li.appendChild(createTaskButtons());

      items.appendChild(li);

      completedItems.removeChild(completedTaskLi);

      removelocaldone(li.childNodes[0].data);
      addlocaltodo(li.childNodes[0].data);

      operationCompleted(useAlert("Successfully Marked as Pending!"));
    }
  }
  //Handle Remove Item After Completion click
  if (e.target.classList.contains("remove")) {
    if (confirm("Are you Sure? This Item will be Permanently Removed.")) {
      let completedTaskLi = e.target.parentNode.parentNode;
      completedTaskLi.removeChild(completedTaskLi.childNodes[1]);
      completedItems.removeChild(completedTaskLi);
      removelocaldone(completedTaskLi.innerText);
      operationCompleted(useAlert("Item Successfully Removed from List."));
    }
  }
}

function createButtonForCompletedTasks() {
  let actions = document.createElement("div");
  actions.className = "actions flex-grow-0 align-self-start ml-2";

  let moveToInprogressButton = document.createElement("button");
  moveToInprogressButton.className = "btn-success btn btn-sm mr-2 mb-2 inpro";

  moveToInprogressButton.appendChild(
    document.createTextNode("Mark as Pending")
  );
  actions.appendChild(moveToInprogressButton);

  let removeCompletedButton = document.createElement("button");
  removeCompletedButton.className = "btn-danger btn btn-sm mr-2 mb-2 remove";

  removeCompletedButton.appendChild(document.createTextNode("Remove"));
  actions.appendChild(removeCompletedButton);

  return actions;
}

function createMainLiTaskElement(taskText) {
  let li = document.createElement("li");
  li.className =
    "list-group-item d-flex flex-row align-items-center justify-content-between flex-sm-wrap";
  li.appendChild(document.createTextNode(taskText));
  return li;
}

function addlocaltodo(task) {
  todo.push(task);
  localStorage.setItem("todo", JSON.stringify(todo));
}

function removelocaltodo(task) {
  // console.log(task);
  for (let i = 0; i < todo.length; i++) {
    if (todo[i] === task) {
      todo.splice(i, 1);
      break;
    }
  }
  localStorage.setItem("todo", JSON.stringify(todo));
}

function addlocaldone(task) {
  done.push(task);
  localStorage.setItem("done", JSON.stringify(done));
}

function removelocaldone(task) {
  // console.log(task);
  for (let i = 0; i < done.length; i++) {
    if (done[i] === task) {
      done.splice(i, 1);
      break;
    }
  }
  localStorage.setItem("done", JSON.stringify(done));
}
