import React, { useState } from 'react';
import './dashboard.css';
import { apiRequest } from './Api';

export const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskStatus, setTaskStatus] = useState("In Progress");
  const [searchQuery, setSearchQuery] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
   const [createdBy, setCreatedBy] = useState("");


  const handleAddTask = async () => {
    if (taskName.trim() === "" || taskDescription.trim() === "" || taskDueDate === "") {
      alert("Please enter task name, description, and due date.");
      return;
    }

    if (editTaskId) {
      const updatedTask = {
        name: taskName,
        description: taskDescription,
        dueDate: taskDueDate,
        status: taskStatus,
        createdBy: createdBy,
      };
      
      try {
        const response = await fetch(`http://localhost:5000/tasks/${editTaskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        });

        const result = await response.json();

        if (response.ok) {
         const updatedTaskWithTimestamp = {
            ...updatedTask,
            id: editTaskId,
            lastUpdated: result.last_updated,
            createdBy: result.created_by
          };
          setTasks(tasks.map(task => task.id === editTaskId ? updatedTaskWithTimestamp : task));
         
          resetForm();
        } else {
          alert("Failed to update task.");
        }
      } catch (error) {
        console.error("Error updating task:", error);
        alert("Error occurred while updating.");
      }

      return;
    }

    // Adding a new task
    const newTask = {
      name: taskName,
      description: taskDescription,
      dueDate: taskDueDate,
      status: taskStatus,
      createdBy: createdBy
    };
    console.log("Adding task:", newTask);
    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      const data = await response.json();

      if (response.ok) {
        const taskWithId = {
          id: data.id,
          name:taskName,
          description: taskDescription,
          dueDate: taskDueDate,
          status: taskStatus,
          createdBy: createdBy,
           lastUpdated: data.last_updated 
          };
        setTasks([...tasks, taskWithId]);
        resetForm();
      } else {
        alert("Failed to add task. Please try again.");
      }

    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task. Please try again.");
      apiRequest("/tasks", "POST", newTask);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        setTasks(tasks.filter(task => task.id !== id));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task. Please try again.");
    }

    setTasks(tasks.filter(task => task.id !== id));
  };

  const handleEditTask = (task) => {
    setTaskName(task.name);
    setTaskDescription(task.description);
    const formattedDueDate = new Date(task.dueDate).toISOString().split('T')[0];
    setTaskDueDate(formattedDueDate);
    setTaskStatus(task.status);
    setCreatedBy(task.createdBy || "");
    setEditTaskId(task.id);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.length >= 2) {
      try {
        const response = await fetch(`http://localhost:5000/search?q=${query}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          const formattedData = data.map(task => ({
            id: task.id,
            name: task.title,
            description: task.description,
            dueDate: task.due_date,
            status: task.status === "in-progress" ? "In Progress" : "Completed",
            createdBy: task.created_by,
            lastUpdated: task.last_updated
          }));
          setTasks(formattedData);
        } else {
          console.error("Unexpected response format:", data);
          setTasks([]);
        }
      } catch (error) {
        console.error("Error searching tasks:", error);
        setTasks([]);
      }
    } else {
      setTasks([]);
    }
  };

  const resetForm = () => {
    setTaskName("");
    setTaskDescription("");
    setTaskDueDate("");
    setTaskStatus("In Progress");
    setEditTaskId(null);
  };

  const filteredTasks = tasks;

  const handleStatusChange = async (taskId, newStatus) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;

    const updatedTask = {
      name: taskToUpdate.name,
      description: taskToUpdate.description,
      dueDate: taskToUpdate.dueDate,
      status: newStatus,
      lastUpdated: new Date().toISOString()
    };
    
  try {
    const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    });

    const result = await response.json();

      if (response.ok) {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, lastUpdated: result.last_updated }
          : task
      ));
    } else {
      alert("Failed to update status.");
    }
  } catch (error) {
    console.error("Error updating status:", error);
  }
};

  return (
    <div className="dashboard-container">
      <h1>Task Dashboard</h1>

      <div className="search-bar">
        <input
          type="text"
          id='search'
          placeholder="Search by name or description..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="add-task-form">
        <input
        type="text"
        id="createdBy"
        placeholder="Created By"
        value={createdBy}
         onChange={(e) => setCreatedBy(e.target.value)}
        />
        <input
          type="text"
          id='taskName'
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input
          type="text"
          id='taskDescription'
          placeholder="Task Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
        />
        <input
          type="date"
          id='taskDueDate'
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
        />
        <select
          value={taskStatus}
          id='taskStatus'
          className="task-status-select"
          onChange={(e) => setTaskStatus(e.target.value)}
        >
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <button onClick={handleAddTask} className="add-task-button">
          {editTaskId ? "Update Task" : "Add Task"}
        </button>
        {editTaskId && (
          <button onClick={resetForm} className="cancel-edit-button">
            Cancel Edit
          </button>
        )}
      </div>

      {Array.isArray(filteredTasks) && filteredTasks.length === 0 ? (
        <p className="no-tasks">No tasks found.</p>
      ) : (
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Created By</th>
              <th>Name</th>
              <th>Description</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task, index) => (
              <tr key={index} className={task.status === "Completed" ? "task-complete" : ""}>
                <td>{task.createdBy}</td>
                <td>{task.name}</td>
                <td>{task.description}</td>
                <td>{task.dueDate}</td>
                <td>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>{task.lastUpdated ? new Date(task.lastUpdated).toLocaleString() : "-"}</td>
                <td>
                  <button className="edit-task-button" onClick={() => handleEditTask(task)}>Update</button>
                  <button className="delete-task-button" onClick={() => handleDeleteTask(task.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
