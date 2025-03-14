import React, { useEffect, useState } from 'react';
import { Button, Layout } from 'antd';
import useTasks from './api/useTasks';
import { CustomTask } from './types';
import TasksList from './TasksList';
import AddOrEditDialog from './AddOrEditDialog';
import styled from 'styled-components';
import Dialog from '../common/Dialog';

const TaskManager = () => {
  const { tasks, addOrUpdateTask, deleteTask } = useTasks();

  const [taskInEditId, setTaskInEditId] = useState<number | undefined>();
  const [delTaskid, setdelTaskid] = useState<number | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDelConfirmOpen, setIsDelConfirmOpen] = useState(false);
  useEffect(() => {
    if (tasks.length === 0) return;

    resetForm();
  }, [tasks]);

  const startEditing = (taskId: number) => {
    setTaskInEditId(taskId);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setTaskInEditId(undefined);
    setIsDialogOpen(false);
  };

  const onSave = (updatedTask: CustomTask) => {
    if (!updatedTask?.title.trim()) return;

    const newTask = {
      ...updatedTask,
      id: updatedTask.id ?? tasks.length + 1,
      status: 'pending',
    };

    addOrUpdateTask(newTask).then(resetForm);
  };

  const onDelete = (taskId: number) => {
    setdelTaskid(taskId);
    setIsDelConfirmOpen(true);
  };

  const handleDeleteTask = () => { 
    if (!delTaskid) return;
    deleteTask(delTaskid)
    setIsDelConfirmOpen(false);
  }

  const handleCanceleTask = () => { 
    setdelTaskid(undefined);
    setIsDelConfirmOpen(false);
  }

  const taskInEdit = tasks?.find((task) => task.id === taskInEditId);
  const delTitle = tasks?.find((task) => task.id === delTaskid)?.title; // this is the best way to get the title of the task to be deleted

  return (
    <StyledLayout>
      <StyledContent>
        <TasksList tasks={tasks} onEdit={startEditing} onDelete={onDelete} />
        <StyledButton type="primary" onClick={() => setIsDialogOpen(true)}>
          Add Task
        </StyledButton>
        <AddOrEditDialog
          open={isDialogOpen}
          task={taskInEdit}
          onSave={onSave}
          onCancel={resetForm}
        />
        <Dialog
          open={isDelConfirmOpen}
          title={'Delete Task'}
          submitLabel={'Delete'}
          onSubmit={handleDeleteTask}
          onCancel={handleCanceleTask}
          children={
          <p>Are you sure you want to delete {delTitle} task?</p>
          }
        />
      </StyledContent>
    </StyledLayout>
  );
};

// Styled Components
const StyledLayout = styled(Layout)`
  min-height: 100vh;
  padding: 20px;
  background: #fff;
`;

const StyledContent = styled(Layout.Content)`
  max-width: 800px;
  width: 100%;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
`;

export default TaskManager;
