import React, { useEffect, useState } from "react";
import useTasks, { CustomTask } from "./useTasks";
import TasksList from "./TasksList";
import AddOrEditDialog from "./AddOrEditDialog";

const TaskManager = ()=>{
    const { tasks, addOrUpdateTask } = useTasks();

    const [editingTask, setEditingTask] = useState<CustomTask>();

    useEffect(() => {
        resetForm();
    }, [tasks]);

    // Start editing a task
    const startEditing = (task) => {
        setEditingTask(task);
    };

    // Reset form fields
    const resetForm = () => {
        setEditingTask(undefined);
    };
      
  // Handle adding or updating a task
  const onSave = (updatedTask: CustomTask) => {
    if (!updatedTask?.title.trim()) return;

    const newTask = {
      id: editingTask ? editingTask.id : tasks.length + 1, // Use existing ID for updates
      title: updatedTask.title,
      description: updatedTask.description,
      status: "pending", // Default status
    };

    addOrUpdateTask(newTask);
  };

  console.log("RENDER");
  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <TasksList tasks={tasks} onEdit={startEditing}/>

      {!editingTask && <AddOrEditDialog header="Add Task" saveButtonText= "Add Task" onSave={onSave} onCancel={resetForm} />}
      {editingTask && editingTask.id && <AddOrEditDialog header="Edit Task" task={editingTask} saveButtonText= "Update Task"  onSave={onSave} onCancel={resetForm} />}     
    </div>
  );
};

export default TaskManager;