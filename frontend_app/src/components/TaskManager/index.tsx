import React, { useEffect, useState } from 'react';
import { Button, Layout } from 'antd';
import useTasks, { CustomTask } from './api/useTasks'; //'../../mocked/useTasks';
import TasksList from './TasksList';
import AddOrEditDialog from './AddOrEditDialog';
import styled from 'styled-components';

const TaskManager = () => {
  const { tasks, addOrUpdateTask } = useTasks();
  const [editingTask, setEditingTask] = useState<CustomTask | undefined>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (tasks.length === 0) return;

    handleFormReset();
  }, [tasks]);

  const handleEditStart = (task: CustomTask) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const handleFormReset = () => {
    setEditingTask(undefined);
    setIsDialogOpen(false);
  };

  const handleSave = (updatedTask: CustomTask) => {
    if (!updatedTask?.title.trim()) return;

    const newTask = {
      ...updatedTask,
      id: updatedTask.id ?? tasks.length + 1,
      status: 'pending',
    };

    addOrUpdateTask(newTask).then(handleFormReset);
  };

  return (
    <StyledLayout>
      <StyledContent>
        <TasksList tasks={tasks} onEdit={handleEditStart} />
        <StyledButton type="primary" onClick={() => setIsDialogOpen(true)}>
          Add Task
        </StyledButton>
        <AddOrEditDialog
          open={isDialogOpen}
          task={editingTask}
          onSave={handleSave}
          onCancel={handleFormReset}
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
