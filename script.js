document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.querySelector(".add-task-btn");
    const addTaskForm = document.querySelector(".add-task");
    const shadowEffect = document.querySelector(".shadow-effect");
    const addBtn = document.querySelector(".add-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const taskInput = document.querySelector("#task-input");
    const list = document.querySelector('#list');
    const bgAnimation = document.getElementById('bgAnimation');
    const numberOfColorBoxes = 400;

    /** Function to handle event listeners */
    const addEventListeners = () => {
        addTaskBtn.addEventListener("click", toggleAddTaskForm);
        shadowEffect.addEventListener("click", toggleAddTaskForm);
        cancelBtn.addEventListener("click", cancelForm);
        addBtn.addEventListener("click", onAddTaskClick);
    };

    const toggleAddTaskForm = () => {
        addTaskForm.classList.toggle("active");
        shadowEffect.classList.toggle("active");
        addTaskBtn.classList.toggle("active");

        if (addTaskForm.classList.contains("active")) {
            resetForm();
        }
    };

    const resetForm = () => {
        taskInput.value = "";
    };

    const cancelForm = () => {
        toggleAddTaskForm();
    };

    const onAddTaskClick = () => {
        const task = taskInput.value;

        if(task === "") {
            alert("Please enter a task!");
        } else {
            addTaskToList(task);
            toggleAddTaskForm();
            updateTaskCount();
            saveTasksToLocalStorage();
        }
    };

    const updateTaskCount = () => {
        const taskCount = document.querySelectorAll('#list li').length;
        const countValueElement = document.querySelector('.count-value');
        countValueElement.textContent = taskCount;
        const wrapper = document.querySelector('.wrapper');

        if (taskCount === 0) {
            wrapper.style.backgroundImage = 'url("images/clapping-removebg-preview.png")';
            wrapper.style.backgroundRepeat = 'no-repeat';
            wrapper.style.backgroundPosition = 'bottom';
        } else {
            wrapper.style.backgroundImage = 'none';
        }
    };

    const toggleEditMode = (listTasks) => {
        const taskText = listTasks.querySelector('p');
        const originalText = taskText.textContent;
        taskText.contentEditable = true;
        taskText.focus();

        /**Select all text in the contentEditable field*/
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(taskText);
        selection.removeAllRanges();
        selection.addRange(range);

        //Move cursor to the end of the text
        range.collapse(false); 

        taskText.classList.add("edit-mode");

        const saveEdit = (event) => {
            if (event.key === "Enter") {
                event.preventDefault();

                taskText.contentEditable = false;
                taskText.classList.remove("edit-mode");

                const newTask = taskText.textContent.trim();

                if (newTask !== "") {
                    taskText.textContent = newTask;
                    saveTasksToLocalStorage();
                } else {
                    taskText.textContent = originalText;
                }
            }
        };
        taskText.addEventListener("keydown", saveEdit);
    };

    const loadTasksFromLocalStorage = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTaskToList(task.task, task.checked);
        });
        updateTaskCount();
    };
    
    const saveTasksToLocalStorage = () => {
        const tasks = [];
        document.querySelectorAll('#list li').forEach(listTasks => {
            tasks.push({
                task: listTasks.querySelector('p').textContent,
                checked: listTasks.querySelector('input[type="checkbox"]').checked
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };
    
    const addTaskToList = (task, checked = false) => {
        let listTasks = document.createElement("li");
        listTasks.innerHTML = `<div class="task-wrapper">
            <label class="task"> <input type="checkbox" name="checkbox" ${checked ? 'checked' : ''}>
                <span class="checkmark"><i class="fa-solid fa-check"></i></span>
                <p>${task}</p> </label>
            <div class="edit">
                <i id="edit" class="fa-solid fa-pen-to-square"></i></div>
            <div class="delete">
                <i id="delete" class="fa-solid fa-trash"></i></div>
            </div>`;
    
        listTasks.querySelector(".delete").addEventListener("click", () => {
            listTasks.remove();
            updateTaskCount();
            saveTasksToLocalStorage();
        });
    
        listTasks.querySelector(".edit").addEventListener("click", () => {
            toggleEditMode(listTasks);
        });
    
        list.appendChild(listTasks);
    
        // Set the checked state of the checkbox
        listTasks.querySelector('input[type="checkbox"]').checked = checked;
    };

    // Call the function to set up event listeners 
    addEventListeners();

    // Load tasks from local storage when the page loads
    loadTasksFromLocalStorage();

    /** Adding animations on CSS */
    for (let i = 0; i < numberOfColorBoxes; i++) {
        const colorBox = document.createElement('div');
        colorBox.classList.add('colorBox');
        bgAnimation.append(colorBox);
    }
});