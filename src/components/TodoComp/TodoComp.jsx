import React, { useState } from "react";
import "./TodoComp.css";
import PLUS from "../../images/plus_.png";
import COLLAPSE from "../../images/collapse.png";
import Todo from "../Todo/Todo";

const TodoComp = ({
  name,
  onPlusClick,
  todos,
  onMoveTask,
  onCheckboxChange,
  fetchTodos
}) => {
  const [collapseAll, setCollapseAll] = useState(false);

  const handleCollapseAllClick = () => {
    setCollapseAll((prev) => !prev);
  };
  return (
    <div className="todo__main">
      <div className="todo__top">
        <div>
          <h3>{name}</h3>
        </div>
        <div className="icons">
          <div className="plus" onClick={onPlusClick}>
            {name === "TODO" ? <img src={PLUS} alt="" /> : null}
          </div>
          <div className="collapse" onClick={handleCollapseAllClick}>
            <img src={COLLAPSE} alt="" />
          </div>
        </div>
      </div>
      <div className="todo__items">
        {todos?.map((todo) => (
          <div key={todo._id} className="todo__item">
            <Todo
              todo={todo}
              sectionName={name}
              onMoveTask={onMoveTask}
              collapseAll={collapseAll}
              onCheckboxChange={onCheckboxChange}
              fetchTodos={fetchTodos}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoComp;
