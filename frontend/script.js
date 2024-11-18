
const displayTodo = document.getElementById("todo-container");
const displayTask = document.getElementById("task-container");
const titleInput = document.getElementById("titleInput");
const taskInput = document.getElementById("taskInput");
const taskPopover = document.getElementById('task-popover'); 

//fetching todos from api
function getTodos() {
  axios.get("http://localhost:3000/todo")
    .then((res) => {
      //const todos = res.data.data;
      displayTodos(res.data.data);
    })
    .catch((error) => {
      console.error("Error fetching todos:", error);
    });
}

/*function saveToLocalStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}*/

//displaying the todos
function displayTodos(todos) {
  displayTodo.innerHTML = "";
  todos.forEach((todo) => {
    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title-div");

    
    const title = document.createElement("button");
    title.classList.add("actual-title");
    title.textContent = todo.title;
    titleDiv.appendChild(title);

  
    title.addEventListener("click", () => {
      taskInput.setAttribute("data-todo-id", todo.todoId);
      displayTasks(todo.todoId);

      taskPopover.style.display = "block";
      displayTodo.style.filter = "blur(5px)";  
    });

    const editIcon = document.createElement("img");
    editIcon.classList.add("editIcon");
    editIcon.src = "images/pen.png";
    editIcon.alt = "edit";
    titleDiv.appendChild(editIcon);

    editIcon.addEventListener("click", () => {
      const newTitle = prompt("Edit the title:", todo.title);
      if (newTitle && newTitle.trim() !== "") {
        axios.put(`http://localhost:3000/todo/${todo.todoId}`, { title: newTitle })
          .then(() => getTodos())
          .catch((error) => console.error("Error editing todo:", error));
      }
    });

   
    const deleteIcon = document.createElement("img");
    deleteIcon.classList.add("deleteIcon");
    deleteIcon.src = "images/delete.png";
    deleteIcon.alt = "delete";
    titleDiv.appendChild(deleteIcon);

    deleteIcon.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete this todo?")) {
        axios.delete(`http://localhost:3000/todo/${todo.todoId}`)
          .then(() => getTodos())
          .catch((error) => console.error("Error deleting todo:", error));
      }
    });

    displayTodo.appendChild(titleDiv);
  });
}

//adding a new title
function addTitleInput() {
  const newTitle = titleInput.value.trim(); 
  if (newTitle) {
    axios.post("http://localhost:3000/todo", { title: newTitle })
      .then(() => {
        getTodos(); 
        titleInput.value = ""; 
      })
      .catch((error) => console.error("Error adding todo:", error));
  } else {
    alert("Title cannot be empty!");
  }
}

//displaying the tasks and displaying updated tasks
function displayTasks(todoId) {
  axios.get(`http://localhost:3000/todo/${todoId}/tasks`)
    .then((res) => {
      const tasks = res.data.tasks;
      displayTask.innerHTML = "";

      tasks.forEach((task) => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        
        const checkBox = document.createElement("input");
        checkBox.type = "checkbox";
        checkBox.checked = task.completed;
        taskDiv.appendChild(checkBox);

        const taskElement = document.createElement("h4");
        taskElement.textContent = task.task;
        taskElement.classList.add("newTask");
        taskElement.style.textDecoration = task.completed ? "line-through" : "none";
        taskElement.style.textDecorationColor= "#fff";
        taskElement.style.textDecorationThickness="2px";
        taskDiv.appendChild(taskElement);

        checkBox.addEventListener("change", () => {
          task.completed = checkBox.checked;
          axios.put(`http://localhost:3000/todo/${todoId}/tasks/${task.taskId}`, { completed: task.completed })
            .then(() => displayTasks(todoId))
            .catch((error) => console.error("Error updating task:", error));
        });

        const editIcon = document.createElement("img");
        editIcon.classList.add("editIcon");
        editIcon.src = "images/pen.png";
        editIcon.alt = "edit";
        taskDiv.appendChild(editIcon);

        editIcon.addEventListener("click", () => {
          const newTask = prompt("Edit the task:", task.task);
          if (newTask && newTask.trim() !== "") {
            axios.put(`http://localhost:3000/todo/${todoId}/tasks/${task.taskId}`, { task: newTask })
              .then(() => displayTasks(todoId))
              .catch((error) => console.error("Error editing task:", error));
          }
        });

        const deleteIcon = document.createElement("img");
        deleteIcon.classList.add("deleteIcon");
        deleteIcon.src = "images/delete.png";
        deleteIcon.alt = "delete";
        taskDiv.appendChild(deleteIcon);

        deleteIcon.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this task?")) {
            axios.delete(`http://localhost:3000/todo/${todoId}/tasks/${task.taskId}`)
              .then(() => displayTasks(todoId))
              .catch((error) => console.error("Error deleting task:", error));
          }
        });

        displayTask.appendChild(taskDiv);
      });
    })
    .catch((error) => console.error("Error fetching tasks:", error));
}

//add a task in a todo
function addTaskInput() {
  const newTask = taskInput.value.trim();
  const todoId = taskInput.getAttribute("data-todo-id");

  if (newTask) {
    axios.post(`http://localhost:3000/todo/${todoId}/tasks`, { task: newTask, completed: false })
      .then(() => {
        displayTasks(todoId);
        taskInput.value = "";
      })
      .catch((error) => console.error("Error adding task:", error));
  } else {
    alert("Task cannot be empty");
  }
}

//title added when enter is pressed
document.getElementById('titleInput').addEventListener("keypress", titleKeyPressed);
function titleKeyPressed(press){
  if(press.code ==="Enter" ){
    addTitleInput();
    return false;
  }
}

//task added when enter key is pressed
document.getElementById('taskInput').addEventListener("keypress", taskKeyPressed);
function taskKeyPressed(k){
  if(k.code ==='Enter'){
    addTaskInput();
    return false;
  }
}


document.addEventListener("click", (event) => {
  if (!taskPopover.contains(event.target) && !event.target.classList.contains("actual-title")) {
    taskPopover.style.display = "none"; 
    displayTodo.style.filter = "none";  
  }
});


getTodos();
