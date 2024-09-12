document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todo-input');
    const addTodoButton = document.getElementById('add-todo');
    const todoList = document.getElementById('todo-list');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''} priority-${todo.priority}`;
            li.innerHTML = `
                <input type="checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <input type="text" class="edit-input" value="${todo.text}">
                <div class="todo-details">
                    <input type="time" class="time-start" value="${todo.startTime || ''}">
                    <input type="time" class="time-end" value="${todo.endTime || ''}">
                    <select class="priority-select">
                        <option value="low" ${todo.priority === 'low' ? 'selected' : ''}>Low</option>
                        <option value="medium" ${todo.priority === 'medium' ? 'selected' : ''}>Medium</option>
                        <option value="high" ${todo.priority === 'high' ? 'selected' : ''}>High</option>
                    </select>
                </div>
                <div class="todo-actions">
                    <button class="edit-todo">Edit</button>
                    <button class="delete-todo">Delete</button>
                </div>
            `;

            const checkbox = li.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => toggleTodo(index));

            const todoText = li.querySelector('.todo-text');
            todoText.addEventListener('click', () => editTodo(index));

            const editInput = li.querySelector('.edit-input');
            editInput.addEventListener('blur', () => finishEditing(index));
            editInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    finishEditing(index);
                }
            });

            const timeStart = li.querySelector('.time-start');
            timeStart.addEventListener('change', (e) => updateTodoProperty(index, 'startTime', e.target.value));

            const timeEnd = li.querySelector('.time-end');
            timeEnd.addEventListener('change', (e) => updateTodoProperty(index, 'endTime', e.target.value));

            const prioritySelect = li.querySelector('.priority-select');
            prioritySelect.addEventListener('change', (e) => updateTodoProperty(index, 'priority', e.target.value));

            const deleteButton = li.querySelector('.delete-todo');
            deleteButton.addEventListener('click', () => deleteTodo(index));

            todoList.appendChild(li);
        });
        saveTodos();
    }

    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            todos.push({
                text,
                completed: false,
                startTime: '',
                endTime: '',
                priority: 'medium'
            });
            todoInput.value = '';
            renderTodos();
        }
    }

    function toggleTodo(index) {
        todos[index].completed = !todos[index].completed;
        renderTodos();
    }

    function editTodo(index) {
        const li = todoList.children[index];
        li.classList.add('editing');
        const editInput = li.querySelector('.edit-input');
        editInput.style.display = 'block';
        editInput.focus();
        editInput.setSelectionRange(editInput.value.length, editInput.value.length);
    }

    function finishEditing(index) {
        const li = todoList.children[index];
        const editInput = li.querySelector('.edit-input');
        const newText = editInput.value.trim();
        
        if (newText && newText !== todos[index].text) {
            todos[index].text = newText;
            renderTodos();
        } else {
            li.classList.remove('editing');
            editInput.style.display = 'none';
        }
    }

    function updateTodoProperty(index, property, value) {
        todos[index][property] = value;
        saveTodos();
    }

    function deleteTodo(index) {
        todos.splice(index, 1);
        renderTodos();
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    addTodoButton.addEventListener('click', addTodo);

    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    renderTodos();
});