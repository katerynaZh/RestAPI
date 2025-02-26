import React from "react";
import { List, Button } from "antd";
import { CustomTask } from "./useTasks";

type Props = {
    tasks?: CustomTask[];
    onEdit: (task: CustomTask) => void;
};

const TasksList = ({ tasks, onEdit }: Props) => {
    return (
        <List
    header={<h2>Task List</h2>}
    bordered
    style={{ width: "100%", background: "#fff" }} // Ensure full width
    dataSource={tasks}
    renderItem={(task) => (
        <List.Item
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                whiteSpace: "normal",  // Prevent unnecessary text breaking
                wordWrap: "break-word",
            }}
            actions={[
                <Button type="link" onClick={() => onEdit(task)}>
                    Edit
                </Button>,
            ]}
        >
            <div style={{ flex: 1, overflow: "hidden" }}>
                <strong>{task.title}</strong>
                <p style={{ margin: 0, color: "#555" }}>{task.description}</p>
            </div>
            <span style={{ marginLeft: "10px", whiteSpace: "nowrap" }}>{task.status}</span>
        </List.Item>
    )}
/>
    );
};

export default TasksList;
