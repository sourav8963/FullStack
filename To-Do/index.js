const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

// Load saved tasks
window.onload = function () {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTaskElement(task.text, task.completed));
};

function addTask() {
    const text = taskInput.value.trim();
    if (text === "") return;

    createTaskElement(text, false);
    saveTasks();
    taskInput.value = "";
}

function createTaskElement(text, completed) {
    const li = document.createElement("li");
    li.textContent = text;

    if (completed) li.classList.add("completed");

    // Toggle complete
    li.onclick = function () {
        li.classList.toggle("completed");
        saveTasks();
    };

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "❌";
    delBtn.onclick = function (e) {
        e.stopPropagation();
        li.remove();
        saveTasks();
    };

    li.appendChild(delBtn);
    taskList.appendChild(li);
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.firstChild.textContent,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
