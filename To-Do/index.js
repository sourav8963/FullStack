const taskList = document.getElementById("taskList");

// Load tasks
window.onload = () => {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTask(task));
    updateProgress();
};

// Add Task
function addTask() {
    const text = document.getElementById("taskInput").value;
    const date = document.getElementById("dueDate").value;

    if (!text) return;

    const task = { text, date, completed: false };
    createTask(task);
    saveTasks();
    updateProgress();
}

// Create Task
function createTask(task) {
    const li = document.createElement("li");
    li.draggable = true;

    li.innerHTML = `
        <span>${task.text} (${task.date})</span>
        <button onclick="deleteTask(this)">❌</button>
    `;

    if (task.completed) li.classList.add("completed");

    li.onclick = () => {
        li.classList.toggle("completed");
        saveTasks();
        updateProgress();
    };

    // Drag events
    li.addEventListener("dragstart", () => li.classList.add("dragging"));
    li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
        saveTasks();
    });

    taskList.appendChild(li);
}

// Delete Task
function deleteTask(btn) {
    btn.parentElement.remove();
    saveTasks();
    updateProgress();
}

// Save Tasks
function saveTasks() {
    const tasks = [];
    document.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.firstChild.textContent.split(" (")[0],
            date: li.firstChild.textContent.split(" (")[1]?.replace(")", ""),
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Search
function searchTasks() {
    const value = document.getElementById("searchInput").value.toLowerCase();
    document.querySelectorAll("li").forEach(li => {
        li.style.display = li.textContent.toLowerCase().includes(value) ? "" : "none";
    });
}

// Progress Bar
function updateProgress() {
    const tasks = document.querySelectorAll("li");
    const completed = document.querySelectorAll(".completed").length;
    const percent = tasks.length ? (completed / tasks.length) * 100 : 0;

    document.getElementById("progressBar").style.width = percent + "%";
}

// Theme Toggle
function toggleTheme() {
    document.body.classList.toggle("light");
}

// Drag & Drop Sorting
taskList.addEventListener("dragover", e => {
    e.preventDefault();
    const dragging = document.querySelector(".dragging");
    const afterElement = getDragAfterElement(e.clientY);

    if (afterElement == null) {
        taskList.appendChild(dragging);
    } else {
        taskList.insertBefore(dragging, afterElement);
    }
});

function getDragAfterElement(y) {
    const elements = [...document.querySelectorAll("li:not(.dragging)")];

    return elements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}
