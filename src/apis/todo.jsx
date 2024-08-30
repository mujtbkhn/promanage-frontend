import axios from "axios";

const BACKEND_URL = "https://promanage-backend-xwqo.onrender.com/api/v1/todo";
// const BACKEND_URL = "http://localhost:3000/api/v1/todo";

const token = localStorage.getItem("token");

export const getAnalytics = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/analytics`, {
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

export const getCreateTodo = async (todoData) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/create`, todoData, {
      headers: {
        Authorization: `${token}`,
      },
    });
    // console.log("Response from create todo:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in getCreateTodo:", error.response?.data || error.message);
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
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const viewTodoById = async (todoId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/view/${todoId}`);
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
    // console.log(response.data);
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
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateChecklistItem = async (todoId, itemIndex, completed) => {
  try {
    const response = await axios.patch(
      `${BACKEND_URL}/checklist/${todoId}/${itemIndex}`,
      { completed },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
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
    return response.data;
  } catch (error) {
    throw error;
  }
};
