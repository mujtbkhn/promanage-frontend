// Board Component
import React, { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import TodoComp from "../../components/TodoComp/TodoComp";
import Delete from "../../images/Delete.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tooltip } from "react-tooltip";
import "./Board.css";
import {
  addUserByEmail,
  getUserByEmail,
  getUserFromToken,
} from "../../apis/auth";
import { getCreateTodo, getTodos, moveTask, updateTodo } from "../../apis/todo";

const Board = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [checklist, setChecklist] = useState([{ item: "", completed: false }]);
  const [dueDate, setDueDate] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [todos, setTodos] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("week"); // State for selected filter
  const [formErrors, setFormErrors] = useState({});
  const [openAddPeopleModal, setOpenAddPeopleModal] = useState(false); // State for Add People modal
  const [addPeople, setAddPeople] = useState("");
  const [allowedEmails, setAllowedEmails] = useState(null);
  const [isEmailListVisible, setIsEmailListVisible] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = await getUserFromToken();
      setUserDetails(user);
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {}, []);

  useEffect(() => {
    fetchTodos(selectedFilter); // Fetch todos initially with default filter "today"
  }, [selectedFilter]);

  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    allowed();
  }, []);

  const allowed = async () => {
    try {
      const data = await getUserByEmail();
      setAllowedEmails(data.allowedEmails);
    } catch (error) {
      console.error("Error Fetching Allowed Emails", error);
    }
  };

  const fetchTodos = async (filter) => {
    try {
      const data = await getTodos(filter);
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value); // Update selected filter on change
  };

  const handleInputFocus = () => {
    setIsEmailListVisible(true);
  };

  const handleInputBlur = () => {
    setTimeout(() => setIsEmailListVisible(false), 200); // Delay to allow click on Assign button
  };

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false);
    resetFormFields();
  };

  const handleOpenAddPeopleModal = () => {
    setOpenAddPeopleModal(true);
  };

  const handleCloseAddPeopleModal = () => {
    setOpenAddPeopleModal(false);
  };

  const resetFormFields = () => {
    setTitle("");
    setSelectedPriority("");
    setAssignedTo("");
    setChecklist([{ item: "", completed: false }]);
    setDueDate(null);
  };

  const handleAddChecklistItem = () => {
    setChecklist([...checklist, { item: "", completed: false }]);
  };

  const handleChecklistChange = (index, value) => {
    const newChecklist = [...checklist];
    newChecklist[index].item = value;
    setChecklist(newChecklist);
  };

  const handleRemoveChecklistItem = (index) => {
    if (checklist.length > 1) {
      const newChecklist = checklist.filter((_, i) => i !== index);
      setChecklist(newChecklist);
    }
  };
  const handlePriorityClick = (priority) => {
    setSelectedPriority(priority);
  };

  const updateTodoBackend = async (todoId, updatedTodo) => {
    try {
      await updateTodo(todoId, updatedTodo); // Utilize your existing updateTodo API function
      console.log("Todo updated successfully in backend");
      fetchTodos(); // Refresh todos after updating
    } catch (error) {
      console.error("Error updating todo in backend:", error);
    }
  };

  const handleCheckboxChange = (index) => {
    const newChecklist = [...checklist]; // Copy checklist array
    newChecklist[index] = {
      ...newChecklist[index],
      completed: !newChecklist[index].completed, // Toggle completed status
    };
    setChecklist(newChecklist); // Update checklist state

    // Check if any item is completed to update todo in backend
    const completedItem = newChecklist[index];
    if (completedItem.completed) {
      const updatedTodo = todos.find((todo) =>
        todo.checklist.some((item) => item.item === completedItem.item)
      );
      if (updatedTodo) {
        updateTodoBackend(updatedTodo._id, {
          ...updatedTodo,
          checklist: updatedTodo.checklist.map((item) =>
            item.item === completedItem.item
              ? { ...item, completed: true }
              : item
          ),
        });
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!title.trim()) {
      errors.title = "Title is required";
    }
    if (!selectedPriority) {
      errors.priority = "Priority must be selected";
    }
    if (!checklist.some((item) => item.item?.trim())) {
      errors.checklist = "At least one checklist item is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveTodo = async () => {
    try {
      if (!validateForm()) {
        return;
      }
      const response = await getCreateTodo(
        title,
        selectedPriority,
        assignedTo,
        checklist,
        dueDate,
        "TODO"
      );
      console.log("Todo created successfully:", response);
      onCloseModal();
      fetchTodos(); // Refresh the todos after adding a new one
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleMoveTask = async (todoId, section) => {
    try {
      await moveTask(todoId, section); // Use moveTask instead of updateTodo
      fetchTodos(); // Refresh todos after moving
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  const handleAddPeople = async (email) => {
    try {
      await addUserByEmail(email); // Ensure addUserByEmail is correctly defined and used here
      await getUserByEmail();
      console.log("Email added successfully");
      setAddedEmail(email);
      handleCloseAddPeopleModal();
    } catch (error) {
      console.error("Error adding people", error);
    }
  };

  const checkedCount = checklist.filter((item) => item.completed).length;

  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const daySuffix = getDaySuffix(day);
    return `${day}${daySuffix} ${month}, ${year}`;
  };

  const date = formatDate(new Date());

  const handleAssignEmail = (email) => {
    4;
    if (allowedEmails) {
      console.log("Assigned to:", email); // Confirm email is correctly assigned
      setAssignedTo(email);
      setIsEmailListVisible(false); // Close email list after assignment
    }
  };

  console.log(userDetails);

  return (
    <div className="board__top">
      <div className="top__heading">
        <h2>Welcome ! {userDetails?.name}</h2>
        <p>{date}</p>
      </div>
      <div className="top__heading">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1>Board</h1>
          <img
            width="20"
            height="20"
            src="https://img.icons8.com/ios/20/1A1A1A/conference-call--v1.png"
            style={{ marginLeft: "10px" }}
            alt="conference-call--v1"
          />
          <p style={{ cursor: "pointer" }} onClick={handleOpenAddPeopleModal}>
            Add People
          </p>
        </div>
        <div>
          <select
            value={selectedFilter}
            onChange={(e) => handleFilterChange(e)}
            name=""
            id=""
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
      <div className="board__main">
        <TodoComp
          name="BACKLOG"
          todos={todos.filter((todo) => todo.section === "BACKLOG")}
          onMoveTask={handleMoveTask}
        />
        <TodoComp
          name="TODO"
          onPlusClick={() => onOpenModal("Plus clicked in To do")}
          todos={todos.filter((todo) => todo.section === "TODO")}
          onMoveTask={handleMoveTask}
        />
        <TodoComp
          name="IN PROGRESS"
          todos={todos.filter((todo) => todo.section === "IN PROGRESS")}
          onMoveTask={handleMoveTask}
        />
        <TodoComp
          name="DONE"
          todos={todos.filter((todo) => todo.section === "DONE")}
          onMoveTask={handleMoveTask}
        />
      </div>
      <Modal
        open={open}
        onClose={onCloseModal}
        center
        showCloseIcon={false}
        classNames={{ modal: "custom-modal" }}
      >
        <div className="modal__content">
          <div className="modal__section">
            <h3>
              Title <span style={{ color: "red" }}>*</span>
            </h3>
            <input
              type="text"
              placeholder="Enter Task Title"
              className="modal__input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {formErrors.title && <p className="error">{formErrors.title}</p>}
          </div>
          <div className="modal__section">
            <div className="priority__buttons">
              <h3>
                Select Priority<span style={{ color: "red" }}>*</span>
              </h3>
              <div
                className={`priority__button ${
                  selectedPriority === "HIGH" ? "selected" : ""
                }`}
                onClick={() => handlePriorityClick("HIGH")}
              >
                <span className="priority__dot high" /> High Priority
              </div>
              <div
                className={`priority__button ${
                  selectedPriority === "MODERATE" ? "selected" : ""
                }`}
                onClick={() => handlePriorityClick("MODERATE")}
              >
                <span className="priority__dot moderate" /> Moderate Priority
              </div>
              <div
                className={`priority__button ${
                  selectedPriority === "LOW" ? "selected" : ""
                }`}
                onClick={() => handlePriorityClick("LOW")}
              >
                <span className="priority__dot low" /> Low Priority
              </div>
            </div>
            {formErrors.priority && (
              <p className="error">{formErrors.priority}</p>
            )}
          </div>
          <div className="modal__section">
            <h3>Assign To</h3>
            <input
              type="text"
              placeholder="Add an assignee"
              className="modal__input"
              value={assignedTo}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onChange={(e) => setAssignedTo(e.target.value)} // Add onChange handler to update assignedTo state
            />
            {isEmailListVisible && (
              <div className="allowed-emails-list">
                {allowedEmails?.map((email, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      alignItems: "center",
                      padding: "5px 0",
                      borderBottom: "1px solid #ccc",
                    }}
                  >
                    <p>{email.email}</p>{" "}
                    {/* Update to display email correctly */}
                    <button onClick={() => handleAssignEmail(email.email)}>
                      Assign
                    </button>{" "}
                    {/* Pass email.email as argument */}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="modal__section">
            <h3>
              Checklist <span style={{ color: "red" }}>*</span> ({checkedCount}/
              {checklist.length})
            </h3>
            <div className="checklist__container">
              {checklist.map((item, index) => (
                <div key={index} className="checklist__item">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleCheckboxChange(index)}
                    className="checklist__checkbox"
                  />
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) =>
                      handleChecklistChange(index, e.target.value)
                    }
                    className="checklist__input"
                  />
                  <img
                    onClick={() => handleRemoveChecklistItem(index)}
                    src={Delete}
                    alt="delete"
                    className="checklist__delete"
                  />
                </div>
              ))}
            </div>
            {formErrors.checklist && (
              <p className="error">{formErrors.checklist}</p>
            )}
            <button className="add__new" onClick={handleAddChecklistItem}>
              + Add New
            </button>
          </div>

          <div className="modal__section modal__buttons">
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              placeholderText="Select Due Date"
              className="due__date"
            />
            <div className="modal__actions__button">
              <button
                className="modal__action__button cancel"
                onClick={onCloseModal}
              >
                Cancel
              </button>
              <button
                className="modal__action__button save"
                onClick={handleSaveTodo}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <Modal
        open={openAddPeopleModal}
        onClose={handleCloseAddPeopleModal}
        center
        classNames={{ modal: "custom-modal" }}
      >
        <div className="modal__content">
          <h3>Add people to the Board</h3>
          <input
            type="text"
            placeholder="Enter the email"
            className="modal__input"
            onChange={(e) => setAddPeople(e.target.value)}
          />
          <div className="modal__actions">
            <button
              className="modal__button save"
              onClick={() => handleAddPeople(addPeople)}
            >
              <span> Add</span>
            </button>
            <button
              className="modal__button cancel"
              onClick={handleCloseAddPeopleModal}
            >
              <span> Cancel</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Board;
