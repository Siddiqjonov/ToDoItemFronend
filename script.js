const BASE_URL = "http://192.168.16.59:5000";  // Make sure this is updated when deploying

async function addToDoItem() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('dueDate').value;

    if (!title || !description || !dueDate) {
        document.getElementById('responseMessage').innerText = 'Please fill in all fields.';
        return;
    }

    const toDoItem = {
        title: title,
        description: description,
        dueDate: dueDate
    };

    try {
        showLoadingSpinner();
        const response = await fetch( BASE_URL + '/api/toDoItem/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin' : 'https://siddiqjonov.github.io'
            },
            body: JSON.stringify(toDoItem)
        });

        if (response.ok) {
            document.getElementById('responseMessage').innerText = 'Task added successfully!';
            showToast('Task added successfully!');
            clearAddForm();
            await fetchTasks();
            const newTask = allTasks[allTasks.length - 1];
            if (newTask) {
                autoFillUpdateForm(newTask);
            }
        } else {
            const errorText = await response.text();
            document.getElementById('responseMessage').innerText = `Failed to add task: ${errorText}`;
            showToast('Failed to add task: ' + errorText, 'error');
        }
    } catch (error) {
        document.getElementById('responseMessage').innerText = 'Error: ' + error.message;
        showToast('Error adding task: ' + error.message, 'error');
    } finally {
        hideLoadingSpinner();
    }
}

async function fetchTasks() {
    take = parseInt(document.getElementById('take').value) || 5;
    try {
        showLoadingSpinner();
        const response = await fetch( BASE_URL + `/api/toDoItem/getAll?skip=${skip}&take=${take}`);
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        
        allTasks = data.items || data;
        totalItems = data.totalCount || allTasks.length;

        filterTasks();
        updatePagination();
    } catch (error) {
        document.getElementById('taskList').innerHTML = `<p>Error: ${error.message}</p>`;
        showToast('Error fetching tasks: ' + error.message, 'error');
    } finally {
        hideLoadingSpinner();
    }
}
