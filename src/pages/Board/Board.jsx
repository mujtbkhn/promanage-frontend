import React, { useEffect, useState } from "react";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { DatePicker } from "antd";
import dayjs from 'dayjs';
import TodoComp from "../../components/TodoComp/TodoComp";
import Delete from "../../images/Delete.png";
import "./Board.css";
import {
  addUserByEmail,
  getUserByEmail,
  getUserFromToken,
} from "../../apis/auth";
import {
  getCreateTodo,
  getTodos,
  moveTask,
  updateChecklistItem,
} from "../../apis/todo";
import { format, parseISO } from "date-fns";

const Board = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [checklist, setChecklist] = useState([{ item: "", completed: false }]);
  const [userDetails, setUserDetails] = useState("");
  const [todos, setTodos] = useState([]);
  const [date, setDate] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("week");
  const [formErrors, setFormErrors] = useState({});
  const [openAddPeopleModal, setOpenAddPeopleModal] = useState(false);
  const [addPeople, setAddPeople] = useState("");
  const [allowedEmails, setAllowedEmails] = useState(null);
  const [addPeopleMessage, setAddPeopleMessage] = useState("");
  const [addPeopleError, setAddPeopleError] = useState("");
  const [isEmailListVisible, setIsEmailListVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [assignErrorMessage, setAssignErrorMessage] = useState("");

  // useEffect(() => {
  //   console.log("date : ", date ? date.format("YYYY-MM-DD HH:mm:ss") : "No date selected");
  // }, [date])

  function onChange(value) {
    setDate(value);
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = await getUserFromToken();
      setUserDetails(user);
      fetchTodos(selectedFilter);
    };
    fetchUserDetails();

    const onStorageChange = () => {
      fetchUserDetails();
    };

    window.addEventListener("storage", onStorageChange);

    return () => {
      window.removeEventListener("storage", onStorageChange);
    };
  }, []);

  useEffect(() => {
    fetchTodos(selectedFilter);
  }, [selectedFilter]);

  useEffect(() => {
    allowed();
  }, []);

  useEffect(() => { }, [userDetails]);

  const allowed = async () => {
    try {
      const data = await getUserByEmail();
      setAllowedEmails(data.allowedEmails);
    } catch (error) {
      console.error("Error Fetching Allowed Emails", error);
    }
  };

  const fetchTodos = async (filter) => {
    setIsLoading(true);
    try {
      const data = await getTodos(filter);
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setSelectedFilter(e.target.value);
  };

  const handleInputFocus = () => {
    if (allowedEmails?.length === 0) {
      setAssignErrorMessage(
        "Please add people to the board to assign them a task"
      );
    } else {
      setIsEmailListVisible((prev) => !prev);
      setAssignErrorMessage("");
    }
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
    setAddPeopleMessage("");
    window.location.reload();
  };

  const resetFormFields = () => {
    setTitle("");
    setSelectedPriority("");
    setAssignedTo("");
    setChecklist([{ item: "", completed: false }]);
    setDate("")
  };

  const handlePriorityClick = (priority) => {
    setSelectedPriority(priority);
  };

  const handleCheckboxChange = async (todoId, itemIndex, completed) => {
    try {
      await updateChecklistItem(todoId, itemIndex, completed);
      setTodos(prevTodos =>
        prevTodos.map(todo => {
          if (todo._id === todoId) {
            return {
              ...todo,
              checklist: todo.checklist.map((item, index) =>
                index === itemIndex ? { ...item, completed } : item
              )
            };
          }
          return todo;
        })
      );
    } catch (error) {
      console.error("Error updating checklist item:", error);
    }
  };

  const handleChecklistChange = (index, value) => {
    const updatedChecklist = [...checklist];
    updatedChecklist[index].item = value;
    setChecklist(updatedChecklist);
  };

  const handleAddChecklistItem = () => {
    setChecklist([...checklist, { item: "", completed: false }]);
  };

  const handleRemoveChecklistItem = (index) => {
    const updatedChecklist = checklist.filter((_, i) => i !== index);
    setChecklist(updatedChecklist);
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
      const todoData = {
        title,
        priority: selectedPriority,
        checklist,
        section: "TODO",
        date: date ? date.toISOString() : null
      };

      if (assignedTo) {
        todoData.assignedTo = assignedTo;
      }
      // console.log("Sending todo data:", todoData);  // Log the data being sent
      await getCreateTodo(todoData);

      onCloseModal();
      fetchTodos();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleMoveTask = async (todoId, section) => {
    try {
      await moveTask(todoId, section);
      fetchTodos();
    } catch (error) {
      console.error("Error moving task:", error);
    }
  };

  const handleAddPeople = async (email) => {
    try {
      await addUserByEmail(email);
      await getUserByEmail();
      setAddPeopleMessage(`Added ${email}`);
      setAddPeopleError(""); // Clear any previous error message
    } catch (error) {
      setAddPeopleError(error?.message || "Error adding people");
      console.error("Error adding people", error);
    }
  };

  const checkedCount = checklist.filter((item) => item.completed).length;

  const handleAssignEmail = (email) => {
    setAssignedTo(email);
    setIsEmailListVisible(false);
  };

  const today = new Date().toISOString().split("T")[0];
  
  return (
    <div className="board__top">
      <div className="top__heading">
        <h2>Welcome ! {userDetails?.name}</h2>
        <p> {format(parseISO(today), "d MMM")}</p>
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
          onCheckboxChange={handleCheckboxChange}
          fetchTodos={fetchTodos}
          isLoading={isLoading}
          date={date}
        />
        <TodoComp
          name="TODO"
          onPlusClick={() => onOpenModal("Plus clicked in To do")}
          todos={todos.filter((todo) => todo.section === "TODO")}
          onMoveTask={handleMoveTask}
          onCheckboxChange={handleCheckboxChange}
          fetchTodos={fetchTodos}
          isLoading={isLoading}
          date={date}
        />
        <TodoComp
          name="IN PROGRESS"
          todos={todos.filter((todo) => todo.section === "IN PROGRESS")}
          onMoveTask={handleMoveTask}
          onCheckboxChange={handleCheckboxChange}
          fetchTodos={fetchTodos}
          isLoading={isLoading}
          date={date}
        />
        <TodoComp
          name="DONE"
          todos={todos.filter((todo) => todo.section === "DONE")}
          onMoveTask={handleMoveTask}
          onCheckboxChange={handleCheckboxChange}
          fetchTodos={fetchTodos}
          isLoading={isLoading}
          date={date}
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
                className={`priority__button ${selectedPriority === "HIGH" ? "selected" : ""
                  }`}
                onClick={() => handlePriorityClick("HIGH")}
              >
                <span className="priority__dot high" /> High Priority
              </div>
              <div
                className={`priority__button ${selectedPriority === "MODERATE" ? "selected" : ""
                  }`}
                onClick={() => handlePriorityClick("MODERATE")}
              >
                <span className="priority__dot moderate" /> Moderate Priority
              </div>
              <div
                className={`priority__button ${selectedPriority === "LOW" ? "selected" : ""
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
            />
            {assignErrorMessage && (
              <p className="error">{assignErrorMessage}</p>
            )}
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
                    <p className="initials">
                      {email.email.slice(0, 2).toUpperCase()}
                    </p>
                    <p>{email.email}</p>
                    <button onClick={() => handleAssignEmail(email.email)}>
                      Assign
                    </button>
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
                    placeholder="Enter the checklist item"
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
            <DatePicker onChange={onChange}
              value={date}
              format="YYYY-MM-DD" />
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
          {!addPeopleMessage && (
            <>
              <input
                type="text"
                placeholder="Enter the email"
                className="modal__input"
                onChange={(e) => setAddPeople(e.target.value)}
              />
              {addPeopleError && <p className="error">{addPeopleError}</p>}
            </>
          )}
          {addPeopleMessage && <p>{addPeopleMessage}</p>}{" "}
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
