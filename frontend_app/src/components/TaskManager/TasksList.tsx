import React from 'react';
import styled from 'styled-components';
import { List, Button, Typography } from 'antd';
import { CustomTask } from './api/useTasks';

const { Text, Title } = Typography;

type Props = {
  tasks?: CustomTask[];
  onEdit: (task: CustomTask) => void;
};

const TasksList = ({ tasks, onEdit }: Props) => {
  return (
    <StyledList
      header={<Title level={2}>Task List</Title>}
      bordered
      dataSource={tasks}
      renderItem={(task) => {
        const typedTask = task as CustomTask;
        const {title, description, status} = typedTask;

        return (
          <StyledListItem
            actions={[
              <Button key={1} type="link" onClick={() => onEdit(typedTask)}>
                Edit
              </Button>,
            ]}
          >
            <TaskDetails>
              <Text strong>{title}</Text>
              <Typography>{description}</Typography>
            </TaskDetails>
            <StatusText>{status}</StatusText>
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
