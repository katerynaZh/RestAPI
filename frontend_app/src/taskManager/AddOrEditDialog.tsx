import React, { MouseEventHandler, useEffect, useState } from "react";
import { CustomTask } from "./useTasks"

type Props = {
    header: string,
    saveButtonText: string,
    task?: CustomTask,
    onSave: (task: CustomTask)  => void,
    onCancel:()=>void,
}
const INIT_TASK = {title: "", description: ""} as CustomTask;

const AddOrEditDialog = ({header, task, saveButtonText, onSave, onCancel}: Props) => {
    const [editingTask, setEditingTask] = useState<CustomTask>(INIT_TASK);

    useEffect(() => {
        if (task) 
        {setEditingTask(task)}
    }, [task])
console.log("RENDER FORM", header);
return <>
    <h3>{header}</h3>
    <input
    type="text"
    data-testid="input-title"
    value={editingTask?.title}
    onChange={(e) => setEditingTask((prev)=>{return {...prev, title: e.target.value};})}
    placeholder="Task title..."
    />
    <br />
    <input
    type="text"
    data-testid="input-description"
    value={editingTask.description}
    onChange={(e) => setEditingTask((prev)=>{return {...prev, description: e.target.value};})}
    placeholder="Task description..."
    />
    <br />
    <button data-testid="update-task-btn" onClick={()=>onSave(editingTask)}>{saveButtonText}</button>
     {task && <button onClick={onCancel}>Cancel</button>}</>
}

export default AddOrEditDialog; 