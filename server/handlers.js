const pool = require("./db");

// *************************-TASKS-**************************

// Get all the tasks for a user
async function getTasks(user_id) {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM tasks
      INNER JOIN users ON tasks.user_id = users.user_id
      WHERE users.user_id = $1
      AND tasks.task_completed = '0'
      ORDER BY tasks.task_id;
      `,
      [user_id]
    );
    return result.rows;
  } catch (error) {
    console.error("Error executing query in getTask:", error);
    throw error;
  }
}

async function createTask(user_id, task) {
  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, task) VALUES ($1, $2)`,
      [user_id, task]
    );
    return result;
  } catch (error) {
    console.error("Error executing query in createTask:", error);
    throw error;
  }
}

async function editTask(task, task_id) {
  try {
    const result = await pool.query(
      `UPDATE tasks
         SET task = ($1)
         WHERE task_id = ($2)`,
      [task, task_id]
    );
    return result;
  } catch (error) {
    console.error("Error executing query in editTask:", error);
    throw error;
  }
}

async function deleteTask(task_id) {
  try {
    const result = await pool.query(
      `UPDATE tasks SET task_completed = B'1' WHERE task_id = $1`, // Use binary string B'1' to represent true for BIT column
      [task_id]
    );
    return result;
  } catch (error) {
    console.error("Error executing query in deleteTask:", error.message); // Log specific error message
    throw error;
  }
}

// *************************-USERS-**************************

// Returns an object of the user row
async function findUserByUsername(username) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows[0]; // Assuming there's only one user with the provided username
  } catch (error) {
    console.error("Error executing query in findUseByUsername:", error);
    throw error;
  }
}

// Creates a new user
async function addUser(user) {
  try {
    const { user_id, username, hashedPassword } = user;
    const result = await pool.query(
      `INSERT INTO users (user_id, username, password) 
          VALUES ($1, $2, $3)`,
      [user_id, username, hashedPassword]
    );
    return user;
  } catch (error) {
    console.error("Error executing query in addUser", error);
    throw error;
  }
}

module.exports = {
  // createTask,
  findUserByUsername,
  addUser,
  getTasks,
  createTask,
  deleteTask,
  editTask,
};
