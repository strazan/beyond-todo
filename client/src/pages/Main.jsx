import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  getTasks,
  deleteTask,
  editTask,
  addTask,
} from "../services/useTasksApi";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const param = useParams();
  const username = param.user;
  const [editingTask, setEditingTask] = useState(false);
  const [editTaskIndex, setEditTaskIndex] = useState(null);
  const taskInput = useRef();

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    getTasks(setTasks);
  }
  function addLocalTask() {
    if (taskInput.current.value) {
      const newTask = taskInput.current.value.trim();
      addTask(newTask, fetchTasks);
      taskInput.current.value = "";
    }
  }

  function handleEditTask(index) {
    taskInput.current.value = tasks[index].task;
  }

  function deleteLocalTask(index) {
    deleteTask(tasks[index], fetchTasks);
  }
  function editLocalTask() {
    setEditingTask((prev) => !prev);
    const editedTask = taskInput.current.value;
    editTask(tasks[editTaskIndex].task_id, fetchTasks, editedTask);
  }

  async function handleLogout() {
    const url = "http://localhost:3000/logout";

    try {
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        console.log("res STATUS: " + res.status);
        navigate("/");
      } else {
        alert("Failed to logout");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white text-black p-8 rounded-lg text-center shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">
        Hello {username}, you have {tasks.length}{" "}
        {tasks.length === 1 ? "task" : "tasks"}
      </h2>
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-4 py-2 mt-2 bg-gray-200 rounded-lg focus:ring-violet-500 focus:border-violet-500"
          placeholder="Enter your todo"
          ref={taskInput}
        />
      </div>
      <div>
        {editingTask ? (
          <button
            onClick={editLocalTask}
            className="w-full py-2 mb-4 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-lg shadow-lg"
          >
            UPDATE TODO
          </button>
        ) : (
          <button
            onClick={addLocalTask}
            className="w-full py-2 mb-4 bg-pink-500 hover:bg-pink-400 text-white font-semibold rounded-lg shadow-lg"
          >
            ADD TODO
          </button>
        )}
      </div>
      <ul className="text-left">
        {tasks
          ? tasks.map((task, index) => (
              <li
                key={index}
                className="flex justify-between items-center py-2 border-b border-gray-200"
              >
                <span>{task.task}</span>
                <div>
                  <button
                    onClick={() => {
                      handleEditTask(index);
                      setEditingTask((prev) => !prev);
                      setEditTaskIndex(index);
                    }}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteLocalTask(index)}
                    className="text-pink-500 hover:text-pink-700 mr-2"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))
          : ""}
      </ul>
      <button
        onClick={handleLogout}
        className="w-full py-2 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg shadow-lg"
      >
        LOG OUT
      </button>
    </div>
  );
}
