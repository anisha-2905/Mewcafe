import { useEffect, useMemo, useState } from 'react';
import { getStoredValue, setStoredValue } from '../utils/localStorage.js';

const TASK_STORAGE_KEY = 'mewcafe:tasks';
const priorities = ['Low', 'Medium', 'High'];

function createTaskId() {
  return crypto.randomUUID?.() ?? `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createTask({ title, estimatedPomodoros, priority }) {
  return {
    id: createTaskId(),
    title: title.trim(),
    completed: false,
    estimatedPomodoros: Number(estimatedPomodoros) || 1,
    priority,
    createdAt: Date.now()
  };
}

function normalizeTasks(savedTasks) {
  if (!Array.isArray(savedTasks)) {
    return [];
  }

  return savedTasks
    .filter((task) => task && typeof task.title === 'string')
    .map((task) => ({
      id: task.id || createTaskId(),
      title: task.title,
      completed: Boolean(task.completed),
      estimatedPomodoros: Number(task.estimatedPomodoros) || 1,
      priority: priorities.includes(task.priority) ? task.priority : 'Medium',
      createdAt: Number(task.createdAt) || Date.now()
    }));
}

function TaskPanel() {
  const [tasks, setTasks] = useState(() => normalizeTasks(getStoredValue(TASK_STORAGE_KEY, [])));
  const [taskTitle, setTaskTitle] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(1);
  const [priority, setPriority] = useState('Medium');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const taskCounts = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    return {
      total: tasks.length,
      completed,
      active: tasks.length - completed
    };
  }, [tasks]);

  useEffect(() => {
    setStoredValue(TASK_STORAGE_KEY, tasks);
  }, [tasks]);

  function handleAddTask(event) {
    event.preventDefault();

    if (!taskTitle.trim()) {
      return;
    }

    setTasks((currentTasks) => [
      createTask({ title: taskTitle, estimatedPomodoros, priority }),
      ...currentTasks
    ]);
    setTaskTitle('');
    setEstimatedPomodoros(1);
    setPriority('Medium');
  }

  function toggleTask(taskId) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId));
  }

  function startEditing(task) {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  }

  function saveEditing(taskId) {
    if (!editingTitle.trim()) {
      deleteTask(taskId);
      setEditingTaskId(null);
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? { ...task, title: editingTitle.trim() } : task
      )
    );
    setEditingTaskId(null);
  }

  function cancelEditing() {
    setEditingTaskId(null);
    setEditingTitle('');
  }

  return (
    <section className="bottom-panel task-panel glass-panel" aria-label="Tasks">
      <div className="task-panel__header">
        <div>
          <h2>Tasks</h2>
          <p>{taskCounts.active} active / {taskCounts.total} total</p>
        </div>
        <span className="task-panel__count">{taskCounts.completed} done</span>
      </div>

      <form className="task-panel__form" onSubmit={handleAddTask}>
        <input
          className="task-panel__input"
          type="text"
          value={taskTitle}
          placeholder="Add a cozy task"
          aria-label="Task title"
          onChange={(event) => setTaskTitle(event.target.value)}
        />
        <div className="task-panel__meta">
          <label>
            <span>Pomodoros</span>
            <input
              type="number"
              min="1"
              max="12"
              value={estimatedPomodoros}
              onChange={(event) => setEstimatedPomodoros(event.target.value)}
            />
          </label>
          <label>
            <span>Priority</span>
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              {priorities.map((priorityOption) => (
                <option key={priorityOption} value={priorityOption}>
                  {priorityOption}
                </option>
              ))}
            </select>
          </label>
          <button className="task-panel__add" type="submit">Add</button>
        </div>
      </form>

      {tasks.length === 0 ? (
        <p className="task-panel__empty">No tasks yet. Add one small thing to begin.</p>
      ) : (
        <ul className="task-panel__list">
          {tasks.map((task) => (
            <li key={task.id} className={`task-item ${task.completed ? 'is-complete' : ''}`}>
              <button
                className="task-item__check"
                type="button"
                aria-label={task.completed ? 'Mark task active' : 'Mark task complete'}
                aria-pressed={task.completed}
                onClick={() => toggleTask(task.id)}
              />

              <div className="task-item__content">
                {editingTaskId === task.id ? (
                  <input
                    className="task-item__edit-input"
                    type="text"
                    value={editingTitle}
                    aria-label="Edit task title"
                    autoFocus
                    onChange={(event) => setEditingTitle(event.target.value)}
                    onBlur={() => saveEditing(task.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        saveEditing(task.id);
                      }

                      if (event.key === 'Escape') {
                        cancelEditing();
                      }
                    }}
                  />
                ) : (
                  <button
                    className="task-item__title"
                    type="button"
                    onClick={() => startEditing(task)}
                  >
                    {task.title}
                  </button>
                )}
                <div className="task-item__tags">
                  <span>{task.estimatedPomodoros} pomo</span>
                  <span className={`task-item__priority task-item__priority--${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              <button
                className="task-item__delete"
                type="button"
                aria-label="Delete task"
                onClick={() => deleteTask(task.id)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default TaskPanel;
