import React, { useEffect, useState } from "react";
import { viewTodoById } from "../../apis/todo";
import LOGOO from "../../images/logoo.png";
import { format, parseISO } from "date-fns";
import "./ViewTodo.css";
import { useNavigate } from "react-router-dom";

const ViewTodo = ({ todoId }) => {
  const [todo, setTodo] = useState("");

  const navigate = useNavigate();

  const fetchTodoDetails = async () => {
    try {
      const response = await viewTodoById(todoId);
      const fetchedTodo = response; // Adjust according to your API response structure

      // console.log(fetchedTodo);
      setTodo(fetchedTodo);
    } catch (error) {
      console.error("Error fetching todo:", error);
    }
  };
  useEffect(() => {
    fetchTodoDetails();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return ""; // Handle case where dateString is undefined or null
    const date = parseISO(dateString);
    return format(date, "MMM do");
  };

  return (
    <>
      <div
        onClick={() => {
          navigate("/");
        }}
        className="logo"
      >
        <img src={LOGOO} alt="" />
        <h1>Pro Manage</h1>
      </div>
      <div className="main__todo">
        <div className="todo_main_view">
          <div className="todo_priority common">
            <p>
              <span
                className={`priority__dot ${
                  todo?.priority === "HIGH"
                    ? "high"
                    : todo?.priority === "MODERATE"
                    ? "moderate"
                    : "low"
                }`}
              ></span>
              {todo?.priority?.toUpperCase()} PRIORITY
            </p>
          </div>
          <div className="todo_heading">
            <h2>
              <strong>{todo?.title}</strong>
            </h2>
          </div>
          <div className="todo_checklist common">
            <div>
              <h4>
                Checklist (
                {todo?.checklist?.filter((item) => item?.completed).length}/
                {todo?.checklist?.length})
              </h4>
            </div>
            <div style={{ cursor: "pointer" }}></div>
          </div>
          <ul style={{ margin: "0 auto" }}>
            {todo.checklist?.map((item, index) => (
              <div key={index} className="checklist__item">
                <input
                  type="checkbox"
                  checked={item.completed}
                  className="checklist__checkbox"
                />
                <input
                  type="text"
                  value={item.item}
                  className="checklist__input"
                />
              </div>
            ))}
          </ul>
          {todo.dueDate && (
            <div
              style={{
                display: "flex",
                justifyContent: "start",
                alignItems: "center",
              }}
            >
              <h5>DUE DATE</h5>
              <button
                className="dueDate__button"
              >
                {formatDate(todo?.dueDate)}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewTodo;
