import React, { useEffect, useState } from 'react';
import { Button, Layout } from 'antd';
import useTasks, { CustomTask } from './useTasks';
import TasksList from './TasksList';
import AddOrEditDialog from './AddOrEditDialog';
import styled from 'styled-components';

const TaskManager = () => {
  const { tasks, addOrUpdateTask } = useTasks();
  const [editingTask, setEditingTask] = useState<CustomTask | undefined>();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    resetForm();
  }, [tasks]);

  const startEditing = (task: CustomTask) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const resetForm = () => {
    setEditingTask(undefined);
    setModalVisible(false);
  };

  const onSave = (updatedTask: CustomTask) => {
    if (!updatedTask?.title.trim()) return;

    const newTask = {
      id: editingTask ? editingTask.id : tasks.length + 1,
      title: updatedTask.title,
      description: updatedTask.description,
      status: 'pending',
    };

    addOrUpdateTask(newTask).then(resetForm);
  };

  return (
    <StyledLayout>
      <StyledContent>
        <TasksList tasks={tasks} onEdit={startEditing} />
        <StyledButton type="primary" onClick={() => setModalVisible(true)}>
          Add Task
        </StyledButton>
        <AddOrEditDialog
          visible={modalVisible}
          task={editingTask}
          onSave={onSave}
          onCancel={resetForm}
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
