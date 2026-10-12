
const input = document.querySelector(".add-list-text");
const buttonAdd = document.querySelector(".button-add");
const taskList = document.querySelector(".view-exercises");

const buttonAll = document.querySelector(".button-all");
const buttonActivity = document.querySelector(".button-activity");
const buttonCompleted = document.querySelector(".button-completed");

const totalCount = document.querySelector(".total-count");
const completedCount = document.querySelector(".completed-count");
const activeCount = document.querySelector(".active-count");

// Загружаем задачи из localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Текущий фильтр
let currentFilter = "all";

// Сохраняем задачи в браузере
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Создаём карточку задачи
function createTask(task, index) {
    const taskElement = document.createElement("div");
    taskElement.className = "task-item";

    // Чекбокс
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    // Текст задачи
    const taskLabel = document.createElement("span");
    taskLabel.textContent = task.text;

    if (task.completed) {
        taskLabel.style.textDecoration = "line-through";
    }

    // Кнопка удаления
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️";

    // Изменение статуса задачи
    checkbox.addEventListener("change", function() {
        task.completed = checkbox.checked;

        saveTasks();
        renderTasks();
    });

    // Удаление задачи
    deleteButton.addEventListener("click", function() {
        tasks.splice(index, 1);

        saveTasks();
        renderTasks();
    });

    taskElement.appendChild(checkbox);
    taskElement.appendChild(taskLabel);
    taskElement.appendChild(deleteButton);

    return taskElement;
}

// Показываем задачи и обновляем счётчики
function renderTasks() {
    taskList.innerHTML = "";

    tasks.forEach(function(task, index) {
        if (currentFilter === "active" && task.completed) {
            return;
        }

        if (currentFilter === "completed" && !task.completed) {
            return;
        }

        const taskElement = createTask(task, index);
        taskList.appendChild(taskElement);
    });

    // Счётчики учитывают ВСЕ задачи,
    // даже скрытые фильтром
    const completed = tasks.filter(function(task) {
        return task.completed;
    }).length;

    totalCount.textContent = tasks.length;
    completedCount.textContent = completed;
    activeCount.textContent = tasks.length - completed;
}

// Добавление задачи
buttonAdd.addEventListener("click", function() {
    const taskText = input.value.trim();

    if (taskText === "") {
        return;
    }

    tasks.push({
        text: taskText,
        completed: false
    });

    input.value = "";

    saveTasks();
    renderTasks();
});

// Добавление по Enter
input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        buttonAdd.click();
    }
});

// Фильтр «Все»
buttonAll.addEventListener("click", function() {
    currentFilter = "all";
    renderTasks();
});

// Фильтр «Активные»
buttonActivity.addEventListener("click", function() {
    currentFilter = "active";
    renderTasks();
});

// Фильтр «Выполненные»
buttonCompleted.addEventListener("click", function() {
    currentFilter = "completed";
    renderTasks();
});

// Загружаем задачи при открытии страницы
renderTasks();
