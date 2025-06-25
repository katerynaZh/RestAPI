import React from 'react';
import styled from 'styled-components';
import { List, Button } from 'antd';
import { CustomTask } from './types';
import { Typography } from 'antd';

const { Text, Title } = Typography;

type Props = {
  tasks?: CustomTask[];
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
};

const TasksList = ({
  tasks,
  onEdit, 
  onDelete,
}: Props) => {
  return (
    <StyledList
      data-testid="tasks-list"
      header={<Title level={2}>Task List</Title>}
      bordered
      dataSource={tasks}
      renderItem={(task) => {
        const typedTask = task as CustomTask;

        return (
          <StyledListItem
            actions={[
              <Button type="link" data-testid="editTaskBtn" onClick={() => onEdit(typedTask.id)}>
                Edit
              </Button>,
              <Button type="link" data-testid="deleteTaskBtn" onClick={() => onDelete(typedTask.id)}>
                Delete
              </Button>,
            ]}
          >
            <TaskDetails>
              <Text strong>{typedTask.title}</Text>
              <Typography>{typedTask.description}</Typography>
            </TaskDetails>
            <StatusText>{typedTask.status}</StatusText>
          </StyledListItem>
        );
      }}
    />
  );
};

// Styled Components
const StyledList = styled(List)`
  width: 100%;
  background: #fff;
`;

const StyledListItem = styled(List.Item)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  white-space: normal;
  word-wrap: break-word;
`;

const TaskDetails = styled.div`
  flex: 1;
  overflow: hidden;

  strong {
    display: block;
  }

  p {
    margin: 0;
    color: #555;
  }
`;

const StatusText = styled.span`
  margin-left: 10px;
  white-space: nowrap;
`;

export default TasksList;
