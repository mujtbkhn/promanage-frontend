import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BACKEND_URL = "http://localhost:3000/api/v1/auth";

export const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    return decoded;
  }
  return null;
};

export const getUserFromToken1 = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decoded = jwtDecode(token);
    return {
      userId: decoded.userId,
      name: decoded.name,
      email: decoded.email,
      // Add other fields as needed
    };
  }
  return null;
};

export const registerUser = async (name, email, password) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/register`, {
      name,
      email,
      password,
    });
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/login`, {
      email,
      password,
    });
    const { token } = response.data;
    localStorage.setItem("token", token);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

export const resetUser = async (
  email,
  currentPassword,
  newName,
  newPassword
) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${BACKEND_URL}/reset`,
      {
        email,
        currentPassword,
        newName,
        newPassword,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

export const addUserByEmail = async (email) => {
  const user = getUserFromToken1();
  console.log(user.userId);
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${BACKEND_URL}/add`,
      { email, userId: user.userId },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw error;
    }
  }
};

export const getUserByEmail = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${BACKEND_URL}/allowedEmails`, {
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
