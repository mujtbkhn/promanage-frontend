import React, { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import Modal from "react-responsive-modal";
import Delete from "../../images/Delete.png";
import "react-responsive-modal/styles.css";
import "./Todo.css";
import { deleteTodoById, getTodoById, updateTodo } from "../../apis/todo";
import toast from "react-hot-toast";
import { Tooltip } from "react-tooltip";
import { getUserByEmail } from "../../apis/auth";
import ShimmerUI from "../ShimmerUI/ShimmerUI";

const Todo = ({
    todo,
    sectionName,
    onMoveTask,
    collapseAll,
    onCheckboxChange,
    fetchTodos,
    isLoading,
}) => {
    const [collapse, setCollapse] = useState(true);
    const [show, setShow] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isAssignDropdownOpen, setIsAssignDropdownOpen] = useState(false);
    const [allowedEmails, setAllowedEmails] = useState(null);
    const [isCreator, setIsCreator] = useState(false);
    const [newChecklistItem, setNewChecklistItem] = useState("");
    const [assignErrorMessage, setAssignErrorMessage] = useState("");
    const [editedTodo, setEditedTodo] = useState({
        title: todo.title || "",
        priority: todo.priority || "",
        assignedTo: todo.assignedTo || "",
        checklist: todo.checklist || [],
        date: todo.date ? format(parseISO(todo.date.split("T")[0]), "d MMM") : null,
    });

    useEffect(() => {
        if (editModalOpen && todo._id) {
            fetchTodoDetails(todo._id);
        }
    }, [editModalOpen, todo._id]);

    useEffect(() => {
        if (collapseAll) {
            setCollapse(true);
        }
    }, [collapseAll]);

    useEffect(() => {
        allowed();
    }, []);

    const fetchTodoDetails = async (todoId) => {
        try {
            const response = await getTodoById(todoId);
            const fetchedTodo = response;
            setIsCreator(fetchedTodo?.isCreator);
            setEditedTodo({
                title: fetchedTodo.todo?.title || "",
                priority: fetchedTodo.todo?.priority || "",
                assignedTo: fetchedTodo.todo?.assignedTo || "",
                checklist: fetchedTodo.todo?.checklist || [],
                section: fetchedTodo.todo?.section || "",
                date: fetchedTodo.todo.date.split("T")[0] || "",
            });
        } catch (error) {
            console.error("Error fetching todo:", error);
        }
    };

    const openEditModal = () => {
        setEditModalOpen(true);
        setShow(!show);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
    };

    const handleUpdateTodo = async () => {
        try {
            await updateTodo(todo._id, editedTodo);
            closeEditModal();
            fetchTodos();
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    const toggleCollapse = () => {
        setCollapse(!collapse);
    };

    const isDueDatePast = (dateString) => {
        const today = new Date();
        const dueDate = new Date(dateString);
        return dueDate < today;
    };

    const handleMoveButtonClick = (section) => {
        onMoveTask(todo._id, section);
    };

    const handleCheckboxChange = (index) => {
        const updatedChecklist = editedTodo.checklist.map((item, i) => {
            if (i === index) {
                return { ...item, completed: !item.completed };
            }
            return item;
        });
        setEditedTodo({ ...editedTodo, checklist: updatedChecklist });
        onCheckboxChange(todo._id, index, !editedTodo.checklist[index].completed);
    };

    const handleEditChecklistItem = (index, newText) => {
        const updatedChecklist = [...editedTodo.checklist];
        updatedChecklist[index].item = newText;
        setEditedTodo({
            ...editedTodo,
            checklist: updatedChecklist,
        });
    };

    const handleAddChecklistItem = () => {
        if (newChecklistItem.trim() !== "") {
            const updatedChecklist = [
                ...editedTodo.checklist,
                { item: newChecklistItem, completed: false },
            ];
            setEditedTodo({ ...editedTodo, checklist: updatedChecklist });
            setNewChecklistItem("");
        }
    };

    const handleRemoveChecklistItem = (index) => {
        const updatedChecklist = editedTodo.checklist.filter((_, i) => i !== index);
        setEditedTodo({ ...editedTodo, checklist: updatedChecklist });
    };

    const openDeleteModal = () => {
        setDeleteModalOpen(true);
        setShow(!show);
    };

    const closeDeleteModal = () => {
        setDeleteModalOpen(false);
    };

    const handleDeleteTodo = async () => {
        try {
            await deleteTodoById(todo._id);
            closeDeleteModal();
            fetchTodos();
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    const handleView = async () => {
        try {
            const storyURL = `${window.location.origin}/view/${todo._id}`;
            await navigator.clipboard.writeText(storyURL);
            toast.success("Link Copied", {
                style: {
                    position: "relative",
                    top: "4rem",
                    color: "black",
                    backgroundColor: "#F6FFF9",
                    border: " 1px solid #4DC3B7",
                    fontSize: "1.5rem",
                },
            });
            setShow(!show);
        } catch (error) {
            console.error(error);
        }
    };

    const buttons = [
        { value: "BACKLOG", label: "BACKLOG" },
        { value: "IN PROGRESS", label: "PROGRESS" },
        { value: "TODO", label: "TO-DO" },
        { value: "DONE", label: "DONE" },
    ];

    const allowed = async () => {
        try {
            const data = await getUserByEmail();
            setAllowedEmails(data.allowedEmails);
        } catch (error) {
            console.error("Error Fetching Allowed Emails", error);
        }
    };

    const toggleAssignDropdown = () => {
        if (allowedEmails.length === 0) {
            setAssignErrorMessage(
                "Please add people to the board to assign them a task"
            );
        } else {
            setIsAssignDropdownOpen(!isAssignDropdownOpen);
            setAssignErrorMessage("");
        }
    };

    const trimmedTitle =
        todo.title.length >= 20 ? todo.title.slice(0, 20) + "..." : todo.title;

    return (
        <div className="todo_main">
            {isLoading ? (
                <ShimmerUI />
            ) : (
                <>
                    <div className="todo_priority common">
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <p>
                                <span
                                    className={`priority__dot ${todo.priority === "HIGH"
                                        ? "high"
                                        : todo.priority === "MODERATE"
                                            ? "moderate"
                                            : "low"
                                        }`}
                                ></span>
                                {todo.priority.toUpperCase()} PRIORITY
                            </p>
                            {todo.assignedTo ? (
                                <h3 className="color-assign">
                                    {todo.assignedTo?.slice(0, 2).toUpperCase()}
                                </h3>
                            ) : (
                                ""
                            )}
                        </div>
                        <img
                            width="20"
                            height="20"
                            src="https://img.icons8.com/ios-glyphs/60/ellipsis.png"
                            alt="ellipsis"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                // openEditModal()
                                setShow((prev) => !prev)
                            }}
                        />
                        {show && (
                            <div className="show">
                                <p onClick={openEditModal}>Edit</p>
                                <p onClick={handleView}>Share</p>
                                <p style={{ color: "red" }} onClick={openDeleteModal}>
                                    Delete
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="todo_heading">
                        <a className={`my-anchor-element-${todo._id}`}>
                            <h3>{trimmedTitle}</h3>
                        </a>
                        <Tooltip
                            anchorSelect={`.my-anchor-element-${todo._id}`}
                            place="top"
                        >
                            {todo.title}
                        </Tooltip>
                    </div>
                    <div className="todo_checklist common">
                        <div>
                            <h3>
                                Checklist (
                                {todo.checklist.filter((item) => item.completed).length}/
                                {todo.checklist.length})
                            </h3>
                        </div>
                        <div onClick={toggleCollapse} style={{ cursor: "pointer" }}>
                            <img
                                width="30"
                                height="30"
                                src={
                                    collapse
                                        ? "https://img.icons8.com/ios/50/collapse-arrow--v2.png"
                                        : "https://img.icons8.com/ios/50/expand-arrow--v2.png"
                                }
                                alt="collapse-arrow--v2"
                                className="pointer"
                            />
                        </div>
                    </div>
                    {!collapse && (
                        <ul>
                            {editedTodo.checklist.map((item, index) => (
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
                                        readOnly
                                        className="checklist__input"
                                    />
                                </div>
                            ))}
                        </ul>
                    )}
                    <div className="todo_button common">
                        <div>
                            {todo.date ? (
                                <button
                                    style={{
                                        backgroundColor:
                                            sectionName === "DONE"
                                                ? "#55B054"
                                                : isDueDatePast(todo.date)
                                                    ? "red"
                                                    : "#F0F0F0",
                                        color:
                                            sectionName === "DONE"
                                                ? "white"
                                                : isDueDatePast(todo.date)
                                                    ? "white"
                                                    : "initial",
                                    }}
                                >
                                    {format(parseISO(todo.date), "d MMM")}
                                </button>
                            ) : (
                                ""
                            )}
                        </div>

                        <div style={{ display: "flex" }}>
                            {buttons
                                .filter((button) => button.value !== sectionName)
                                .map((button) => (
                                    <button
                                        className="pointer custom_button"
                                        key={button.value}
                                        value={button.value}
                                        onClick={() => handleMoveButtonClick(button.value)}
                                    >
                                        {button.label}
                                    </button>
                                ))}
                        </div>
                    </div>
                    <Modal
                        open={editModalOpen}
                        onClose={closeEditModal}
                        center
                        classNames={{ modal: "custom-modal" }}
                    >
                        <div className="modal__content">
                            <h2>Edit Todo</h2>
                            <div className="modal__section">
                                <h3>Title</h3>
                                <input
                                    type="text"
                                    value={editedTodo.title}
                                    onChange={(e) =>
                                        setEditedTodo({ ...editedTodo, title: e.target.value })
                                    }
                                    placeholder="Enter Task Title"
                                    className="modal__input"
                                />
                            </div>
                            <div className="modal__section">
                                <h3>Select Priority</h3>
                                <div className="priority__buttons">
                                    <div
                                        className={`priority__button ${editedTodo.priority === "HIGH" ? "selected" : ""
                                            }`}
                                        onClick={() =>
                                            setEditedTodo({ ...editedTodo, priority: "HIGH" })
                                        }
                                    >
                                        <span className="priority__dot high" /> High Priority
                                    </div>
                                    <div
                                        className={`priority__button ${editedTodo.priority === "MODERATE" ? "selected" : ""
                                            }`}
                                        onClick={() =>
                                            setEditedTodo({ ...editedTodo, priority: "MODERATE" })
                                        }
                                    >
                                        <span className="priority__dot moderate" /> Moderate
                                        Priority
                                    </div>
                                    <div
                                        className={`priority__button ${editedTodo.priority === "LOW" ? "selected" : ""
                                            }`}
                                        onClick={() =>
                                            setEditedTodo({ ...editedTodo, priority: "LOW" })
                                        }
                                    >
                                        <span className="priority__dot low" /> Low Priority
                                    </div>
                                </div>
                            </div>

                            <div className="todo_assign">
                                <h3>Assign To</h3>
                                <div className="assign__dropdown">
                                    <input
                                        type="text"
                                        placeholder="Add an assignee"
                                        className="modal__input"
                                        value={editedTodo.assignedTo}
                                        onFocus={isCreator ? toggleAssignDropdown : null}
                                        disabled={!isCreator}
                                    />

                                    {assignErrorMessage && (
                                        <p className="error">{assignErrorMessage}</p>
                                    )}
                                    {isCreator && isAssignDropdownOpen && (
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
                                                    <button
                                                        onClick={() => {
                                                            console.log("todo button clicked");
                                                            setEditedTodo({
                                                                ...editedTodo,
                                                                assignedTo: email.email,
                                                            });
                                                            toggleAssignDropdown();
                                                        }}
                                                    >
                                                        Assign
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal__section">
                                <h3>Checklist</h3>
                                {editedTodo.checklist.map((item, index) => (
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
                                            onChange={(e) => handleEditChecklistItem(index, e.target.value)}
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

                                <div className="checklist__item">
                                    <input
                                        type="text"
                                        value={newChecklistItem}
                                        onChange={(e) => setNewChecklistItem(e.target.value)}
                                        className="checklist__input"
                                        placeholder="New checklist item"
                                    />
                                    <button onClick={handleAddChecklistItem} className="add__new">
                                        + Add New
                                    </button>
                                </div>
                            </div>

                            <div className="modal__section">
                                <h3>Due Date</h3>
                                <input
                                    type="date"
                                    value={editedTodo.date}
                                    onChange={(e) => {
                                        setEditedTodo({ ...editedTodo, date: e.target.value });
                                        console.log(e.target.value);
                                        console.log(editedTodo.date);
                                    }}
                                    className="modal__input"
                                />
                            </div>
                            <div className="modal__actions">
                                <button className="modal__button save" onClick={closeEditModal}>
                                    <span> Cancel</span>
                                </button>
                                <button
                                    className="modal__button cancel"
                                    onClick={handleUpdateTodo}
                                >
                                    <span>Save</span>
                                </button>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        open={deleteModalOpen}
                        onClose={closeDeleteModal}
                        center
                        classNames={{ modal: "custom-modal" }}
                    >
                        <div className="modal__content">
                            <h3>Are you sure you want to delete this todo?</h3>
                            <div className="modal__actions">
                                <button
                                    className="modal__button save"
                                    onClick={handleDeleteTodo}
                                >
                                    <span> Delete</span>
                                </button>
                                <button
                                    className="modal__button cancel"
                                    onClick={closeDeleteModal}
                                    classNames={{ modal: "custom-modal" }}
                                >
                                    <span> Cancel</span>
                                </button>
                            </div>
                        </div>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default Todo;
