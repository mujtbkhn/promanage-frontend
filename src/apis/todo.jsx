import axios from "axios";

const BACKEND_URL = "https://promanage-backend-xwqo.onrender.com/api/v1/todo";

const token = localStorage.getItem("token");

export const logTodo = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/logTodo`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to log todo:", error);
  }
};

export const getAnalytics = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/analytics`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

export const getCreateTodo = async (
  title,
  priority,
  assignedTo,
  checklist,
  dueDate,
  section
) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/create`,
      {
        title,
        priority,
        assignedTo,
        checklist,
        dueDate,
        section,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTodoById = async (todoId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/get/${todoId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTodos = async (filter) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/getAll?filter=${filter}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateTodo = async (todoId, updatedTodo) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/edit/${todoId}`,
      updatedTodo,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    console.log("Todo updated successfully:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const moveTask = async (todoId, section) => {
  try {
    const response = await axios.patch(
      `${BACKEND_URL}/move/${todoId}`,
      { section },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    console.log("Task moved successfully:", response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTodoById = async (todoId) => {
  try {
    const response = await axios.delete(`${BACKEND_URL}/delete/${todoId}`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    // console.log(response.data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
