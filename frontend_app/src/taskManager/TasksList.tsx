import React from "react";
import { CustomTask } from "./useTasks";

type Props = {
    tasks?: CustomTask[],
    onEdit: (task: CustomTask) => void,
}

const TasksList = ({tasks, onEdit}: Props) =>{
    return <>
      <h2 data-testid="tasks-list">Task List</h2>
      <ul>
        {tasks && tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.description} ({task.status})
            <button data-testid="editing-task-btn" onClick={() => onEdit(task)}>Edit</button>
          </li>
        ))}
      </ul>
      </>; 
}

export default TasksList;