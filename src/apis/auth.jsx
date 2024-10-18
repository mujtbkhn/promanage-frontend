import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const BACKEND_URL = "https://promanage-backend-xwqo.onrender.com/api/v1/auth";
// const BACKEND_URL = "http://localhost:3000/api/v1/auth";

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
    };
  }
  return null;
};

export const registerUser = async (name, email, password) => {
  return toast.promise(
    new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(`${BACKEND_URL}/register`, {
          name,
          email,
          password,
        });
        const { token } = response.data;
        localStorage.setItem("token", token);
        resolve(response.data);
      } catch (error) {
        if (error.response) {
          reject(error.response.data);
        } else {
          reject(error);
        }
      }
    }),
    {
      loading: 'Registering... This may take up to 50 seconds if the server was inactive.',
      success: 'Registration successful!',
      error: (err) => `Registration failed: ${err.message || 'Please try again.'}`,
    }
  );
};

export const loginUser = async (email, password) => {
  return toast.promise(
    new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(`${BACKEND_URL}/login`, {
          email,
          password,
        });
        const { token } = response.data;
        localStorage.setItem("token", token);
        resolve(response.data);
      } catch (error) {
        if (error.response) {
          reject(error.response.data);
        } else {
          reject(error);
        }
      }
    }),
    {
      loading: 'Logging in... This may take up to 50 seconds if the server was inactive.',
      success: 'Login successful!',
      error: (err) => `Login failed: ${err.message || 'Please try again.'}`,
    }
  );
};

export const resetUser = async (
  newName,
  currentPassword,
  newPassword,
  newEmail
) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      `${BACKEND_URL}/reset`,
      {
        newName,
        currentPassword,
        newPassword,
        newEmail,
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
    return response.data;
  } catch (error) {
    throw error;
  }
};
